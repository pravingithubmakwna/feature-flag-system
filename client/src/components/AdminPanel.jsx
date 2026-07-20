import { useFeatureFlags } from "../flags/FeatureFlagContext.jsx";

export default function AdminPanel() {
  const { definitions, updateFlag, resetFlags, getEvaluation } =
    useFeatureFlags();

  const sorted = [...definitions].sort((a, b) => (a.demo || 0) - (b.demo || 0));

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h2>Flag Admin</h2>
          <p>Change flags live — app updates instantly</p>
        </div>
        <button type="button" className="btn small" onClick={resetFlags}>
          Reset all
        </button>
      </div>

      <ul className="flag-list">
        {sorted.map((flag) => {
          const evaluation = getEvaluation(flag.key);
          return (
            <li key={flag.key} className="flag-card">
              <div className="flag-card-top">
                <div>
                  <p className="flag-demo">Demo {flag.demo}</p>
                  <h3>{flag.name}</h3>
                  <p className="flag-key">
                    <code>{flag.key}</code>
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={Boolean(flag.enabled)}
                    onChange={(e) =>
                      updateFlag(flag.key, { enabled: e.target.checked })
                    }
                  />
                  <span className="slider" />
                </label>
              </div>

              <p className="flag-desc">{flag.description}</p>

              {flag.type === "percentage" && (
                <label className="field">
                  <span>Rollout: {flag.percentage}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={flag.percentage ?? 0}
                    onChange={(e) =>
                      updateFlag(flag.key, {
                        percentage: Number(e.target.value),
                      })
                    }
                  />
                </label>
              )}

              {flag.type === "targeting" && (
                <div className="meta-box">
                  <p>
                    Roles:{" "}
                    <code>{(flag.allowedRoles || []).join(", ") || "—"}</code>
                  </p>
                  <p>
                    Users:{" "}
                    <code>{(flag.allowedUsers || []).join(", ") || "—"}</code>
                  </p>
                </div>
              )}

              {flag.type === "experiment" && (
                <div className="meta-box">
                  <p>
                    Variants: A {flag.distribution?.A ?? 0}% / B{" "}
                    {flag.distribution?.B ?? 0}%
                  </p>
                </div>
              )}

              {evaluation && (
                <div
                  className={`eval-chip ${evaluation.enabled ? "on" : "off"}`}
                >
                  <strong>
                    {evaluation.enabled ? "ON for current user" : "OFF"}
                  </strong>
                  {evaluation.variant && (
                    <span> · variant {evaluation.variant}</span>
                  )}
                  <span className="eval-reason">{evaluation.reason}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
