#!/usr/bin/env python3
"""
模板订单制诊断引擎 — 补完飞轮自动运转的最后一公里
输入一个单词，自动推荐策略、模板组合，并生成可执行的 WordConfig JSON 草稿
"""

import argparse
import json
import os
import sys
import urllib3
from pathlib import Path

import requests

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 加载 .env 文件
def load_env():
    env_path = Path(__file__).parent.parent.resolve() / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").strip().split("\n"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()

load_env()

# ANSI colors
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
RESET = "\033[0m"
BOLD = "\033[1m"

# MiniMax API 配置
MINIMAX_API_KEY = os.environ.get("ANTHROPIC_AUTH_TOKEN") or os.environ.get("MINIMAX_API_KEY", "")
MINIMAX_BASE_URL = "https://api.minimaxi.com/anthropic"


def load_registry(project_root: Path) -> dict:
    path = project_root / "data" / "template-registry.json"
    return json.loads(path.read_text(encoding="utf-8"))


def infer_strategy(word: str, registry: dict) -> tuple[str, str]:
    """
    推断策略。返回 (strategy_key, reason)
    优先级：LLM 分析（最优先）-> 规则兜底 -> mood-driven fallback
    """
    word_lower = word.lower()

    # 1. LLM 自动分析（最优先，真正实现自动化）
    llm_strategy = llm_infer_strategy(word, registry)
    if llm_strategy:
        return llm_strategy  # (strategy_key, reason) from LLM

    # 2. 查历史记录
    for entry in registry.get("wordHistory", []):
        if entry.get("word", "").lower() == word_lower:
            return entry.get("strategy", "mood-driven"), f"复用历史记录（{entry['word']} 曾使用 {entry['strategy']}）"

    # 3. 查策略的 exampleWords
    for key, val in registry.get("strategies", {}).items():
        examples = [e.lower() for e in val.get("exampleWords", [])]
        if word_lower in examples:
            return key, f"命中策略 exampleWords（{key}）"

    # 4. 查 backlog 的 triggerWords
    for item in registry.get("templateBacklog", []):
        triggers = [t.lower() for t in item.get("triggerWords", [])]
        if word_lower in triggers:
            rec = item.get("recommendedStrategy", "mood-driven")
            return rec, f"命中 backlog 模板 triggerWords（{item['id']}），推荐策略 {rec}"

    # 5. 默认 fallback
    return "mood-driven", "所有推断方式均失败，默认 mood-driven（可用 --strategy 覆盖）"


def llm_infer_strategy(word: str, registry: dict) -> tuple[str, str] | None:
    """
    调用 LLM 分析词义，强制归类到已知策略之一，返回 (strategy_key, reason)。
    不依赖预定义规则，完全自动化。
    """
    if not MINIMAX_API_KEY:
        print(f"{YELLOW}⚠️  MINIMAX_API_KEY 未设置，LLM 策略推断跳过{RESET}")
        return None

    strategies = registry.get("strategies", {})

    prompt = f"""分析单词 "{word}" 的语义特征，从以下四个策略中选择最合适的一个，并返回 JSON：

## 四个策略（必选其一，不可返回其他）
- **story-driven**: 单词有明确的故事、历史人物、典故，或可拆解为有画面感的生活场景
- **mood-driven**: 单词是抽象情感、意象、主观感受，难以用实物具象化
- **compare-driven**: 单词有明确对立面、常被误解、或需要正反对比才能理解
- **evolution-driven**: 单词的词义随历史发生过显著演变，或有多个时代特征

## 输出要求
必须返回以下 JSON 格式，strategy 只能是以上四个值之一：
{{"strategy": "story-driven", "reason": "该词源自希腊神话，有明确的人物和故事脉络"}}
直接返回 JSON，不要有其他内容。"""

    try:
        response = call_minimax_llm(prompt)
        if not response:
            return None
        import json, re
        # 提取 JSON 对象
        json_match = re.search(r'\{.*?"strategy".*?"reason".*?\}', response, re.DOTALL)
        if not json_match:
            return None
        parsed = json.loads(json_match.group())
        strategy = parsed.get("strategy", "").strip().lower()
        reason = parsed.get("reason", "").strip()
        if strategy in strategies and reason:
            return strategy, reason
        return None
    except Exception:
        return None


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


