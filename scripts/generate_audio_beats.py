#!/usr/bin/env python3
"""
TTS + 音频静默检测 beats 生成器
输入：vocab config JSON
输出：每个 scene 的 mp3 + beats JSON（startFrame/endFrame）
"""

import os
from pathlib import Path

# 加载 .env 文件
env_path = Path(__file__).parent.parent.resolve() / ".env"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").strip().split("\n"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip()

import argparse
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

try:
    from pydub import AudioSegment
    from pydub.silence import detect_nonsilent
except ImportError as e:
    print(f"Missing pydub: {e}", file=sys.stderr)
    sys.exit(1)

DEFAULT_FPS = 30
MIN_SILENCE_LEN = 300  # ms
SILENCE_THRESH = -42   # dBFS
COST_PER_10K_CHARS = 0.1  # 参考单价（元/万字符）

AZURE_TTS_URL = "https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"


def synthesize_azure(text: str, voice: str = "female") -> bytes:
    """使用微软 Azure TTS 合成语音"""
    subscription_key = os.environ["AZURE_SPEECH_KEY"]
    region = os.environ["AZURE_SPEECH_REGION"]
    voice_name = os.environ.get("AZURE_SPEECH_VOICE", "zh-CN-XiaoxiaoNeural")
    speech_rate = os.environ.get("AZURE_SPEECH_RATE", "1.0")
    speech_style = os.environ.get("AZURE_SPEECH_STYLE", None)  # e.g., "cheerful", "sad"

    url = AZURE_TTS_URL.format(region=region)

    # 将速率转换为 Azure SSML 格式（如 1.1 -> "+10.00%"，0.9 -> "-10.00%"）
    try:
        rate_float = float(speech_rate)
        if rate_float > 1.0:
            rate_ssml = f"+{(rate_float - 1.0) * 100:.2f}%"
        elif rate_float < 1.0:
            rate_ssml = f"{(rate_float - 1.0) * 100:.2f}%"
        else:
            rate_ssml = "1.0"
    except ValueError:
        rate_ssml = "1.0"  # fallback

    # 构建 SSML
    if speech_style:
        ssml = f"""<speak version='1.0'
            xmlns='http://www.w3.org/2001/10/synthesis'
            xml:lang='zh-CN'
            xmlns:mstts='http://www.w3.org/2001/10/synthesis'>
            <voice name='{voice_name}'>
                <prosody rate="{rate_ssml}">
                    <mstts:express-as style="{speech_style}">{text}</mstts:express-as>
                </prosody>
            </voice>
        </speak>"""
    else:
        ssml = f"""<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>
            <voice name='{voice_name}'>
                <prosody rate="{rate_ssml}">{text}</prosody>
            </voice>
        </speak>"""

    response = requests.post(
        url,
        headers={
            "Ocp-Apim-Subscription-Key": subscription_key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        },
        data=ssml.encode("utf-8"),
        timeout=120,
    )

    if response.status_code != 200:
        raise RuntimeError(f"Azure TTS error: {response.status_code} - {response.text}")

    return response.content


def ms_to_frame(ms: int, fps: int) -> int:
    return int(round(ms / 1000 * fps))


