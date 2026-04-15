#!/usr/bin/env python3
"""
模板订单制诊断引擎 — 补完飞轮自动运转的最后一公里
输入一个单词，自动推荐策略、模板组合，并生成可执行的 WordConfig JSON 草稿
"""

import argparse
import json
import os
import sys
from pathlib import Path

# ANSI colors
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
RESET = "\033[0m"
BOLD = "\033[1m"


def load_registry(project_root: Path) -> dict:
    path = project_root / "data" / "template-registry.json"
    return json.loads(path.read_text(encoding="utf-8"))


def infer_strategy(word: str, registry: dict) -> tuple[str, str]:
    """
    推断策略。返回 (strategy_key, reason)
    """
    word_lower = word.lower()

    # 1. 查历史记录
    for entry in registry.get("wordHistory", []):
        if entry.get("word", "").lower() == word_lower:
            return entry.get("strategy", "mood-driven"), f"复用历史记录（{entry['word']} 曾使用 {entry['strategy']}）"

    # 2. 查策略的 exampleWords
    for key, val in registry.get("strategies", {}).items():
        examples = [e.lower() for e in val.get("exampleWords", [])]
        if word_lower in examples:
            return key, f"命中策略 exampleWords（{key}）"

    # 3. 查 backlog 的 triggerWords
    for item in registry.get("templateBacklog", []):
        triggers = [t.lower() for t in item.get("triggerWords", [])]
        if word_lower in triggers:
            rec = item.get("recommendedStrategy", "mood-driven")
            return rec, f"命中 backlog 模板 triggerWords（{item['id']}），推荐策略 {rec}"

    # 4. 默认 fallback
    return "mood-driven", "未命中任何规则，默认使用 mood-driven（可用 --strategy 覆盖）"


def resolve_scenes(strategy_key: str, registry: dict) -> list[str]:
    strategy = registry.get("strategies", {}).get(strategy_key, {})
    return list(strategy.get("defaultScenes", []))


def check_missing_templates(scenes: list[str], registry: dict) -> list[str]:
    existing = {t["id"] for t in registry.get("templates", [])}
    missing = [s for s in scenes if s not in existing]
    return missing


def suggest_backlog_templates(scenes: list[str], registry: dict) -> list[dict]:
    existing = {t["id"] for t in registry.get("templates", [])}
    suggestions = []
    for item in registry.get("templateBacklog", []):
        if item["id"] not in existing and item["id"] in scenes:
            suggestions.append(item)
    return suggestions


def generate_draft_json(word: str, strategy_key: str, scenes: list[str], out_path: Path) -> None:
    audio_prefix = f"{word.lower()}-audio-v1"
    theme = "midnight"

    scene_configs = []
    for scene_type in scenes:
        scene_configs.append({
            "type": scene_type,
            "props": {},
            "beats": []
        })

    draft = {
        "word": word.lower(),
        "title": word.capitalize(),
        "theme": theme,
        "fps": 30,
        "audioPrefix": audio_prefix,
        "scenes": scene_configs,
        "_meta": {
            "strategy": strategy_key,
            "generatedBy": "diagnose_word.py",
        }
    }

    out_path.write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")


def print_report(word: str, strategy: str, reason: str, scenes: list[str], missing: list[str], backlog_suggestions: list[dict], draft_path: Path) -> None:
    # 简单估算预期字符数：每个 scene 约 60 字符
    estimated_chars = len(scenes) * 60
    estimated_cost = estimated_chars / 10000 * 3.0

    print(f"\n{BOLD}{'='*60}{RESET}")
    print(f"{BOLD}{CYAN}📝 词汇诊断报告: {word}{RESET}")
    print(f"{BOLD}{'='*60}{RESET}\n")

    print(f"{CYAN}🎯 推荐策略:{RESET} {BOLD}{strategy}{RESET}")
    print(f"{CYAN}💡 推断原因:{RESET} {reason}\n")

    print(f"{CYAN}📐 推荐模板组合 ({len(scenes)} 个场景):{RESET}")
    for i, s in enumerate(scenes, 1):
        emoji = "✅" if s not in missing else "❌"
        print(f"   {emoji}  Scene {i}: {s}")
    print()

    if missing:
        print(f"{YELLOW}⚠️  缺少模板: {', '.join(missing)}{RESET}")
        if backlog_suggestions:
            print(f"{YELLOW}🔧 建议从 backlog 开发:{RESET}")
            for b in backlog_suggestions:
                print(f"      • {b['id']}: {b['name']} — {b['narrativeRole']}")
        print(f"{YELLOW}⏱️  预计耗时: 30 分钟 ~ 1 小时（含新模板开发）{RESET}\n")
    else:
        print(f"{GREEN}✅ 所有模板均已入库，可直接拼装{RESET}")
        print(f"{GREEN}⏱️  预计耗时: 10 分钟 ~ 1 小时{RESET}\n")

    print(f"{CYAN}💵 TTS 成本预估:{RESET} 约 {estimated_chars} 字符 → ¥{estimated_cost:.4f}")
    print(f"{CYAN}📄 已生成草稿:{RESET} {draft_path}")
    print(f"{CYAN}🚀 下一步命令:{RESET}")
    if missing:
        print(f"   1. 开发缺失模板并注册到 pipeline")
        print(f"   2. 完善 {draft_path} 中的 props 和 beats 文本")
        print(f"   3. python3 scripts/generate_audio_beats.py --input {draft_path}")
    else:
        print(f"   1. 完善 {draft_path} 中的 props 和 beats 文本")
        print(f"   2. python3 scripts/generate_audio_beats.py --input {draft_path}")
        print(f"   3. npx remotion render {word.capitalize()}WordVideo renders/{word.lower()}-word-video.mp4")
    print()


def main():
    parser = argparse.ArgumentParser(description="模板订单制诊断引擎")
    parser.add_argument("--word", required=True, help="目标词汇")
    parser.add_argument("--strategy", help="强制指定策略（如 mood-driven）")
    parser.add_argument("--output-dir", default="data", help="草稿 JSON 输出目录")
    args = parser.parse_args()

    project_root = Path(__file__).parent.parent.resolve()
    registry = load_registry(project_root)

    word = args.word.strip()
    if not word:
        print("错误: --word 不能为空", file=sys.stderr)
        sys.exit(1)

    # 策略推断
    if args.strategy:
        strategy = args.strategy
        reason = "用户强制指定"
    else:
        strategy, reason = infer_strategy(word, registry)

    # 验证策略存在
    if strategy not in registry.get("strategies", {}):
        print(f"错误: 未知策略 '{strategy}'", file=sys.stderr)
        sys.exit(1)

    scenes = resolve_scenes(strategy, registry)
    missing = check_missing_templates(scenes, registry)
    backlog_suggestions = suggest_backlog_templates(scenes, registry)

    out_dir = project_root / args.output_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    draft_path = out_dir / f"{word.lower()}-draft.json"

    generate_draft_json(word, strategy, scenes, draft_path)
    print_report(word, strategy, reason, scenes, missing, backlog_suggestions, draft_path)


if __name__ == "__main__":
    main()