def call_minimax_llm(prompt: str, retries: int = 2) -> str:
    """调用 MiniMax API（Anthropic 兼容格式）"""
    import time

    if not MINIMAX_API_KEY:
        print(f"{YELLOW}⚠️  未设置 MINIMAX_API_KEY，跳过内容生成{RESET}")
        return ""

    for attempt in range(retries):
        try:
            response = requests.post(
                f"{MINIMAX_BASE_URL}/v1/messages",
                headers={
                    "Authorization": f"Bearer {MINIMAX_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "MiniMax-M2.7",
                    "max_tokens": 4096,
                    "messages": [
                        {"role": "user", "content": [{"type": "text", "text": prompt}]}
                    ]
                },
                timeout=180,
                verify=False
            )

            if response.status_code == 200:
                result = response.json()
                for block in result.get("content", []):
                    if block.get("type") == "text":
                        return block.get("text", "").strip()
                return ""
            elif response.status_code == 529:
                wait = 2 ** attempt
                print(f"{YELLOW}⚠️  MiniMax API 服务器过载 (529)，{wait}秒后重试... ({attempt+1}/{retries}){RESET}")
                time.sleep(wait)
                continue
            else:
                print(f"{YELLOW}⚠️  MiniMax API 调用失败: {response.status_code} - {response.text[:200]}{RESET}")
                return ""

        except Exception as e:
            print(f"{YELLOW}⚠️  MiniMax API 异常: {e}{RESET}")
            if attempt < retries - 1:
                wait = 2 ** attempt
                time.sleep(wait)
                continue
            return ""

    print(f"{YELLOW}⚠️  MiniMax API 重试 {retries} 次后仍失败{RESET}")
    return ""


def generate_scene_prompt(word: str, scene_type: str, scene_index: int, total_scenes: int) -> str:
    """
    为每个场景生成对应的 prompt
    """
    if scene_type == "hero-word":
        return f"""为单词 "{word}" 生成一个引人入胜的开场介绍。

请生成一个 JSON 对象，包含以下字段：
- kicker: 简短的主题标签（如 "Word of the Day" 或 "每日一词"）
- title: 单词本身
- word: 单词原形
- subtitle: 一句吸引人的中文副标题，介绍这个单词的特别之处（20-40字）
- tags: 3个相关标签数组（如 ["生活", "情感", "仪式感"]）

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "origin-chain":
        return f"""为单词 "{word}" 生成词源介绍。

请生成一个 JSON 对象，包含以下字段：
- kicker: "Etymology" 或 "词源"
- title: 一个吸引人的中文标题
- nodes: 词源节点数组，每个节点包含：
  - label: 单词或词根
  - note: 简短的解释（用 \n 分隔两行）
  - color: 十六进制颜色码（如 "#f59e0b"）
- arrowLabel: 一句总结性的中文句子，描述词源故事

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "answer-cards":
        return f"""为单词 "{word}" 生成三个问答卡片内容。

请生成一个 JSON 对象，包含以下字段：
- kicker: "Three Insights" 或 "三个要点"
- title: 一个吸引人的中文问题
- question: 重复标题中的问题
- cards: 三个卡片数组，每个卡片包含：
  - number: 编号（"01", "02", "03"）
  - icon: 图标名称（使用 lucide-react 图标名，如 "Zap", "Heart", "Smile"）
  - headline: 简短的中文标题
  - body: 中文解释文字（30-60字）
  - color: 十六进制颜色码
- beats: 讲解节奏数组，每个 beat 包含：
  - text: 讲解文本

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "ending-summary":
        return f"""为单词 "{word}" 生成结尾总结。

请生成一个 JSON 对象，包含以下字段：
- kicker: "Takeaway" 或 "记住这个词"
- title: 一个简短的中文标题
- formula: 单词拆解公式（如 "break + fast = breakfast"）
- points: 3个要点数组，每个包含：
  - text: 要点文字
  - color: 十六进制颜色码