def split_beats_by_silence(audio: AudioSegment, beat_texts: list[str], fps: int = DEFAULT_FPS):
    """
    通过静默检测将音频切分为与 beat_texts 数量匹配的段落。
    返回 beats: [{startFrame, endFrame, text}, ...]
    """
    nonsilent = detect_nonsilent(audio, min_silence_len=MIN_SILENCE_LEN, silence_thresh=SILENCE_THRESH)
    target = len(beat_texts)
    total_ms = len(audio)

    print(f"  detected {len(nonsilent)} nonsilent ranges, target beats={target}")

    if not nonsilent:
        segment_ms = total_ms / target
        ranges = [(int(i * segment_ms), int((i + 1) * segment_ms)) for i in range(target)]
    elif len(nonsilent) == target:
        ranges = nonsilent
    elif len(nonsilent) > target:
        ranges = list(nonsilent)
        while len(ranges) > target:
            shortest_idx = min(range(len(ranges)), key=lambda i: ranges[i][1] - ranges[i][0])
            left_dur = ranges[shortest_idx][0] - ranges[shortest_idx - 1][0] if shortest_idx > 0 else math.inf
            right_dur = ranges[shortest_idx + 1][1] - ranges[shortest_idx][0] if shortest_idx < len(ranges) - 1 else math.inf
            if left_dur <= right_dur and shortest_idx > 0:
                ranges[shortest_idx - 1] = (ranges[shortest_idx - 1][0], ranges[shortest_idx][1])
                ranges.pop(shortest_idx)
            elif shortest_idx < len(ranges) - 1:
                ranges[shortest_idx] = (ranges[shortest_idx][0], ranges[shortest_idx + 1][1])
                ranges.pop(shortest_idx + 1)
            else:
                ranges[shortest_idx - 1] = (ranges[shortest_idx - 1][0], ranges[shortest_idx][1])
                ranges.pop(shortest_idx)
    else:
        ranges = list(nonsilent)
        while len(ranges) < target:
            gaps = []
            for i in range(len(ranges) - 1):
                gap = ranges[i + 1][0] - ranges[i][1]
                gaps.append((gap, i))
            if not gaps:
                break
            gaps.sort(reverse=True)
            gap_ms, idx = gaps[0]
            split_at = ranges[idx][1] + gap_ms // 2
            ranges.insert(idx + 1, (split_at, ranges[idx + 1][1]))
            ranges[idx] = (ranges[idx][0], split_at)
        while len(ranges) < target:
            longest_idx = max(range(len(ranges)), key=lambda i: ranges[i][1] - ranges[i][0])
            mid = (ranges[longest_idx][0] + ranges[longest_idx][1]) // 2
            ranges.insert(longest_idx + 1, (mid, ranges[longest_idx][1]))
            ranges[longest_idx] = (ranges[longest_idx][0], mid)

    adjusted = []
    for i, (start, end) in enumerate(ranges):
        start = max(0, start - 50)
        end = min(total_ms, end + 50)
        adjusted.append((start, end))

    beats = []
    for i, (start, end) in enumerate(adjusted):
        text = beat_texts[i] if i < len(beat_texts) else ""
        beats.append({
            "startFrame": ms_to_frame(start, fps),
            "endFrame": ms_to_frame(end, fps),
            "text": text,
        })

    return beats


MAX_TTS_CHARS = 800  # Azure TTS 单次请求最大字符数（留出余量）

