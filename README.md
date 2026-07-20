# Feature Flag Demo (React + Node)

Small, presentation-ready demo of a **feature flag system** for IT company walkthroughs.

## What you can show

| # | Demo | Flag | Pattern |
|---|------|------|---------|
| 1 | On / Off Toggle | `new_dashboard` | Boolean — ship dark, enable later |
| 2 | Kill Switch | `payments_enabled` | Instant disable in an incident |
| 3 | Percentage Rollout | `dark_mode` | Gradual % release (sticky per user) |
| 4 | User Targeting | `beta_analytics` | Role / allow-list targeting |
| 5 | A/B Experiment | `checkout_button` | Variants A vs B |

## Quick start

```bash
cd c:\projects\demo
npm install
npm run install:all
npm start
```

- **App:** http://localhost:5173  
- **API:** http://localhost:4000  

Or run separately:

```bash
npm run server   # terminal 1 — Node API
npm run client   # terminal 2 — React (Vite)
```

## Demo script (one by one)

### Demo 1 — Boolean on/off
1. Open **Demo 1**. Classic dashboard is visible (`new_dashboard` OFF).
2. In **Flag Admin**, turn **New Dashboard UI** ON.
3. UI flips to the new dashboard — no redeploy.
4. Turn OFF again → instant rollback story.

### Demo 2 — Kill switch
1. Open **Demo 2**. Click **Pay $49** (works).
2. Pretend the payment gateway is down.
3. Turn **Payments Kill Switch** OFF in Admin.
4. Pay is blocked immediately — incident mitigation without a hotfix.

### Demo 3 — Percentage rollout
1. Open **Demo 3**. Set rollout slider to **0%** — everyone light mode.
2. Raise to **~40%**. Switch users in the top bar (**Act as**).
3. Some users get dark mode (bucket &lt; %), others don’t — sticky hash.
4. Move to **100%** for full release (or dial back if metrics look bad).

### Demo 4 — Targeting
1. Open **Demo 4**. Flag allows `admin`, `beta`, and `alice@company.com`.
2. Act as **Carol (User)** → analytics locked.
3. Act as **Bob (Beta)** or **Alice (Admin)** → beta panel appears.

### Demo 5 — A/B test
1. Open **Demo 5**. Each user is sticky-assigned to variant **A** or **B**.
2. Switch users — button label/color changes.
3. Click the CTA to simulate conversions on the scoreboard.
4. Explain: pick a winner, then roll 100% to that variant.

## Architecture

```
client (React)  --evaluate-->  server (Express)
     ^                              |
     |         PATCH /api/flags     |
     +-------- Admin panel ---------+
```

- Flags live in memory on the server (`server/flags.js`) — reset on restart or **Reset all**.
- React uses `FeatureFlagProvider` + `useFlag()` to gate UI.
- Evaluation supports boolean, percentage, targeting, and experiments.

## API cheatsheet

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/flags` | List flag definitions |
| PATCH | `/api/flags/:key` | Update a flag |
| POST | `/api/flags/reset` | Restore demo defaults |
| POST | `/api/evaluate` | Evaluate flags for a user context |

Example evaluate body:

```json
{
  "context": {
    "userId": "carol@company.com",
    "email": "carol@company.com",
    "role": "user"
  }
}
```

## Tips for presenting

- Keep **Flag Admin** visible on the right so the audience sees live toggles.
- Use **Act as** to change users during demos 3–5.
- Hit **Reset all** between full run-throughs.
