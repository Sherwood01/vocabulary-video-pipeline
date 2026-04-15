# Vocabulary Hybrid Prototype

## 目标
验证一条混合路线：
- Remotion 负责页面主壳、组件约束、字幕区、安全区、模板化
- Manim 负责特种镜头、复杂变形、一次性高表达关系动画

## 当前落地
- 新 composition：`VocabularyHybridPrototype`
- 新数据文件：`src/serendipityHybridData.ts`
- 新组件文件：`src/VocabularyHybridPrototype.tsx`
- 已复制 3 段 Manim 素材到：`public/manim-clips/`

## 当前示范内容
1. Hero：明确混合路线
2. Split：拆清 Remotion / Manim 职责
3. ManimBridge：在 Remotion 中直接嵌入 Manim clip
4. Pipeline：给下一版 vocabulary video 的生产路径

## 下一步
把这个 prototype 真正推进成词视频模板：
- `OriginChain`
- `MeaningCluster`
- `EndingSummary`
- `ManimClipSlot`
- beat-aware timing helpers
