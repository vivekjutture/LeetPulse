/**
 * Local development server that mimics Vercel's serverless behavior.
 * Run: node dev.js
 * This file is NOT deployed — it's only for local testing.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const handler = require("./api/leetcode");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams);

  // Route API requests to the serverless function
  // Support both: /api/leetcode/solved/neal_wu AND /api/leetcode?username=X&endpoint=Y
  const apiPathMatch = pathname.match(/^\/api\/leetcode\/(\w+)\/(.+)$/);

  if (apiPathMatch) {
    // Path-based: /api/leetcode/solved/neal_wu → endpoint=solved, username=neal_wu
    req.query = {
      endpoint: apiPathMatch[1],
      username: decodeURIComponent(apiPathMatch[2]),
      ...query,
    };
  } else if (pathname === "/api/leetcode") {
    // Legacy query param: /api/leetcode?username=X&endpoint=Y
    req.query = query;
  } else {
    // Not an API route — skip to static file serving below
    req.query = null;
  }

  if (req.query) {
    // Add Vercel-compatible res.status() and res.json() shims
    res.status = function (code) {
      res.statusCode = code;
      return res;
    };
    res.json = function (data) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };

    try {
      await handler(req, res);
    } catch (err) {
      console.error("[API Error]", err.message);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    }
    return;
  }

  // Serve static files from public/
  let filePath = path.join(
    PUBLIC_DIR,
    pathname === "/" ? "index.html" : pathname,
  );
  const ext = path.extname(filePath);

  try {
    const content = fs.readFileSync(filePath);
    res.setHeader(
      "Content-Type",
      MIME_TYPES[ext] || "application/octet-stream",
    );
    res.writeHead(200);
    res.end(content);
  } catch (e) {
    // Fallback to index.html
    try {
      const index = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"));
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(index);
    } catch (e2) {
      res.writeHead(404);
      res.end("Not Found");
    }
  }
});

process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err);
});

process.on("unhandledRejection", (err) => {
  console.error("[Unhandled Rejection]", err);
});

server.listen(PORT, () => {
  console.log(`🚀 Dev server running at http://localhost:${PORT}`);
});
