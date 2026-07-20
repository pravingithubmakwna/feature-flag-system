import { useState } from "react";
import { useUser } from "./context/UserContext.jsx";
import { useFeatureFlags } from "./flags/FeatureFlagContext.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import DemoNav from "./components/DemoNav.jsx";
import Demo1Boolean from "./demos/Demo1Boolean.jsx";
import Demo2KillSwitch from "./demos/Demo2KillSwitch.jsx";
import Demo3Percentage from "./demos/Demo3Percentage.jsx";
import Demo4Targeting from "./demos/Demo4Targeting.jsx";
import Demo5Experiment from "./demos/Demo5Experiment.jsx";

const DEMOS = [
  { id: 1, title: "On / Off Toggle", subtitle: "Boolean flag" },
  { id: 2, title: "Kill Switch", subtitle: "Emergency disable" },
  { id: 3, title: "Percentage Rollout", subtitle: "Gradual release" },
  { id: 4, title: "User Targeting", subtitle: "Role / allow-list" },
  { id: 5, title: "A/B Experiment", subtitle: "Variants" },
];

export default function App() {
  const [activeDemo, setActiveDemo] = useState(1);
  const [showAdmin, setShowAdmin] = useState(true);
  const { user, setUser, users } = useUser();
  const { loading, error, refresh } = useFeatureFlags();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ▣
          </span>
          <div>
            <p className="brand-name">FlagLab</p>
            <p className="brand-tag">Feature Flag Demo</p>
          </div>
        </div>

        <div className="topbar-controls">
          <label className="user-switch">
            <span>Act as</span>
            <select
              value={user.id}
              onChange={(e) => {
                const next = users.find((u) => u.id === e.target.value);
                if (next) setUser(next);
              }}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="btn ghost"
            onClick={() => setShowAdmin((v) => !v)}
          >
            {showAdmin ? "Hide" : "Show"} Admin
          </button>
          <button type="button" className="btn ghost" onClick={refresh}>
            Refresh
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <p className="sidebar-label">Demo walkthrough</p>
          <DemoNav
            demos={DEMOS}
            active={activeDemo}
            onSelect={setActiveDemo}
          />
          <p className="sidebar-hint">
            Switch demos one by one. Use the Admin panel to flip flags live
            while you present.
          </p>
        </aside>

        <main className="main">
          {error && (
            <div className="banner error">
              <strong>API offline.</strong> Start the server on port 4000 —{" "}
              <code>npm run server</code>
              <span> ({error})</span>
            </div>
          )}
          {loading && !error && (
            <div className="banner">Loading feature flags…</div>
          )}

          {activeDemo === 1 && <Demo1Boolean />}
          {activeDemo === 2 && <Demo2KillSwitch />}
          {activeDemo === 3 && <Demo3Percentage />}
          {activeDemo === 4 && <Demo4Targeting />}
          {activeDemo === 5 && <Demo5Experiment />}
        </main>

        {showAdmin && (
          <aside className="admin-rail">
            <AdminPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
