#!/usr/bin/env python3
"""
Word Video Pipeline CLI
Usage: python scripts/pipeline.py --word cascade
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys

import requests
import whisper
import yaml

FPS = 30
PROJECT_ROOT = "/home/ubuntu/projects/remotion-remotion-explainer"
UPLOAD_FOLDER = "F4p3ffzHylDtQUdrvA0c8wWXngf"


def _tts_single(text: str, reqid: str) -> bytes:
    app_id = os.getenv("VOLCENGINE_TTS_APP_ID")
    access_token = os.getenv("VOLCENGINE_TTS_ACCESS_TOKEN")
    voice_type = os.getenv("VOLCENGINE_TTS_VOICE_TYPE_FEMALE", "zh_female_mizai_saturn_bigtts")

    headers = {
        "Authorization": f"Bearer;{access_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "app": {"appid": app_id, "token": access_token, "cluster": "volcano_tts"},
        "user": {"uid": "388808087185088"},
        "audio": {
            "voice_type": voice_type,
            "encoding": "mp3",
            "speed_ratio": 1.0,
            "volume_ratio": 1.0,
            "pitch_ratio": 1.0,
        },
        "request": {
            "reqid": reqid,
            "text": text,
            "text_type": "plain",
            "operation": "query",
        },
    }
    resp = requests.post(
        "https://openspeech.bytedance.com/api/v1/tts",
        headers=headers,
        json=payload,
        timeout=60,
    )
    data = resp.json()
    if data.get("data"):
        return base64.b64decode(data["data"])
    raise RuntimeError(f"TTS failed for {reqid}: {data}")


def generate_tts(text: str, out_path: str, reqid: str):
    from pydub import AudioSegment

    sentences = split_sentences(text)
    sentences = [s for s in sentences if s.strip()]

    if len(sentences) <= 1:
        audio_bytes = _tts_single(text, reqid)
        with open(out_path, "wb") as f:
            f.write(audio_bytes)
        print(f"[TTS] {out_path} ({os.path.getsize(out_path)} bytes)")
        return [len(AudioSegment.from_mp3(out_path)) / 1000.0]

    # Multi-sentence: generate separately and concatenate with 150ms silence
    temp_files = []
    part_durations = []
    for i, sent in enumerate(sentences):
        audio_bytes = _tts_single(sent, f"{reqid}_{i}")
        tmp = f"/tmp/{reqid}_{i}.mp3"
        with open(tmp, "wb") as f:
            f.write(audio_bytes)
        seg = AudioSegment.from_mp3(tmp)
        part_durations.append(len(seg) / 1000.0)
        temp_files.append(tmp)

    silence = AudioSegment.silent(duration=150)
    combined = AudioSegment.empty()
    for i, tmp in enumerate(temp_files):
        seg = AudioSegment.from_mp3(tmp)
        combined += seg
        if i < len(temp_files) - 1:
            combined += silence
    combined.export(out_path, format="mp3")
    print(f"[TTS] {out_path} ({os.path.getsize(out_path)} bytes) — {len(sentences)} parts stitched")

    for tmp in temp_files:
        os.remove(tmp)
    return part_durations


def split_sentences(text: str):
    parts = re.split(r"([。！？；])", text)
    sentences = []
    current = ""
    for p in parts:
        current += p
        if p in "。！？；":
            sentences.append(current.strip())
            current = ""
    if current.strip():
        sentences.append(current.strip())
    return sentences


def compute_beats_from_durations(text: str, part_durations: list[float]):
    """Compute beats using exact part durations from TTS stitching."""
    sentences = split_sentences(text)
    sentences = [s for s in sentences if s.strip()]

    beats = []
    cumulative = 0.0
    silence = 0.15  # 150ms silence between stitched parts

    for i, sent in enumerate(sentences):
        dur = part_durations[i] if i < len(part_durations) else 2.0
        start_frame = max(15, int(cumulative * FPS))
        end_frame = int((cumulative + dur) * FPS)
        beats.append({"startFrame": start_frame, "endFrame": end_frame, "text": sent})
        cumulative += dur
        if i < len(sentences) - 1:
            cumulative += silence

    return beats


def get_audio_duration(path: str) -> float:
    proc = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            path,
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(proc.stdout.strip())


def run(word: str):
    yaml_path = os.path.join(PROJECT_ROOT, f"words/{word}.yaml")
    audio_dir = os.path.join(PROJECT_ROOT, f"public/{word}-audio-v1")
    json_dir = os.path.join(PROJECT_ROOT, "public/words")
    json_path = os.path.join(json_dir, f"{word}.json")
    out_video = os.path.join(PROJECT_ROOT, f"out/{word}-v3.mp4")

    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(json_dir, exist_ok=True)
    os.makedirs(os.path.dirname(out_video), exist_ok=True)

    with open(yaml_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    print(f"[Pipeline] Processing word: {word}")

    for i, scene in enumerate(config["scenes"]):
        scene_num = i + 1
        audio_path = os.path.join(audio_dir, f"scene{scene_num}.mp3")
        text = scene.get("text", "")

        if not os.path.exists(audio_path):
            part_durations = generate_tts(text, audio_path, f"{word}_scene{scene_num}")
        else:
            from pydub import AudioSegment
            part_durations = [len(AudioSegment.from_mp3(audio_path)) / 1000.0]

        beats = compute_beats_from_durations(text, part_durations)
        scene["beats"] = beats
        if "text" in scene:
            del scene["text"]
        print(f"[Beats] Scene {scene_num}: {len(beats)} beats")

    # Write JSON props
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f"[JSON] {json_path}")

    # Calculate exact duration
    total_frames = sum((s["beats"][-1]["endFrame"] + 5) for s in config["scenes"] if s.get("beats"))
    print(f"[Duration] {total_frames} frames ({total_frames / FPS:.1f}s)")

    # Render
    print("[Render] Starting Remotion render...")
    subprocess.run(
        [
            "npx", "remotion", "render", "WordVideo", out_video,
            f"--props={json_path}",
        ],
        cwd=PROJECT_ROOT,
        check=True,
    )
    print(f"[Render] {out_video}")

    # Upload (relative path required by lark-cli)
    print("[Upload] Uploading to Feishu...")
    subprocess.run(
        [
            "lark-cli",
            "drive",
            "+upload",
            "--file",
            f"out/{word}-v3.mp4",
            "--folder-token",
            UPLOAD_FOLDER,
        ],
        cwd=PROJECT_ROOT,
        check=True,
    )
    print("[Done]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--word", required=True, help="Word slug, e.g. cascade")
    args = parser.parse_args()
    run(args.word)
