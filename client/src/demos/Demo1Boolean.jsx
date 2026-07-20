import DemoShell from "../components/DemoShell.jsx";
import { useFlag } from "../flags/FeatureFlagContext.jsx";

export default function Demo1Boolean() {
  const { enabled, evaluation } = useFlag("new_dashboard");

  return (
    <DemoShell
      step={1}
      title="Boolean on / off"
      concept="Simplest pattern: ship code dark, turn the feature on when ready — no redeploy."
      talkTrack={[
        "Flag new_dashboard starts OFF — users see the classic dashboard.",
        "In Admin, toggle New Dashboard UI to ON.",
        "UI switches instantly. Explain: code was already deployed; flag controlled visibility.",
        "Toggle OFF again to show instant rollback without a hotfix deploy.",
      ]}
    >
      <div className={`dashboard ${enabled ? "new" : "classic"}`}>
        <div className="dash-toolbar">
          <h2>{enabled ? "New Dashboard" : "Classic Dashboard"}</h2>
          <span className={`status-pill ${enabled ? "on" : "off"}`}>
            flag {enabled ? "ON" : "OFF"}
          </span>
        </div>

        {enabled ? (
          <div className="dash-new">
            <div className="metric">
              <span>Revenue</span>
              <strong>$128k</strong>
            </div>
            <div className="metric">
              <span>Active users</span>
              <strong>4,812</strong>
            </div>
            <div className="metric">
              <span>NPS</span>
              <strong>72</strong>
            </div>
            <p className="dash-note">
              Redesigned layout shipped behind <code>new_dashboard</code>.
            </p>
          </div>
        ) : (
          <div className="dash-classic">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Revenue</td>
                  <td>$128,000</td>
                </tr>
                <tr>
                  <td>Users</td>
                  <td>4,812</td>
                </tr>
              </tbody>
            </table>
            <p className="dash-note">Old UI still available via the flag.</p>
          </div>
        )}

        {evaluation && (
          <p className="eval-line">Why: {evaluation.reason}</p>
        )}
      </div>
    </DemoShell>
  );
}
