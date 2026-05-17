import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import spacesRouter from "./routes/spaces";
import authRouter from "./routes/auth";
import bookingsRouter from "./routes/bookings";
import uploadRouter from "./routes/upload";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/spaces", spacesRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/upload", uploadRouter);

app.get("/", (_req, res) => {
  res.send(`<html><body style="font-family:sans-serif;padding:2rem;background:#0f172a;color:#e2e8f0"><h1 style="color:#3b82f6">🅿️ Wheelstay API</h1><p>Backend is running!</p><ul><li><a style="color:#60a5fa" href="/api/health">/api/health</a></li><li>/api/spaces</li><li>/api/auth/login</li><li>/api/auth/register</li><li>/api/bookings</li></ul></body></html>`);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Wheelstay API running on http://localhost:${PORT}`);
});
