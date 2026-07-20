import DemoShell from "../components/DemoShell.jsx";
import { useFlag } from "../flags/FeatureFlagContext.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Demo3Percentage() {
  const { enabled, evaluation } = useFlag("dark_mode");
  const { user, users, setUser } = useUser();

  return (
    <DemoShell
      step={3}
      title="Percentage rollout"
      concept="Release to 10% → 50% → 100% of users. Same build, controlled exposure, sticky assignment per user."
      talkTrack={[
        "Start with rollout at 0% — nobody gets dark mode.",
        "Raise the slider to ~30–50%. Switch users in the top bar.",
        "Some users get the feature (bucket < %), others do not — sticky via hash.",
        "Move to 100% for full release, or back down if metrics look bad.",
      ]}
    >
      <div className={`theme-stage ${enabled ? "dark" : "light"}`}>
        <div className="theme-inner">
          <h2>{enabled ? "Dark Mode unlocked" : "Light Mode (default)"}</h2>
          <p>
            Current user: <strong>{user.name}</strong>
          </p>
          {evaluation?.bucket != null && (
            <p>
              User bucket: <code>{evaluation.bucket}%</code> vs rollout
            </p>
          )}
          <p className="eval-line">
            {evaluation?.reason || "Waiting for evaluation…"}
          </p>

          <div className="user-chips">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`chip ${user.id === u.id ? "active" : ""}`}
                onClick={() => setUser(u)}
              >
                {u.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
