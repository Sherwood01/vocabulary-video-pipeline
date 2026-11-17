const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// 独立 Worker 服务运行端口，默认 5100 (避开 Windows 动态端口排除范围)
const PORT = process.env.WORKER_PORT || 5100;

// 项目关键目录
const ROOT_DIR = __dirname;
const RENDERS_DIR = path.join(ROOT_DIR, "renders");
const DATA_DIR = path.join(ROOT_DIR, "data");
const SCRIPTS_DIR = path.join(ROOT_DIR, "scripts");

[RENDERS_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 内存任务队列与状态
const tasks = new Map();
const queue = [];
let isProcessing = false;

/**
 * 后台排队执行管线
 */
async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const taskId = queue.shift();
  const task = tasks.get(taskId);
  if (!task) {
    isProcessing = false;
    processQueue();
    return;
  }

  task.status = "running";
  task.stage = "Initializing video pipeline";
  task.progress = 15;
  task.updatedAt = new Date().toISOString();

  const pythonCmd = process.platform === "win32" ? "py" : "python3";
  // 加上严格双引号，防止 Windows 路径空格截断
  const pipelineScript = `"${path.join(SCRIPTS_DIR, "pipeline.py")}"`;

  console.log(`[Worker Engine] Starting pipeline for taskId: ${taskId}, word: "${task.word}"`);

  let stderrLogs = "";
  const child = spawn(pythonCmd, [pipelineScript, "--word", `"${task.word}"`], {
    cwd: ROOT_DIR,
    shell: true,
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUNBUFFERED: "1" },
  });

  task.child = child;

  child.stdout.on("data", (data) => {
    const text = data.toString("utf-8");
    if (text.includes("generate_audio_beats")) {
      task.stage = "Synthesizing voiceover & audio beats";
      task.progress = Math.max(task.progress, 45);
    } else if (text.includes("remotion render")) {
      task.stage = "Rendering 1080p Remotion composition";
      task.progress = Math.max(task.progress, 75);
    }

    const frameMatch = text.match(/Rendered (\d+)\/(\d+)/i) || text.match(/Frame (\d+)\/(\d+)/i);
    if (frameMatch) {
      const current = parseInt(frameMatch[1], 10);
      const total = parseInt(frameMatch[2], 10);
      if (total > 0) {
        task.progress = Math.min(95, 75 + Math.floor((current / total) * 20));
      }
    }
  });

  child.stderr.on("data", (data) => {
    const text = data.toString("utf-8");
    stderrLogs += text;
    console.error(`[Worker Pipeline STDERR]`, text);
  });

  child.on("close", (code) => {
    task.child = null;
    task.updatedAt = new Date().toISOString();

    if (code === 0) {
      const files = fs.existsSync(RENDERS_DIR) ? fs.readdirSync(RENDERS_DIR) : [];
      const matched = files.find((f) => f.toLowerCase().startsWith(task.word.toLowerCase()) && f.endsWith(".mp4"));
      const finalName = matched || files.find((f) => f.endsWith(".mp4"));

      if (finalName) {
        task.status = "completed";
        task.stage = "Render complete and ready";
        task.progress = 100;
        task.videoFileName = finalName;
        task.videoUrl = `/api/worker/video/${encodeURIComponent(finalName)}`;
        task.downloadUrl = `/api/worker/video/${encodeURIComponent(finalName)}`;
        task.completedAt = new Date().toISOString();
        console.log(`[Worker Engine] Task ${taskId} succeeded: ${finalName}`);
      } else {
        task.status = "failed";
        task.stage = "Rendered file missing";
        task.error = "Video file not found in output directory.";
      }
    } else {
      task.status = "failed";
      task.stage = "Pipeline exited with error";
      task.error = stderrLogs.trim() ? stderrLogs.slice(-200) : `Pipeline process exited with code ${code}`;
    }

    isProcessing = false;
    processQueue();
  });
}

// HTTP Worker API Server
const server = http.createServer((req, res) => {
  // 允许跨域调用 (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  const sendJson = (data, statusCode = 200) => {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
  };

  // 1. 标准任务派发接口: POST /api/worker/render
  if (req.method === "POST" && pathname === "/api/worker/render") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const rawWord = payload.promptOrWord || payload.word;
        if (!rawWord || typeof rawWord !== "string") {
          return sendJson({ error: "promptOrWord is required" }, 400);
        }

        const cleanWord = rawWord.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, "");
        const taskId = payload.taskId || `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // 检查本地是否有已完成渲染的缓存
        const existingFiles = fs.existsSync(RENDERS_DIR) ? fs.readdirSync(RENDERS_DIR) : [];
        const cached = existingFiles.find((f) => f.toLowerCase().startsWith(cleanWord) && f.endsWith(".mp4"));

        if (cached) {
          const taskObj = {
            taskId,
            word: cleanWord,
            status: "completed",
            stage: "Completed (Cached)",
            progress: 100,
            videoUrl: `/api/worker/video/${encodeURIComponent(cached)}`,
            downloadUrl: `/api/worker/video/${encodeURIComponent(cached)}`,
            updatedAt: new Date().toISOString(),
          };
          tasks.set(taskId, taskObj);
          return sendJson(taskObj);
        }

        const newTask = {
          taskId,
          word: cleanWord,
          status: "queued",
          stage: "Queued in worker engine",
          progress: 5,
          videoUrl: null,
          downloadUrl: null,
          error: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        tasks.set(taskId, newTask);
        queue.push(taskId);

        processQueue();

        return sendJson(newTask);
      } catch (e) {
        return sendJson({ error: "Invalid JSON body" }, 400);
      }
    });
    return;
  }

  // 2. 标准任务状态查询: GET /api/worker/status/:taskId
  if (req.method === "GET" && pathname.startsWith("/api/worker/status/")) {
    const taskId = decodeURIComponent(pathname.replace("/api/worker/status/", ""));
    const task = tasks.get(taskId);
    if (!task) {
      return sendJson({ error: "Task not found on this worker" }, 404);
    }
    return sendJson({
      taskId: task.taskId,
      status: task.status,
      stage: task.stage,
      progress: task.progress,
      videoUrl: task.videoUrl,
      downloadUrl: task.downloadUrl,
      error: task.error,
      updatedAt: task.updatedAt,
    });
  }

  // 3. 视频流式传输与下载: GET /api/worker/video/:filename
  if (req.method === "GET" && pathname.startsWith("/api/worker/video/")) {
    const fileName = decodeURIComponent(pathname.replace("/api/worker/video/", ""));
    const filePath = path.join(RENDERS_DIR, fileName);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return sendJson({ error: "Video file not found" }, 404);
    }

    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": "video/mp4",
        "Content-Disposition": `inline; filename="${fileName}"`,
      });
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  // 健康检查接口
  if (pathname === "/health" || pathname === "/") {
    return sendJson({
      service: "Vocab Video Render Worker",
      status: "healthy",
      activeTasks: queue.length + (isProcessing ? 1 : 0),
      timestamp: new Date().toISOString(),
    });
  }

  sendJson({ error: "Not Found" }, 404);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(` Vocab Video Render Worker Service Running!`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Ready to accept remote render jobs from SaaS Web.`);
  console.log(`====================================================`);
});

