# 词汇视频生成器

一个基于 [Remotion](https://www.remotion.dev) 的词汇视频自动化生成流水线。输入一个英文单词，自动生成带有中文讲解、TTS 音频和动态视觉效果的教育视频。

## 效果预览

<div align="center">
  <img src=".github/assets/preview-breakfast.jpg" width="45%" />
  <img src=".github/assets/preview-lemonade.jpg" width="45%" />
  <br><br>
  <img src=".github/assets/preview-tariff.jpg" width="92%" />
</div>

## 特点

- **模板订单制**（Template Order System）：每个新单词自动匹配最优场景组合，无场景时自动扩展库存
- **中文 TTS 自动拍节奏**：基于静音检测自动分割音频 beats，视觉元素与讲述节奏完美同步
- **多元模板库**：Hero 入题、词源链、场景氛围、名言引用、问答卡片、总结收尾等多种场景
- **中英文排版优化**：使用霓鹭文楷（中文）+ DM Sans（英文）字体
- **成本透明**：每次生成自动统计 TTS 字符数与成本（约 ¥0.3 / 千字）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

Python 脚本依赖：
```bash
pip install pydub requests
```

### 2. 配置环境变量

在项目根目录创建 `.env`：
```bash
VOLC_TTS_APPID=你的火山引擎_APPID
VOLC_TTS_TOKEN=你的火山引擎_AccessToken
VOLC_TTS_VOICE=你的音色ID
```

### 3. 诊断单词并生成草稿

```bash
npm run diagnose:word -- --word breakfast
```

运行后会在 `data/breakfast-draft.json` 生成初始草稿。

### 4. 生成 TTS 和节奏

```bash
npm run generate:audio -- --input data/breakfast-draft.json
```

这会自动：
- 合成中文 TTS 音频
- 检测静音并分割 beats
- 更新 `data/breakfast-draft-with-beats.json`
- 记录 TTS 成本到 `data/tts-cost-log.jsonl`

### 5. 渲染视频

```bash
npx remotion render BreakfastWordVideo renders/breakfast-word-video.mp4
```

## 模板库

| 场景 | 类型 | 用途 |
|------|------|------|
| `hero-word` | 入题 | 展示单词、音标、标签 |
| `origin-chain` | 词源 | 展示词汇历史演变链 |
| `meaning-compare` | 辨析 | 对比近义词或概念 |
| `full-screen-mood` | 氛围 | 情绪化场景描述 |
| `quote-page` | 引用 | 展示英文名句及中文翻译 |
| `answer-cards` | 问答 | 三个问题卡片式解答 |
| `ending-summary` | 总结 | 公式 + 要点 + 结语 |

## 工作流架构

```
输入单词
    ↓
diagnose_word.py → 推荐模板组合 + 生成草稿 JSON
    ↓
generate_audio_beats.py → TTS + 静音检测 + 节奏数据
    ↓
Remotion Player → 渲染视频
```

## 成本报告

查看累计 TTS 成本：
```bash
npm run cost:report
```

示例输出：
```
总合成字符: 2732 字符
总支出: ¥0.8196
平均单价: ¥0.3000 / 千字
```

## 技术栈

- **视频引擎**: Remotion (React + TypeScript)
- **样式**: Tailwind CSS v4 + Framer Motion
- **TTS**: 火山引擎 / 豆包 TTS 2.0
- **音频处理**: Python + pydub（静音检测）

## 许可

MIT
