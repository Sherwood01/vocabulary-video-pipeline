#!/usr/bin/env python3
"""
Director 校验模块
责任：确保 TTS 脚本与视觉内容匹配，检查音频不被截断，强制词源场景存在。
未通过 Director signoff 的 draft 不得进入渲染。
"""
import argparse
import json
import re
import sys
from pathlib import Path

try:
    from pydub import AudioSegment
except ImportError:
    AudioSegment = None

TAIL_PADDING = 40
FPS = 30


def collect_errors(config: dict, project_root: Path) -> list[str]:
    errors = []
    scenes = config.get("scenes", [])
    word = config.get("word", "unknown")
    audio_prefix = config.get("audioPrefix", "")
    public_dir = project_root / "public"

    # 1. 强制词源场景
    scene_types = [s["type"] for s in scenes]
    if "origin-chain" not in scene_types:
        errors.append("缺少强制场景: origin-chain (每个单词必须有词源解释)")

    for idx, scene in enumerate(scenes, start=1):
        stype = scene.get("type", "")
        props = scene.get("props", {})
        beats = scene.get("beats", [])
        bcount = len(beats)

        # 2. Beats 数量校验
        expected = None
        if stype == "hero-word":
            expected = (1, None)  # 至少1个
        elif stype == "origin-chain":
            nodes = props.get("nodes", [])
            expected = (len(nodes), len(nodes)) if nodes else (1, 1)
        elif stype == "meaning-compare":
            expected = (2, None)
        elif stype == "full-screen-mood":
            lines = props.get("lines", props.get("moodLines", []))
            line_count = len(lines) if isinstance(lines, list) else 0
            expected = (line_count + 1, line_count + 1)
        elif stype == "quote-page":
            expected = (4, 4)
        elif stype == "answer-cards":
            cards = props.get("cards", [])
            expected = (len(cards) + 1, len(cards) + 1) if cards else (2, 2)
        elif stype == "ending-summary":
            points = props.get("points", [])
            expected = (len(points) + 3, len(points) + 3)  # formula + N points + closing + 升华
        elif stype == "emoji-storyboard":
            expected = (1, None)
        elif stype == "profile-story":
            story_lines = props.get("storyLines", [])
            expected = (len(story_lines) + 1, len(story_lines) + 1) if story_lines else (1, None)
        elif stype == "timeline-page":
            events = props.get("events", [])
            expected = (len(events), len(events)) if events else (1, None)

        if expected:
            min_b, max_b = expected
            if bcount < min_b:
                errors.append(f"Scene {idx} ({stype}): beats 数量不足。实际 {bcount}，要求至少 {min_b}")
            if max_b is not None and bcount > max_b:
                errors.append(f"Scene {idx} ({stype}): beats 数量过多。实际 {bcount}，要求恰好 {max_b}")

        # 3. 关键词匹配校验（ending-summary / answer-cards / origin-chain）
        if stype == "ending-summary" and bcount >= 2:
            points = props.get("points", [])
            # formula + points + closing
            for i, pt in enumerate(points):
                beat_idx = 1 + i
                if beat_idx < bcount:
                    beat_text = beats[beat_idx]["text"]
                    pt_text = pt["text"]
                    # 分词检查：point 文本中的关键短词（逗号/顿号分隔的各项）必须在 beat 中出现
                    sub_parts = re.split(r'[,、，]', pt_text)
                    missing = [p for p in sub_parts if len(p.strip()) >= 2 and p.strip() not in beat_text]
                    if missing:
                        errors.append(f"Scene {idx} ({stype}): 第 {beat_idx+1} 个 beat 缺少 point 关键词：{'、'.join(missing)}")

        if stype == "answer-cards" and bcount >= 2:
            cards = props.get("cards", [])
            for i, card in enumerate(cards):
                beat_idx = 1 + i
                if beat_idx < bcount:
                    beat_text = beats[beat_idx]["text"]
                    if card["headline"] not in beat_text:
                        errors.append(f"Scene {idx} ({stype}): 第 {beat_idx+1} 个 beat 不含 card headline '{card['headline']}'")

        if stype == "origin-chain" and bcount >= 1:
            nodes = props.get("nodes", [])
            for i, node in enumerate(nodes):
                if i < bcount:
                    beat_text = beats[i]["text"]
                    label = node.get("label", "")
                    label_clean = re.sub(r'^(古希腊|古英语|现代英语|中古英语|拉丁语|古法语|中古拉丁语|原始印欧语)\s*', '', label).strip()
                    # 主检查：beat 必须包含当前节点的词形（忽略语言前缀）
                    if label_clean in beat_text:
                        continue
                    # 若当前 beat 未提及当前节点，但提及了前一个节点的词形（过渡性叙述）
                    if i > 0:
                        prev_label = nodes[i - 1].get("label", "")
                        prev_clean = re.sub(r'^(古希腊|古英语|现代英语|中古英语|拉丁语|古法语|中古拉丁语|原始印欧语)\s*', '', prev_label).strip()
                        if prev_clean in beat_text:
                            continue
                    # 若当前 beat 未提及当前节点，但提及了下一个节点的词形（早提及）
                    if i + 1 < len(nodes):
                        next_label = nodes[i + 1].get("label", "")
                        next_clean = re.sub(r'^(古希腊|古英语|现代英语|中古英语|拉丁语|古法语|中古拉丁语|原始印欧语)\s*', '', next_label).strip()
                        if next_clean in beat_text:
                            continue
                    errors.append(f"Scene {idx} ({stype}): 第 {i+1} 个 beat 不含 node 词形 '{label_clean}'（原始 label：'{label}'）")

        # 5. 防止 ending-summary 重复词源内容（formula beat[0] 例外，允许说词根/词缀）
        if stype == "ending-summary" and "origin-chain" in scene_types and bcount >= 1:
            etymology_keywords = ["拉丁语", "古希腊语", "古英语", "源自", "来自", "源于", "词源", "演变"]
            # beat[0] 是 formula 介绍，说"词根/后缀"是合理的，跳过
            # beats[1:] 是 points + closing，严格禁止词源词
            for i, beat in enumerate(beats):
                if i == 0:
                    continue  # beat[0] 是 formula，词根/词缀可以出现
                bt = beat["text"]
                for kw in etymology_keywords:
                    if kw in bt:
                        errors.append(f"Scene {idx} ({stype}): 第 {i+1} 个 beat 含有词源关键词 '{kw}'，但词源已在 origin-chain 中阐述，ending-summary 不应重复")

        # 4. 音频时长校验（对应 -with-beats 配置）
        if audio_prefix and AudioSegment is not None:
            audio_path = public_dir / audio_prefix / f"scene{idx}.mp3"
            if audio_path.exists():
                audio = AudioSegment.from_file(audio_path)
                audio_frames = int(len(audio) / 1000 * FPS)
                last_end = beats[-1]["endFrame"] if beats else 0
                required = last_end + TAIL_PADDING
                available = audio_frames - TAIL_PADDING  # 音频去掉尾部余量后可用长度
                if audio_frames < last_end:
                    errors.append(
                        f"Scene {idx} ({stype}): 音频时长({audio_frames}帧) < 最后一个 beat 结束({last_end}帧)，"
                        f"TTS 会被截断"
                    )
                elif available < last_end:
                    errors.append(
                        f"Scene {idx} ({stype}): 音频有效时长({available}帧) < 最后一个 beat 结束({last_end}帧, "
                        f"含{TAIL_PADDING}帧尾部余量)，可能存在截断风险"
                    )
            else:
                # 只有生成了 beats 但还没合成音频时可以忽略
                if bcount > 0:
                    errors.append(f"Scene {idx} ({stype}): 缺少音频文件 {audio_path}")

    return errors


def main():
    parser = argparse.ArgumentParser(description="Director 校验脚本")
    parser.add_argument("--input", required=True, help="-with-beats JSON 路径")
    args = parser.parse_args()

    config_path = Path(args.input)
    if not config_path.exists():
        print(f"[DIRECTOR ERROR] 配置文件不存在: {config_path}", file=sys.stderr)
        sys.exit(1)

    config = json.loads(config_path.read_text(encoding="utf-8"))
    project_root = config_path.parent.parent.resolve()
    errors = collect_errors(config, project_root)

    word = config.get("word", "unknown")
    print(f"\n{'='*60}")
    print(f"[DIRECTOR] 审查报告: {word}")
    print(f"{'='*60}")

    if errors:
        print(f"\n❌ 未通过校验，共 {len(errors)} 项问题:")
        for e in errors:
            print(f"  • {e}")
        print(f"\n❌ DIRECTOR SIGNOFF: REJECTED")
        sys.exit(1)
    else:
        print("\n✅ 所有校验通过！")
        print("\n✅ DIRECTOR SIGNOFF: APPROVED")
        print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
