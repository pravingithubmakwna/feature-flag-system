import DemoShell from "../components/DemoShell.jsx";
import { useFlag } from "../flags/FeatureFlagContext.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Demo4Targeting() {
  const { enabled, evaluation } = useFlag("beta_analytics");
  const { user, users, setUser } = useUser();

  return (
    <DemoShell
      step={4}
      title="User & role targeting"
      concept="Open a feature only to admins, beta testers, or a named allow-list — perfect for internal dogfooding."
      talkTrack={[
        "Flag allows roles admin & beta, plus alice@company.com.",
        "Switch to Carol (user) — analytics panel hidden.",
        "Switch to Bob (beta) or Alice (admin) — panel appears.",
        "Explain: same production build, different experience by identity.",
      ]}
    >
      <div className="app-mock">
        <div className="app-mock-nav">
          <span>Acme Ops</span>
          <span className="muted">{user.name}</span>
        </div>
        <div className="app-mock-body">
          <div className="panel always">
            <h3>Overview</h3>
            <p>Visible to everyone.</p>
          </div>

          {enabled ? (
            <div className="panel beta">
              <h3>Beta Analytics</h3>
              <p>Conversion funnel, cohort retention, experiment scores.</p>
              <div className="mini-chart" aria-hidden>
                <span style={{ height: "40%" }} />
                <span style={{ height: "70%" }} />
                <span style={{ height: "55%" }} />
                <span style={{ height: "90%" }} />
              </div>
            </div>
          ) : (
            <div className="panel locked">
              <h3>Beta Analytics</h3>
              <p>Not enabled for this user / role.</p>
            </div>
          )}
        </div>

        <div className="user-chips">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`chip ${user.id === u.id ? "active" : ""}`}
              onClick={() => setUser(u)}
            >
              {u.name}
            </button>
          ))}
        </div>
        {evaluation && <p className="eval-line">Why: {evaluation.reason}</p>}
      </div>
    </DemoShell>
  );
}
