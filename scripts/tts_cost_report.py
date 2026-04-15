#!/usr/bin/env python3
"""
TTS 成本账本报告
读取 data/tts-cost-log.jsonl，输出累计支出、每词成本明细
"""

import json
import sys
from pathlib import Path
from collections import defaultdict


def main():
    project_root = Path(__file__).parent.parent.resolve()
    log_path = project_root / "data" / "tts-cost-log.jsonl"

    if not log_path.exists():
        print("暂无 TTS 成本记录，请先运行 generate_audio_beats.py 生成音频。")
        sys.exit(0)

    records = []
    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            records.append(json.loads(line))

    total_cost = 0.0
    total_chars = 0
    word_costs = defaultdict(lambda: {"cost": 0.0, "chars": 0, "runs": 0})

    for r in records:
        cost = r.get("costCNY", 0)
        chars = r.get("totalChars", 0)
        word = r.get("word", "unknown")
        total_cost += cost
        total_chars += chars
        word_costs[word]["cost"] += cost
        word_costs[word]["chars"] += chars
        word_costs[word]["runs"] += 1

    print("=" * 55)
    print("TTS 成本累计报告")
    print("=" * 55)
    print(f"  总记录条数: {len(records)}")
    print(f"  总合成字符: {total_chars} 字符")
    print(f"  总支出: ¥{total_cost:.4f}")
    print(f"  平均单价: ¥{total_cost/len(records):.4f} / 次" if records else "")
    print(f"  平均单价: ¥{total_cost/max(1,total_chars)*1000:.4f} / 千字" if total_chars else "")
    print("=" * 55)

    if word_costs:
        print("\n每词明细:")
        print(f"  {'词汇':<15} {'次数':>6} {'字符':>8} {'成本(元)':>10}")
        print("  " + "-" * 45)
        for word, data in sorted(word_costs.items(), key=lambda x: -x[1]["cost"]):
            print(f"  {word:<15} {data['runs']:>6} {data['chars']:>8} ¥{data['cost']:>9.4f}")
        print()


if __name__ == "__main__":
    main()
