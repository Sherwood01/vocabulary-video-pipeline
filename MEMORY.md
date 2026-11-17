# 项目开发记忆与架构上下文 (MEMORY.md)

本文档记录项目的关键架构决策、开发进度、环境变量规范以及后续待办事项。

---

## 1. 项目概览与双端架构

本项目是一个自动生成英文词汇讲解短视频的 SaaS 平台：
- **后端视频生成管线 (Monolithic Pipeline)**：
  - 核心启动入口：`server.js` (端口 `3990`)
  - 脚本管线：`scripts/pipeline.py`、`scripts/diagnose_word.py`、`scripts/generate_audio_beats.py`
  - 渲染框架：Remotion (固定渲染端口 `5500`)
- **前端 SaaS 应用 (Next.js App)**：
  - 代码目录：`web/` (端口 `3100`)
  - 技术栈：Next.js 15 (App Router) + Tailwind CSS + Lucide Icons
  - 认证方案：自定义加盐哈希 (PBKDF2) + 基于 Cookie 的签名会话 (`vocabvids_session`) + 第三方 OAuth
  - 数据持久化：`data/saas_db.json` (内置用户额度、套餐及视频生成任务状态)

---

## 2. 2026-11-11 至 2026-11-13 关键工作成果

### 2.1 大模型通道适配
- **智谱 GLM-5.3-Flash 接入**：设置 `LLM=GLM`，接入官方开放平台端点 `https://open.bigmodel.cn/api/paas/v4/chat/completions`，模型配置为 `glm-5.3-flash`。
- **思考等级控制（关键）**：强制保底配置 `payload["reasoning_effort"] = os.environ.get("GLM_REASONING_EFFORT", "low")`，避免深度思考耗时过长与 JSON 输出截断。
- **配置与部署规范**：
  - 清理了 `.env` 中重复的 OAuth 配置块，保持干净。
  - **服务器重启规范**：因为脚本与数据均有目录挂载，修改代码或 `.env` 后的标准生效命令统一为秒级热重启，**严禁添加 build**：
    ```bash
    docker compose down && docker compose up -d
    ```

### 2.2 Creem.io 支付与订阅体系（Test Sandbox 已调通）
- **环境变量**：保存在 `web/.env.local` 与根目录 `.env`：
  - `CREEM_API_KEY=creem_test_3ULSFZpq7e9JzziFydSpGF`
  - `CREEM_WEBHOOK_SECRET=whsec_VWNkkjJ98fnbbt9OzObik`
  - `CREEM_PRODUCT_PRO=prod_4skTxykq9XNROZYvJ7iit1` ($19/月)
  - `CREEM_PRODUCT_ULTRA=prod_4CTo83Ynl7RJMyqNUP22d0` ($49/月)
  - `CREEM_PRODUCT_STUDIO=prod_2h12BviZRnaLHO4D7cSfk2` ($199/月)
- **收银台与沙箱联调**：
  - 调用 `creemClient.createCheckout` 成功返回 Creem 官方测试收银台链接（如 `https://creem.io/test/checkout/...`），支持自动预填用户 Email 与回跳地址。
- **Webhook 自动化闭环**：
  - `web/src/app/api/billing/webhook/route.ts` 接入 HMAC-SHA256 验签，处理 `checkout.completed` / `subscription.paid` / `subscription.canceled` 等事件。
  - 自动开通 30 天账期并重置/扩充月度额度；退订失效时自动降级回 `free` 计划。
- **用户中心与仪表盘打通**：
  - Dashboard 顶部增加实时套餐与剩余 Credits 仪表徽章，支持点击直达 Billing 页面。
  - 视频生成时严格校验用户剩余额度，超额返回 402 并唤起升级提示。

### 2.2 Pipeline 执行体验与日志瘦身
- **无缓冲输出**：设置 `PYTHONUNBUFFERED=1` 与 `line_buffering=True`，彻底消除了进程间管道输出阻塞。
- **Remotion 渲染日志节流**：在 `server.js` 中将 4000+ 行逐帧刷屏日志限制为每 20%（20%, 40%, 60%, 80%, 100%）输出一次。
- **公共资源复制折叠**：将 `Copying public dir` 100+ 行碎片日志压缩为单行汇总（如 `Public assets copied: 119.1 MB`）。
- **打包排障**：补全 `oasis-draft-with-beats.json`，解决 Remotion 打包过程中的缺少模块问题。

### 2.3 第三方 OAuth 登录完整落地 (Google / GitHub / Microsoft)
- **环境变量配置**：保存在 `web/.env.local` 与根目录 `.env` 中：
  - Google Client ID / Secret (`http://localhost:3100/api/auth/oauth/google`)
  - GitHub App Client ID / Secret (`http://localhost:3100/auth/callback/github`)
  - Microsoft Entra ID Client ID / Secret (`http://localhost:3100/auth/callback/microsoft`)