- closing: 一句结束语，中文，温暖有力
- narration: 讲解配音稿，120-180字，分3-5个句子，每句以句号结尾，方便后续按句子切分 beats

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "full-screen-mood":
        return f"""为单词 "{word}" 生成一个全屏氛围场景的内容。

请生成一个 JSON 对象，包含以下字段：
- kicker: 简短的主题
- title: 一个诗意的中文标题
- subtitle: 一句诗意的中文描述
- emoji: 相关 emoji
- beats: 讲解节奏数组

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "quote-page":
        return f"""为单词 "{word}" 生成一个名言引用场景的内容。

请生成一个 JSON 对象，包含以下字段：
- kicker: 引用来源类型（如 "Wise Words"）
- quote: 一句英文名言
- translation: 中文翻译
- author: 作者名（如果不知道可以写 "佚名"）

请用中文和英文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "timeline-page":
        return f"""为单词 "{word}" 生成一个时间演变轴场景的内容。

请生成一个 JSON 对象，包含以下字段：
- kicker: "Etymology" 或 "词义演变"
- title: 一个吸引人的中文标题
- events: 时间线事件数组

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    elif scene_type == "meaning-compare":
        return f"""为单词 "{word}" 生成一个词义对比场景的内容。

请生成一个 JSON 对象，包含以下字段：
- kicker: "Meaning" 或 "词义辨析"
- title: 一个吸引人的中文标题
- items: 对比项数组

请用中文生成内容，直接返回 JSON，不要有其他文字。"""

    else:
        return ""


def parse_llm_json_response(response_text: str) -> dict:
    """
    解析 LLM 返回的 JSON 文本
    """
    try:
        # 尝试找到 JSON 块
        text = response_text.strip()
        # 移除可能的 markdown 代码块标记
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        # 尝试解析 JSON
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"{YELLOW}⚠️  JSON 解析失败: {e}{RESET}")
        return {}


def generate_scene_content(word: str, scene_type: str, scene_index: int, total_scenes: int) -> dict:
    """
    为单个场景生成内容
    """
    prompt = generate_scene_prompt(word, scene_type, scene_index, total_scenes)
    if not prompt:
        return {"props": {}, "beats": []}

    print(f"{CYAN}   正在生成 {scene_type} 场景内容...{RESET}")
    response = call_minimax_llm(prompt)

    if not response:
        return {"props": {}, "beats": []}

    parsed = parse_llm_json_response(response)
    return {"props": parsed, "beats": []}


def generate_beats_for_scene(word: str, scene_type: str, props: dict) -> list:
    """
    为场景生成 beats（讲解节奏）。如果 beats 为空会自动重试，最多 3 次。
    """
    import re

    # 如果 props 中已有 narration 字段（ending-summary 场景），直接使用
    narration = props.get("narration", "")
    if narration:
        sentences = re.split(r'(?<=[。！？……\n])\s*', narration)
        sentences = [s.strip() for s in sentences if s.strip()]
        beats = [{"startFrame": 0, "endFrame": 0, "text": s} for s in sentences]
        return beats

    # 生成讲解文本的 prompt
    prompt = f"""为单词 "{word}" 的 {scene_type} 场景撰写 TTS 旁白配音稿。

场景类型: {scene_type}
场景内容: {json.dumps(props, ensure_ascii=False)}

## 强制要求
- **每句话必须以句号「。」结尾**，不得省略
- 全文 3-5 句话，总字数 80-200 字
- 开头要有吸引力，如"你有没有想过..."、"今天我们来聊聊..."
- 语气自然，像朋友聊天，不是念稿
- 结尾要有升华或呼应

