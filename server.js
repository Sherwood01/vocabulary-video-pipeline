const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3990;

// Ensure directories exist
const DOWNLOADS_DIR = path.join(__dirname, "downloads");
const PUBLIC_DIR = path.join(__dirname, "public");
const RENDERS_DIR = path.join(__dirname, "renders");
const DATA_DIR = path.join(__dirname, "data");

[DOWNLOADS_DIR, PUBLIC_DIR, RENDERS_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// In-memory Task State
const tasks = new Map();
const queue = [];
let isProcessing = false;

/**
 * File Cleanup Utility: Automatically removes video, draft JSONs, and TTS audio files
 */
function cleanupTaskFiles(task) {
  if (!task || task.cleaned) return;
  task.cleaned = true;

  appendLog(task, `[CLEANUP] Starting automatic disk cleanup for word: "${task.word}"...`);

  try {
    // 1. Remove Rendered MP4
    if (task.videoPath && fs.existsSync(task.videoPath)) {
      fs.unlinkSync(task.videoPath);
      appendLog(task, `[CLEANUP] Deleted video: ${path.basename(task.videoPath)}`);
    }

    // 2. Remove Draft JSON files and temporary component TSX files
    const draft1 = path.join(DATA_DIR, `${task.word}-draft.json`);
    const draft2 = path.join(DATA_DIR, `${task.word}-draft-with-beats.json`);
    if (fs.existsSync(draft1)) { fs.unlinkSync(draft1); appendLog(task, `[CLEANUP] Deleted ${task.word}-draft.json`); }
    if (fs.existsSync(draft2)) { fs.unlinkSync(draft2); appendLog(task, `[CLEANUP] Deleted ${task.word}-draft-with-beats.json`); }

    const wordCap = task.word.charAt(0).toUpperCase() + task.word.slice(1);
    const tsx1 = path.join(__dirname, "src", `${wordCap}WordVideo.tsx`);
    const tsx2 = path.join(__dirname, "src", `${task.word}WordVideo.tsx`);
    if (fs.existsSync(tsx1)) { fs.unlinkSync(tsx1); appendLog(task, `[CLEANUP] Deleted ${wordCap}WordVideo.tsx`); }
    if (fs.existsSync(tsx2)) { fs.unlinkSync(tsx2); appendLog(task, `[CLEANUP] Deleted ${task.word}WordVideo.tsx`); }

    // 3. Remove TTS Audio directory in public/ if created
    const publicItems = fs.readdirSync(PUBLIC_DIR);
    for (const item of publicItems) {
      if (item.toLowerCase().includes(task.word.toLowerCase()) && item.includes("audio")) {
        const fullPath = path.join(PUBLIC_DIR, item);
        if (fs.statSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          appendLog(task, `[CLEANUP] Deleted audio directory: ${item}`);
        }
      }
    }

    appendLog(task, `[CLEANUP] Disk cleanup completed. 0 MB leftover.`);
  } catch (err) {
    appendLog(task, `[CLEANUP ERROR] Failed during file deletion: ${err.message}`);
  }
}

/**
 * Helper to cleanup task files by word
 */
function cleanupTaskFilesByWord(word) {
  if (!word) return;
  const cleanWord = word.trim().toLowerCase();
  try {
    const draft1 = path.join(DATA_DIR, `${cleanWord}-draft.json`);
    const draft2 = path.join(DATA_DIR, `${cleanWord}-draft-with-beats.json`);
    if (fs.existsSync(draft1)) fs.unlinkSync(draft1);
    if (fs.existsSync(draft2)) fs.unlinkSync(draft2);

    const wordCap = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    const tsx1 = path.join(__dirname, "src", `${wordCap}WordVideo.tsx`);
    const tsx2 = path.join(__dirname, "src", `${cleanWord}WordVideo.tsx`);
    if (fs.existsSync(tsx1)) fs.unlinkSync(tsx1);
    if (fs.existsSync(tsx2)) fs.unlinkSync(tsx2);

    const publicItems = fs.readdirSync(PUBLIC_DIR);
    for (const item of publicItems) {
      if (item.toLowerCase().includes(cleanWord) && item.includes("audio")) {
        const fullPath = path.join(PUBLIC_DIR, item);
        if (fs.statSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
      }
    }
  } catch (err) {
    console.error(`[CLEANUP ERROR] ${err.message}`);
  }
}

// Expired tasks timer removed: All deletions are strictly controlled by user manually!

// Task Queue Processor
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
  task.stage = "Initializing Pipeline";
  task.updatedAt = new Date().toISOString();
  appendLog(task, `[SYSTEM] Started pipeline execution for word: "${task.word}"`);

  const pythonCmd = process.platform === "win32" ? "py" : "python3";
  const pipelineScript = `"${path.join(__dirname, "scripts", "pipeline.py")}"`;

  const child = spawn(pythonCmd, [pipelineScript, "--word", `"${task.word}"`], {
    cwd: __dirname,
    shell: true,
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
  });

  task.child = child;

  child.stdout.on("data", (data) => {
    parseLogsAndProgress(task, data.toString("utf-8"));
  });

  child.stderr.on("data", (data) => {
    parseLogsAndProgress(task, data.toString("utf-8"));
  });

  child.on("close", async (code) => {
    if (task.status === "cancelled") {
      task.child = null;
      return;
    }
    task.child = null;
    if (code === 0) {
      task.progress = 95;
      appendLog(task, `[SYSTEM] Pipeline finished successfully. Locating MP4 video...`);

      const videoFiles = fs.existsSync(RENDERS_DIR) ? fs.readdirSync(RENDERS_DIR) : [];
      const matchedVideo = videoFiles.find((f) => f.toLowerCase().startsWith(task.word.toLowerCase()) && f.endsWith(".mp4"));

      let finalVideoName = matchedVideo;
      if (!finalVideoName) {
        const mp4s = videoFiles.filter((f) => f.endsWith(".mp4"));
        if (mp4s.length > 0) {
          finalVideoName = mp4s.sort((a, b) => fs.statSync(path.join(RENDERS_DIR, b)).mtimeMs - fs.statSync(path.join(RENDERS_DIR, a)).mtimeMs)[0];
        }
      }

      if (finalVideoName) {
        task.videoPath = path.join(RENDERS_DIR, finalVideoName);
        task.downloadUrl = `/api/download-file/${encodeURIComponent(finalVideoName)}`;
        task.playUrl = `/renders/${encodeURIComponent(finalVideoName)}`;
        task.status = "completed";
        task.stage = "Video Ready for Download";
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        appendLog(task, `[SYSTEM] MP4 Video ready: ${finalVideoName}. Direct download available.`);
      } else {
        task.status = "failed";
        task.stage = "Failed";
        task.error = "Video file not found in renders directory.";
        appendLog(task, `[ERROR] Could not find rendered MP4 video file.`);
      }
    } else {
      task.status = "failed";
      task.stage = "Failed";
      task.error = `Pipeline process exited with code ${code}`;
      appendLog(task, `[ERROR] Pipeline execution failed with code ${code}`);
    }

    task.updatedAt = new Date().toISOString();
    isProcessing = false;
    processQueue();
  });

  child.on("error", (err) => {
    appendLog(task, `[ERROR] Failed to start pipeline process: ${err.message}`);
    task.status = "failed";
    task.stage = "Failed";
    task.error = err.message;
    task.updatedAt = new Date().toISOString();
    isProcessing = false;
    processQueue();
  });
}

function appendLog(task, message) {
  const lines = message.split("\n").filter((l) => l.trim() !== "");
  const timestamp = new Date().toLocaleTimeString();
  for (const line of lines) {
    task.logs.push(`[${timestamp}] ${line}`);
  }
}

function parseLogsAndProgress(task, text) {
  appendLog(task, text);

  if (text.includes("Step 1") || text.includes("diagnose_word")) {
    task.stage = "Step 1: Diagnosing Word & Draft";
    task.progress = Math.max(task.progress, 15);
  } else if (text.includes("Step 2") || text.includes("generate_audio_beats")) {
    task.stage = "Step 2: Generating TTS Audio & Beats";
    task.progress = Math.max(task.progress, 40);
  } else if (text.includes("Step 3") || text.includes("remotion render")) {
    task.stage = "Step 3: Rendering Remotion Video";
    task.progress = Math.max(task.progress, 65);
  }

  const frameMatch = text.match(/Rendered (\d+)\/(\d+)/i) || text.match(/Frame (\d+)\/(\d+)/i);
  if (frameMatch) {
    const current = parseInt(frameMatch[1], 10);
    const total = parseInt(frameMatch[2], 10);
    if (total > 0) {
      const renderProgress = Math.floor((current / total) * 25);
      task.progress = Math.min(95, 65 + renderProgress);
    }
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

// HTTP Server
const server = http.createServer((req, res) => {
  // CORS Headers for WeChat Mini Program & Web Cross-Origin Requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
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

  // API: Post Generate Task
  if (req.method === "POST" && pathname === "/api/generate") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const word = payload.word;
        if (!word || typeof word !== "string" || !word.trim()) {
          return sendJson({ error: "Word parameter is required." }, 400);
        }

        const cleanWord = word.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, "");
        if (!cleanWord) {
          return sendJson({ error: "Invalid word provided." }, 400);
        }

        // Check if video file is already generated and shared in renders/
        const existingFiles = fs.existsSync(RENDERS_DIR) ? fs.readdirSync(RENDERS_DIR) : [];
        const cachedVideo = existingFiles.find((f) => f.toLowerCase().startsWith(cleanWord) && f.endsWith(".mp4"));
        if (cachedVideo) {
          const cachedTask = {
            id: `cached_${cleanWord}`,
            word: cleanWord,
            status: "completed",
            stage: "Video Ready (Cached)",
            progress: 100,
            cached: true,
            videoPath: path.join(RENDERS_DIR, cachedVideo),
            playUrl: `/renders/${encodeURIComponent(cachedVideo)}`,
            downloadUrl: `/api/download-file/${encodeURIComponent(cachedVideo)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          tasks.set(cachedTask.id, cachedTask);
          return sendJson({ taskId: cachedTask.id, message: "Cached video available instantly.", task: cachedTask });
        }

        const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newTask = {
          id: taskId,
          word: cleanWord,
          status: "queued",
          stage: "Queued in queue",
          progress: 5,
          logs: [`[${new Date().toLocaleTimeString()}] Task queued for word: "${cleanWord}"`],
          videoPath: null,
          downloadUrl: null,
          cleaned: false,
          error: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        tasks.set(taskId, newTask);
        queue.push(taskId);

        processQueue();

        sendJson({ taskId, message: "Task successfully queued.", task: newTask });
      } catch (e) {
        sendJson({ error: "Invalid JSON body" }, 400);
      }
    });
    return;
  }

  // API: Cancel Running or Queued Task
  if (req.method === "POST" && pathname === "/api/cancel") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const taskId = payload.taskId;
        if (!taskId || !tasks.has(taskId)) {
          return sendJson({ error: "Task not found." }, 400);
        }

        const task = tasks.get(taskId);
        if (task.status === "completed" || task.status === "failed" || task.status === "cancelled") {
          return sendJson({ message: `Task already in ${task.status} state.`, task });
        }

        // If in queue, remove from queue
        const qIndex = queue.indexOf(taskId);
        if (qIndex !== -1) {
          queue.splice(qIndex, 1);
        }

        // If running or queued, kill child process tree reliably
        try {
          if (process.platform === "win32") {
            if (task.child) spawn("taskkill", ["/pid", task.child.pid, "/f", "/t"]);
          } else {
            // Linux / Docker: Kill Python, Remotion, and Chromium processes for this word
            spawn("sh", ["-c", `pkill -9 -f "${task.word}" 2>/dev/null || (test -n "${task.child ? task.child.pid : ''}" && kill -9 ${task.child ? task.child.pid : ''}) 2>/dev/null || true`]);
          }
        } catch (killErr) {
          console.error(`[CANCEL] Failed to kill child process: ${killErr.message}`);
        }
        task.child = null;

        task.status = "cancelled";
        task.stage = "Cancelled by User";
        task.error = "Task was cancelled by user.";
        task.updatedAt = new Date().toISOString();

        cleanupTaskFiles(task);

        if (isProcessing) {
          isProcessing = false;
          processQueue();
        }

        sendJson({ success: true, message: "Task successfully cancelled.", task });
      } catch (e) {
        sendJson({ error: "Invalid JSON body" }, 400);
      }
    });
    return;
  }

  // API: List Available Videos in Library
  if (req.method === "GET" && pathname === "/api/videos") {
    const files = fs.existsSync(RENDERS_DIR) ? fs.readdirSync(RENDERS_DIR) : [];
    const videos = files
      .filter((f) => f.endsWith(".mp4"))
      .map((fileName) => {
        const fullPath = path.join(RENDERS_DIR, fileName);
        const stat = fs.statSync(fullPath);
        const word = fileName.replace(/-word-video\.mp4$/i, "").replace(/\.mp4$/i, "");
        return {
          fileName,
          word,
          sizeBytes: stat.size,
          sizeMb: (stat.size / (1024 * 1024)).toFixed(2),
          createdAt: stat.birthtime || stat.mtime,
          playUrl: `/renders/${encodeURIComponent(fileName)}`,
          downloadUrl: `/api/download-file/${encodeURIComponent(fileName)}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sendJson(videos);
  }

  // API: Delete Video File & Associated Temp Files (Manual Action)
  if (req.method === "DELETE" && pathname.startsWith("/api/videos/")) {
    const fileName = decodeURIComponent(pathname.replace("/api/videos/", ""));
    const fullPath = path.join(RENDERS_DIR, fileName);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        const word = fileName.replace(/-word-video\.mp4$/i, "").replace(/\.mp4$/i, "");
        cleanupTaskFilesByWord(word);
        return sendJson({ success: true, message: `Video ${fileName} deleted successfully.` });
      } catch (err) {
        return sendJson({ error: `Failed to delete file: ${err.message}` }, 500);
      }
    } else {
      return sendJson({ error: "Video file not found." }, 404);
    }
  }

  // API: Direct Video Download by FileName (Permanent, no auto-cleanup)
  if (req.method === "GET" && pathname.startsWith("/api/download-file/")) {
    const fileName = decodeURIComponent(pathname.replace("/api/download-file/", ""));
    const fullPath = path.join(RENDERS_DIR, fileName);
    if (!fs.existsSync(fullPath)) {
      return sendJson({ error: "Video file not found." }, 404);
    }

    const stat = fs.statSync(fullPath);
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    fs.createReadStream(fullPath).pipe(res);
    return;
  }

  // API: Download by Task ID (Backward compatible)
  if (req.method === "GET" && pathname.startsWith("/api/download/")) {
    const taskId = pathname.replace("/api/download/", "");
    const task = tasks.get(taskId);
    if (!task || task.status !== "completed" || !task.videoPath) {
      return sendJson({ error: "Video not available or task incomplete." }, 404);
    }

    if (!fs.existsSync(task.videoPath)) {
      return sendJson({ error: "Video file not found." }, 404);
    }

    const stat = fs.statSync(task.videoPath);
    const fileName = path.basename(task.videoPath);

    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    fs.createReadStream(task.videoPath).pipe(res);
    return;
  }

  // Serve Rendered MP4 Files (For Online Video Preview)
  if (req.method === "GET" && pathname.startsWith("/renders/")) {
    const fileName = decodeURIComponent(pathname.replace("/renders/", ""));
    const fullPath = path.join(RENDERS_DIR, fileName);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const stat = fs.statSync(fullPath);
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(fullPath, { start, end });

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });
        file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": stat.size,
          "Content-Type": "video/mp4",
        });
        fs.createReadStream(fullPath).pipe(res);
      }
      return;
    }
  }

  // API: Check Task Status
  if (req.method === "GET" && pathname.startsWith("/api/status/")) {
    const taskId = pathname.replace("/api/status/", "");
    const task = tasks.get(taskId);
    if (!task) return sendJson({ error: "Task not found." }, 404);
    return sendJson(task);
  }

  // API: List Tasks
  if (req.method === "GET" && pathname === "/api/tasks") {
    const allTasks = Array.from(tasks.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sendJson(allTasks);
  }

  // Serve Public Static Files
  let reqPath = pathname === "/" ? "/index.html" : pathname;
  if (reqPath.startsWith("/public/")) {
    reqPath = reqPath.replace("/public/", "/");
  }
  const filePath = path.join(PUBLIC_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`==================================================`);
  console.log(` Vocabulary Video Pipeline Server Running!`);
  console.log(` Web UI: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
