import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const app = express();
const PORT = Number(process.env.PORT) || 5050;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Set SERVE_LOCAL_UPLOADS=false when all media is on Supabase and you no longer need local files.
if (process.env.SERVE_LOCAL_UPLOADS !== "false") {
  app.use("/uploads", express.static(path.join(rootDir, "uploads")));
}

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`TikTok API (02250359_WEB102_Works) listening on http://localhost:${PORT}`);
});