## 输出格式
直接返回纯文本，每句话以「。」结尾。不要加前缀、不要分段、不要 JSON。"""

    for attempt in range(1, 4):
        print(f"{CYAN}   正在生成 beats 节奏... (尝试 {attempt}/3){RESET}")
        response = call_minimax_llm(prompt)

        if not response:
            if attempt < 3:
                print(f"{YELLOW}   LLM 返回为空，重试...{RESET}")
                continue
            return []

        # 清理响应文本
        text = response.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        # 按句子标点分切成 beats
        sentences = re.split(r'(?<=[。！？……\n])\s*', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if not sentences:
            if attempt < 3:
                print(f"{YELLOW}   beats 分切为空，重试...{RESET}")
                continue
            return []

        beats = [{"startFrame": 0, "endFrame": 0, "text": s} for s in sentences]
        return beats

    return []


def generate_draft_json(word: str, strategy_key: str, scenes: list[str], out_path: Path) -> None:
    audio_prefix = f"{word.lower()}-audio-v1"
    theme = "midnight"

    print(f"\n{CYAN}开始为 {word} 生成内容...{RESET}\n")

    scene_configs = []
    for i, scene_type in enumerate(scenes, 1):
        print(f"{CYAN}[{i}/{len(scenes)}] 生成 {scene_type} 场景{RESET}")

        # 生成场景内容
        scene_content = generate_scene_content(word, scene_type, i, len(scenes))

        # 检查 props 是否为空
        if not scene_content.get("props"):
            print(f"{YELLOW}   WARNING: props 为空，LLM 可能未按要求生成 JSON{RESET}")

        # 生成 beats
        beats = generate_beats_for_scene(word, scene_type, scene_content.get("props", {}))

        # 如果 beats 仍为空，检查 scene_content 外层的 beats（LLM 有时会把 narration 放这里）
        if not beats and scene_content.get("beats"):
            existing_beats = scene_content.get("beats", [])
            if existing_beats and len(existing_beats) > 0:
                print(f"{YELLOW}   WARNING: narration beats 为空，使用 scene_content 外层 beats{RESET}")
                beats = existing_beats

        # ending-summary 场景若 beats 仍为空，尝试用 closing 字段作为 fallback
        if not beats and scene_type == "ending-summary":
            closing = scene_content.get("props", {}).get("closing", "")
            if closing:
                print(f"{YELLOW}   WARNING: beats 为空，使用 closing 字段作为 fallback{RESET}")
                beats = [{"startFrame": 0, "endFrame": 0, "text": closing}]

        if not beats:
            print(f"{RED}   ERROR: beats 生成为空！场景类型: {scene_type}{RESET}")
            # 不再静默忽略，强制报错退出
            sys.exit(1)

        scene_configs.append({
            "type": scene_type,
            "props": scene_content.get("props", {}),
            "beats": beats
        })
        print(f"{GREEN}   完成{RESET}\n")

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
            "contentGeneratedBy": "MiniMax LLM" if MINIMAX_API_KEY else "manual"
        }
    }

    out_path.write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")


def generate_draft_json_no_llm(word: str, strategy_key: str, scenes: list[str], out_path: Path) -> None:
    """仅生成空模板，不调用 LLM"""
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
            "contentGeneratedBy": "manual"
        }
    }

    out_path.write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")


def print_report(word: str, strategy: str, reason: str, scenes: list[str], missing: list[str], backlog_suggestions: list[dict], draft_path: Path) -> None:
    # 简单估算预期字符数：每个 scene 约 120 字符
    estimated_chars = len(scenes) * 120
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
        print(f"   2. python3 scripts/generate_audio_beats.py --input {draft_path}")
    else:
        print(f"   1. python3 scripts/generate_audio_beats.py --input {draft_path}")
        print(f"   2. npx remotion render {word.capitalize()}WordVideo renders/{word.lower()}-word-video.mp4")
    print()


def main():
    parser = argparse.ArgumentParser(description="模板订单制诊断引擎")
    parser.add_argument("--word", required=True, help="目标词汇")
    parser.add_argument("--strategy", help="强制指定策略（如 mood-driven）")
    parser.add_argument("--output-dir", default="data", help="草稿 JSON 输出目录")
    parser.add_argument("--no-llm", action="store_true", help="跳过 LLM 内容生成（仅生成空模板）")
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

    # 检查是否跳过 LLM 生成
    if args.no_llm:
        # 仅生成空模板
        generate_draft_json_no_llm(word, strategy, scenes, draft_path)
    else:
        generate_draft_json(word, strategy, scenes, draft_path)

    print_report(word, strategy, reason, scenes, missing, backlog_suggestions, draft_path)


if __name__ == "__main__":
    main()