- **路由实现**：
  - `web/src/app/api/auth/oauth/google/route.ts`：一体化授权与换 Token、获取 profile。
  - `web/src/app/api/auth/oauth/github/route.ts` & `web/src/app/auth/callback/github/route.ts`：换 Token 并兼容私有主邮箱查询。
  - `web/src/app/api/auth/oauth/microsoft/route.ts` & `web/src/app/auth/callback/microsoft/route.ts`：通过 Microsoft Graph API 获取邮箱并完成登录。
- **业务打通**：
  - 授权成功后自动在 `web/src/lib/db.ts` 中查询或创建用户。
  - 新注册用户默认赠送 **5 条免费体验额度**（`free` 套餐）。
  - 签发 14 天有效期的安全 HttpOnly Cookie 并重定向至 `/dashboard`。
- **UI 呈现**：
  - 更新 `web/src/app/auth/sign-in/page.tsx` 与 `web/src/app/auth/sign-up/page.tsx`，保持全英文界面，使用标准 SVG 图标与完善的错误处理。

---

## 3. 开发行为与交付铁律（反思与强制执行准则）

1. **遇问题先深挖自身代码与现有成熟工程，严禁盲目归咎于外部环境**：
   - 出现业务异常（如支付未生效、状态未变更）时，**必须第一时间比对同类成熟项目（如 `clinical-data-process`）的具体实现和自身接口逻辑**，严查代码层面的请求/响应结构、大小写字段规范、解包逻辑，切忌凭空猜测是“网络端口/公网穿透”等外力原因，徒增排查弯路。
2. **测试交付“全套闭环准备”，严禁半成品交付**：
   - 每次修改代码或执行构建检查后，在通知用户测试之前，**必须由 Agent 主动完成全部环境准备**：
     1. 清理构建残留（如主动移除 `web/.next` 缓存，杜绝 Chunk Desync 运行时报错）；
     2. 检查并拉起最新开发服务；
     3. 提前发起实际 HTTP 探针（健康检查）确认页面 200 就绪。
   - 绝不能“改完代码拍拍屁股走人”，确保用户接手测试时 100% 顺畅开箱即用。

---

## 4. 2026-11-13 架构分拆落地（ai-saas 与 vocabulary-video-pipeline 物理解耦）

### 4.1 拆分拓扑架构（内外分流微服务体系）
- **内部自用引擎 (`vocabulary-video-pipeline/server.js`)**：
  - 监听端口：`3990`
  - 定位：**免鉴权自用 / OpenClaw 自动化调用通道**，自带本地预览界面与纯净渲染管道，完全不受商业化改动干扰。
- **SaaS 商业算力微服务 (`vocabulary-video-pipeline/worker-server.js`)**：
  - 监听端口：`5100` (`WORKER_PORT`)
  - 定位：**专供外部 `ai-saas` 调用的 RPC 计算节点**，提供标准任务派发 (`/api/worker/render`)、状态轮询 (`/api/worker/status/:taskId`) 与流式拉流接口 (`/api/worker/video/:filename`)。
- **商业平台与资产中心 (`D:\Claude code\ai-saas/`)**：
  - 监听端口：`3100`
  - 定位：面向全球用户的全栈 SaaS 平台。
  - 调度实现：通过内置的 `WorkerClient` 向 `http://localhost:5100` 派发任务；当 Worker 计算完成时，自动将成品 MP4 流式拉取并转存至 `ai-saas/storage/videos/`，彻底释放 Worker 端的存储压力。
- **彻底净化项已执行**：
  - `vocabulary-video-pipeline/.env` 中已完全剔除 OAuth、Creem、NEXT_PUBLIC 等商业化变量。
  - `vocabulary-video-pipeline/web/` 冗余目录已彻底物理删除。
  - `ai-saas` 统一使用 `worker-client.ts`，多余文件已全部清理。

---

## 5. 后续开发规划建议

1. **线上生产环境部署**：
   - 部署到线上服务器时，需将 OAuth 回调地址中的 `http://localhost:3100` 替换为线上实际域名，并在 Google Cloud、GitHub Developer Settings 和 Azure Portal 中同步追加生产回调 URL。
2. **Creem 支付与订阅对接**：
   - 检查 `web/src/app/api/billing/checkout` 与 Webhook，配置正式的 Stripe / Creem 支付产品 ID。
3. **视频生成队列与存储接入**：
   - 将本地生成的视频文件对接至 S3 / Cloudflare R2 存储桶，支持线上直接点播下载。

