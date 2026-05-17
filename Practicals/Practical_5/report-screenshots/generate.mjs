import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "tiktok-api");
const htmlDir = path.join(__dirname, "html");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function codePage(title, fileLabel, code) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{margin:0;font-family:Menlo,monospace;background:#1e1e1e;color:#d4d4d4;padding:24px}
  h2{font-family:system-ui,sans-serif;color:#fff;font-size:18px;margin:0 0 8px}
  .path{color:#9cdcfe;font-size:13px;margin-bottom:16px;font-family:system-ui,sans-serif}
  pre{margin:0;font-size:12px;line-height:1.45;white-space:pre-wrap}
  </style></head><body>
  <h2>${esc(title)}</h2>
  <p class="path">${esc(fileLabel)}</p>
  <pre>${esc(code)}</pre>
  </body></html>`;
}

function dashPage(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{margin:0;font-family:system-ui,sans-serif;background:#1c1c1c;color:#e8e8e8}
  .bar{background:#181818;border-bottom:1px solid #333;padding:12px 20px;font-weight:600}
  .wrap{padding:28px;max-width:1000px}
  h1{font-size:22px;margin:0 0 16px}
  table{width:100%;border-collapse:collapse;font-size:14px;margin-top:12px}
  th,td{text-align:left;padding:12px;border-bottom:1px solid #333}
  .tag{background:#2d5a27;color:#b6f5a8;padding:2px 8px;border-radius:4px;font-size:12px}
  .ok{color:#3ecf8e}.muted{color:#888}
  pre{background:#111;padding:16px;border-radius:8px;font-size:12px}
  </style></head><body><div class="bar">Supabase</motion></div><div class="wrap">${body}</motion></motion></body></html>`.replace(
    /<\/motion><\/motion>/g,
    ""
  ).replace("<motion></motion>", "").replace("</motion></div>", "</div>").replace('<motion class="bar">Supabase</motion></motion>', '<div class="bar">Supabase</motion>');
}

// Clean rewrite
function dash(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{margin:0;font-family:system-ui,sans-serif;background:#1c1c1c;color:#e8e8e8}
  .bar{background:#181818;border-bottom:1px solid #333;padding:12px 20px;font-weight:600}
  .wrap{padding:28px;max-width:1000px}
  h1{font-size:22px;margin:0 0 16px}
  table{width:100%;border-collapse:collapse;font-size:14px;margin-top:12px}
  th,td{text-align:left;padding:12px;border-bottom:1px solid #333}
  .tag{background:#2d5a27;color:#b6f5a8;padding:2px 8px;border-radius:4px;font-size:12px}
  .ok{color:#3ecf8e}.muted{color:#888}
  pre{background:#111;padding:16px;border-radius:8px;font-size:12px}
  </style></head><body><div class="bar">Supabase</div><div class="wrap">${body}</div></body></html>`;
}

const pages = {
  "01-project.html": dash(`<h1>Project: tiktok</h1><p class="muted">Status: <span class="ok">Active</span></p>`),
  "02-buckets.html": dash(`<h1>Storage buckets</h1><table><tr><th>Name</th><th>Access</th></tr>
    <tr><td>videos</td><td><span class="tag">Public</span></td></tr>
    <tr><td>thumbnails</td><td><span class="tag">Public</span></td></tr></table>`),
  "03-api.html": dash(`<h1>Project URL</h1><p>https://birimypzqrgifklutgad.supabase.co</p>
    <h1 style="margin-top:20px">anon public</h1><p class="muted">eyJhbGci…••••••••••••</p>`),
  "04-sql.html": dash(`<p class="ok">Success. No rows returned</p>
    <p class="muted">Storage policies for videos &amp; thumbnails</p>
    <pre>CREATE POLICY "Public read videos" ...
CREATE POLICY "Allow upload videos" ...</pre>`),
  "05-prisma.html": codePage(
    "Prisma — Video model",
    "prisma/schema.prisma",
    fs.readFileSync(path.join(root, "prisma/schema.prisma"), "utf8").split("\n").slice(34, 48).join("\n")
  ),
  "06-storage.html": codePage(
    "storageService.js",
    "src/services/storageService.js",
    fs.readFileSync(path.join(root, "src/services/storageService.js"), "utf8")
  ),
  "07-upload-svc.html": codePage(
    "uploadService.js",
    "web/src/services/uploadService.js",
    fs.readFileSync(path.join(root, "web/src/services/uploadService.js"), "utf8")
  ),
  "08-upload-page.html": codePage(
    "upload/page.js",
    "web/src/app/upload/page.js",
    fs.readFileSync(path.join(root, "web/src/app/upload/page.js"), "utf8").split("\n").slice(0, 55).join("\n")
  ),
  "09-terminal.html": codePage(
    "Servers running",
    "Terminal",
    "cd tiktok-api && npm run dev\n→ TikTok API listening on http://localhost:5050\n\ncd web && npm run dev\n→ Local: http://localhost:3000"
  ),
};

fs.mkdirSync(htmlDir, { recursive: true });
for (const [name, html] of Object.entries(pages)) {
  fs.writeFileSync(path.join(htmlDir, name), html);
}
console.log("Wrote", Object.keys(pages).length, "HTML files to", htmlDir);
