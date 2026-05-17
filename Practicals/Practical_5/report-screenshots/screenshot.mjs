import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlDir = path.join(__dirname, "html");

const files = fs.readdirSync(htmlDir).filter((f) => f.endsWith(".html")).sort();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });

for (const file of files) {
  const base = file.replace(".html", "");
  const png = path.join(__dirname, `${base}.png`);
  await page.goto(`file://${path.join(htmlDir, file)}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: png, fullPage: true });
  console.log("Wrote", png);
}

await browser.close();