def process_scene(scene_index: int, scene: dict, audio_prefix: str, fps: int, voice: str, out_dir: Path):
    beats_input = scene.get("beats", [])
    scene_type = scene.get("type", "")
    props = scene.get("props", {})

    if not beats_input:
        # For ending-summary scenes with a closing text, generate TTS for it
        closing = props.get("closing", "")
        if scene_type == "ending-summary" and closing:
            print(f"Scene {scene_index}: no beats input, generating closing narration...")
            full_text = closing
            char_count = len(full_text)
            print(f"  synthesizing TTS: {char_count} chars...")

            audio_bytes = synthesize_azure(full_text, voice)
            audio_path = out_dir / f"scene{scene_index}.mp3"
            audio_path.write_bytes(audio_bytes)
            print(f"  saved {audio_path} ({len(audio_bytes)} bytes)")

            audio = AudioSegment.from_mp3(str(audio_path))
            detected_beats = split_beats_by_silence(audio, [full_text], fps)

            beats_path = out_dir / f"scene{scene_index}-beats.json"
            beats_path.write_text(json.dumps(detected_beats, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"  saved {beats_path}")
            for b in detected_beats:
                print(f"    [{b['startFrame']:4d} - {b['endFrame']:4d}] {b['text']}")
            return char_count
        else:
            print(f"  Scene {scene_index}: no beats, skip")
            return 0

    texts = [b["text"] for b in beats_input]
    full_text = "。".join(texts) + "。"
    char_count = len(full_text)
    print(f"Scene {scene_index}: synthesizing TTS for {len(texts)} beats, {char_count} chars...")

    # 如果文本过长，分段合成后拼接
    if char_count > MAX_TTS_CHARS:
        print(f"  Text too long ({char_count} chars), splitting into chunks...")
        audio = AudioSegment.empty()
        for i, text in enumerate(texts):
            text_with_punct = text if i == len(texts) - 1 else text + "。"
            if len(text_with_punct) > MAX_TTS_CHARS:
                # 单句仍然过长，按字符数均分
                chunk_audio = _synthesize_chunk(text_with_punct, voice)
            else:
                chunk_audio = synthesize_azure(text_with_punct, voice)
            seg = AudioSegment.from_mp3(chunk_audio)
            audio += seg
            if i < len(texts) - 1:
                audio += AudioSegment.silent(duration=300)  # 300ms静音间隔
        audio_path = out_dir / f"scene{scene_index}.mp3"
        audio.export(str(audio_path), format="mp3")
        print(f"  saved {audio_path} ({os.path.getsize(audio_path)} bytes)")
    else:
        audio_bytes = synthesize_azure(full_text, voice)
        audio_path = out_dir / f"scene{scene_index}.mp3"
        audio_path.write_bytes(audio_bytes)
        print(f"  saved {audio_path} ({len(audio_bytes)} bytes)")
        audio = AudioSegment.from_mp3(str(audio_path))

    detected_beats = split_beats_by_silence(audio, texts, fps)

    beats_path = out_dir / f"scene{scene_index}-beats.json"
    beats_path.write_text(json.dumps(detected_beats, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  saved {beats_path}")
    for b in detected_beats:
        print(f"    [{b['startFrame']:4d} - {b['endFrame']:4d}] {b['text']}")

    return char_count


def _synthesize_chunk(text: str, voice: str) -> bytes:
    """将长文本按句子分割后分别合成再拼接"""
    import re
    sentences = re.split(r'(?<=[。！？……])', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    audio = AudioSegment.empty()
    for sent in sentences:
        if not sent:
            continue
        chunk_bytes = synthesize_azure(sent, voice)
        seg = AudioSegment.from_mp3(chunk_bytes)
        audio += seg
        audio += AudioSegment.silent(duration=150)
    return audio.export(format="mp3")


def log_cost(project_root: Path, word: str, total_chars: int, cost: float, scenes_count: int, beats_count: int):
    log_path = project_root / "data" / "tts-cost-log.jsonl"
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "word": word,
        "totalChars": total_chars,
        "costCNY": round(cost, 6),
        "scenesCount": scenes_count,
        "beatsCount": beats_count,
        "unitPrice": f"{COST_PER_10K_CHARS}元/万字符",
    }
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def calculate_total_frames(scenes: list[dict], default: int = 300) -> int:
    """Calculate total frames from scenes beats data.

    Must match player.tsx scene duration formula: maxEndFrame + 25
    """
    total = 0
    for scene in scenes:
        beats = scene.get("beats", [])
        if beats:
            max_end = max(b.get("endFrame", 0) for b in beats)
            total += max_end + 25
    return max(default, total)


def create_word_video_entry(word: str, project_root: Path):
    """Create src/{Word}WordVideo.tsx entry component if it doesn't exist."""
    word_cap = word.capitalize()
    entry_path = project_root / "src" / f"{word_cap}WordVideo.tsx"
    if entry_path.exists():
        print(f"Entry component already exists: {entry_path}")
        return

    template = f'''import React from "react";
import {{ WordVideoPlayer }} from "./pipeline/player";
import {word}Config from "../data/{word}-draft-with-beats.json";
import type {{ WordConfig }} from "./pipeline/types";

export const {word_cap}WordVideo: React.FC = () => {{
  return <WordVideoPlayer config={{{word}Config as WordConfig}} />;
}};
'''
    entry_path.write_text(template, encoding="utf-8")
    print(f"Created entry component: {entry_path}")


def register_composition_in_root(word: str, project_root: Path, total_frames: int):
    """Add or update Composition registration and import in Root.tsx."""
    word_cap = word.capitalize()
    composition_id = f"{word_cap}WordVideo"
    root_path = project_root / "src" / "Root.tsx"
    content = root_path.read_text(encoding="utf-8")
    changed = False

    # Add import statement if not present
    import_line = f'import {{ {word_cap}WordVideo }} from "./{word_cap}WordVideo";'
    if import_line not in content:
        import_lines = [line for line in content.split('\n')
                        if (line.strip().startswith('import ') or line.strip().startswith('import type '))
                        and 'from "./' in line]
        if import_lines:
            last_import = import_lines[-1]
            content = content.replace(last_import, last_import + "\n" + import_line)
            changed = True
            print(f"  [Root] Added import: {import_line}")

    if f'id="{composition_id}"' in content:
        # Composition exists - update durationInFrames
        import re
        pattern = rf'(<Composition\s+id="{re.escape(composition_id)}"[^>]*durationInFrames={{)(\d+)(}}[^>]*>)'
        match = re.search(pattern, content)
        if match:
            old_frames = match.group(2)
            if int(old_frames) != total_frames:
                content = re.sub(pattern, rf'\g<1>{total_frames}\g<3>', content)
                changed = True
                print(f"  [Root] Updated {composition_id} durationInFrames: {old_frames} -> {total_frames}")
        if changed:
            root_path.write_text(content, encoding="utf-8")
            verify = root_path.read_text(encoding="utf-8")
            if composition_id in verify:
                print(f"  [Root] SUCCESS: {composition_id} is registered")
            else:
                print(f"  [Root] FAILURE: {composition_id} NOT found after write!")
        return

    new_composition = f'''      <Composition
        id="{composition_id}"
        component={{{composition_id}}}
        durationInFrames={{{total_frames}}}
        fps={{30}}
        width={{1920}}
        height={{1080}}
      />
'''

    # Insert before the closing </> of RemotionRoot
    if "    </>" in content:
        content = content.replace("    </>", f"{new_composition}    </>")
        changed = True
        print(f"  [Root] Registered Composition: {composition_id} ({total_frames} frames)")
    else:
        print(f"  [Root] ERROR: Could not find insertion point in Root.tsx")

    if changed:
        root_path.write_text(content, encoding="utf-8")
        # Verify
        verify = root_path.read_text(encoding="utf-8")
        if composition_id in verify:
            print(f"  [Root] SUCCESS: {composition_id} is registered")
        else:
            print(f"  [Root] FAILURE: {composition_id} NOT found after write!")


def print_cost_report(word: str, total_chars: int, cost: float, scene_details: list):
    print("\n" + "=" * 50)
    print(f"TTS Cost Report - {word}")
    print("=" * 50)
    for idx, chars in scene_details:
        scene_cost = chars / 10000 * COST_PER_10K_CHARS
        print(f"  Scene {idx}: {chars:4d} chars -> CNY {scene_cost:.4f}")
    print("-" * 50)
    print(f"  Total: {total_chars} chars")
    print(f"  Unit: {COST_PER_10K_CHARS} CNY/10k chars")
    print(f"  Actual Cost: CNY {cost:.4f}")
    print("=" * 50 + "\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="vocab config JSON path")
    parser.add_argument("--public-dir", default="public", help="project public directory")
    parser.add_argument("--voice", choices=["female", "male"], default="female")
    parser.add_argument("--fps", type=int, default=DEFAULT_FPS)
    parser.add_argument("--register-only", action="store_true", help="仅注册 Composition 到 Root.tsx，不生成 TTS")
    args = parser.parse_args()

    required_env = [
        "AZURE_SPEECH_KEY",
        "AZURE_SPEECH_REGION",
        "AZURE_SPEECH_VOICE",
    ]
    if not args.register_only:
        missing = [k for k in required_env if not os.getenv(k)]
        if missing:
            print(f"Missing env vars: {', '.join(missing)}", file=sys.stderr)
            sys.exit(1)

    config_path = Path(args.input)
    config = json.loads(config_path.read_text(encoding="utf-8"))
    audio_prefix = config.get("audioPrefix", "word-audio-v1")
    fps = config.get("fps", args.fps)
    word = config.get("word", config_path.stem)

    project_root = config_path.parent.parent.resolve()
    out_dir = Path(args.public_dir) / audio_prefix
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {out_dir}\n")

    scenes = config.get("scenes", [])

    # Calculate total frames for Root.tsx registration
    total_frames = calculate_total_frames(scenes)

    # Register in Root.tsx BEFORE TTS synthesis.
    # This ensures the composition is registered even if TTS fails.
    print(f"\n[Step 0] Registering {word} in Root.tsx...")
    create_word_video_entry(word, project_root)
    register_composition_in_root(word, project_root, total_frames)

    # TTS synthesis
    total_chars = 0
    scene_details = []
    total_beats = 0

    if args.register_only:
        print("[Step 0] Registration complete (--register-only, skipping TTS)")
        return

    for i, scene in enumerate(scenes, start=1):
        chars = process_scene(i, scene, audio_prefix, fps, args.voice, out_dir)
        total_chars += chars
        scene_details.append((i, chars))
        total_beats += len(scene.get("beats", []))

    for i, scene in enumerate(scenes):
        beats_path = out_dir / f"scene{i+1}-beats.json"
        if beats_path.exists():
            scene["beats"] = json.loads(beats_path.read_text(encoding="utf-8"))

    updated_config_path = config_path.parent / f"{config_path.stem}-with-beats.json"
    updated_config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nUpdated config with beats: {updated_config_path}")

    cost = total_chars / 10000 * COST_PER_10K_CHARS
    print_cost_report(word, total_chars, cost, scene_details)
    log_cost(project_root, word, total_chars, cost, len(scenes), total_beats)
    print(f"成本记录已追加到: {project_root / 'data' / 'tts-cost-log.jsonl'}")

    # Validate: all scene audio and beats files must exist
    print(f"\n[Validation] Checking audio outputs in {out_dir}...")
    missing = []
    for i in range(1, len(scenes) + 1):
        mp3_path = out_dir / f"scene{i}.mp3"
        beats_path = out_dir / f"scene{i}-beats.json"
        if not mp3_path.exists():
            missing.append(f"scene{i}.mp3")
        if not beats_path.exists():
            missing.append(f"scene{i}-beats.json")
    if missing:
        print(f"\nFATAL: Missing {len(missing)} required file(s):", file=sys.stderr)
        for f in missing:
            print(f"  - {f}", file=sys.stderr)
        print(f"\nAudio files are required for all {len(scenes)} scenes. Please check TTS synthesis errors above.", file=sys.stderr)
        sys.exit(1)
    print(f"[Validation] All {len(scenes)} scene audio files present.")


if __name__ == "__main__":
    main()
