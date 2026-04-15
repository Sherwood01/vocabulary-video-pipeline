# Vocabulary Hybrid v1

## 已落地组件
- `HeroWordPage`
- `OriginChainPage`
- `MeaningClusterPage`
- `ManimClipSlotPage`
- `EndingSummaryPage`
- `SequenceGroup`

## 位置
- 主题与 token：`src/vocabHybrid/theme.ts`
- 组件：`src/vocabHybrid/components.tsx`
- 导出入口：`src/vocabHybrid/index.ts`
- 示例 composition：`src/SerendipityHybridV1.tsx`

## 当前示例
- composition id: `SerendipityHybridV1`
- 风格：16:9 横版
- 内容：serendipity
- 用途：证明 Remotion 主壳 + Manim 特种镜头已经能形成真正可复用的词视频模板页

## 下一步最值得做
1. 把文本与时长改成纯数据驱动
2. 给 `MeaningClusterPage` 加 beat-aware reveal
3. 给 `ManimClipSlotPage` 加 clip start/end 配置
4. 把 `OriginChainPage` 的连接方向做得更强
5. 接真正旁白与字幕时间轴
