import express from "express";
import cors from "cors";
import {
  flags,
  resetFlags,
  updateFlag,
  evaluateFlag,
  DEFAULT_FLAGS,
} from "./flags.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "feature-flag-demo" });
});

// List all flag definitions (admin view)
app.get("/api/flags", (_req, res) => {
  res.json({ flags: Object.values(flags) });
});

// Get one flag definition
app.get("/api/flags/:key", (req, res) => {
  const flag = flags[req.params.key];
  if (!flag) return res.status(404).json({ error: "Flag not found" });
  res.json(flag);
});

// Update a flag (toggle, change %, targeting, etc.)
app.patch("/api/flags/:key", (req, res) => {
  const updated = updateFlag(req.params.key, req.body);
  if (!updated) return res.status(404).json({ error: "Flag not found" });
  console.log(`[FLAG UPDATE] ${req.params.key}`, req.body);
  res.json(updated);
});

// Reset all flags to demo defaults
app.post("/api/flags/reset", (_req, res) => {
  const reset = resetFlags();
  console.log("[FLAGS RESET]");
  res.json({ flags: Object.values(reset) });
});

// Evaluate flags for a user context (what the app uses)
app.post("/api/evaluate", (req, res) => {
  const context = req.body?.context || {};
  const keys = req.body?.keys || Object.keys(DEFAULT_FLAGS);

  const results = {};
  for (const key of keys) {
    results[key] = evaluateFlag(key, context);
  }

  res.json({ context, results });
});

// Evaluate a single flag
app.post("/api/evaluate/:key", (req, res) => {
  const context = req.body?.context || {};
  const result = evaluateFlag(req.params.key, context);
  res.json({ key: req.params.key, context, ...result });
});

app.listen(PORT, () => {
  console.log(`\n🚩 Feature Flag API running at http://localhost:${PORT}`);
  console.log(`   GET  /api/flags`);
  console.log(`   POST /api/evaluate`);
  console.log(`   PATCH /api/flags/:key\n`);
});
