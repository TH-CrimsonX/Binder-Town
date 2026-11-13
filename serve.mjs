// static server แบบ node ล้วน (ไม่ต้อง npx)
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".json": "application/json", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".webp": "image/webp" };
const ROOT = process.cwd();

createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = join(ROOT, p);
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404); res.end("404"); return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
  res.end(readFileSync(file));
}).listen(8899, "127.0.0.1", () => console.log("static server on 8899"));
