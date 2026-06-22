## Git commit rules

### 应该提交
- `scripts/` — pipeline / 工具脚本
- `remotion.config.ts` — Remotion 配置
- `package.json` / `tsconfig.json` 等项目配置文件
- `src/HelloWorldWordVideo.tsx` — 参考示例组件
- `src/pipeline/` — 播放器等核心逻辑
- 其他手写的组件代码

### 不应该提交
- `data/*-draft.json` — pipeline step 1 生成的词汇讲稿
- `data/*-draft-with-beats.json` — pipeline step 2 生成的 beats 数据
- `data/tts-cost-log.jsonl` — TTS 消费记录
- `renders/` — 渲染输出（视频、临时文件）
- `Claude.mp4` — 项目根目录生成的视频
- `public/*-audio-*/` — pipeline 生成的音频文件
- `src/*WordVideo.tsx`（除 HelloWorld） — pipeline 注册生成的每个词对应的组件
- `.env` — 环境变量（含 API Key）

## Remotion 配置

- 渲染端口固定为 5500（`Config.setRendererPort(5500)`），避免被 Windows 端口排除范围占用
- 渲染时建议加 `--gl=swiftshader` 避免 Chrome 崩溃
