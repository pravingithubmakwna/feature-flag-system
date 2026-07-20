import { useState } from "react";
import DemoShell from "../components/DemoShell.jsx";
import { useFeatureFlags } from "../flags/FeatureFlagContext.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Demo5Experiment() {
  const { getEvaluation, getVariant } = useFeatureFlags();
  const { user, users, setUser } = useUser();
  const evaluation = getEvaluation("checkout_button");
  const variant = getVariant("checkout_button");
  const config = evaluation?.variantConfig;
  const [clicks, setClicks] = useState({ A: 0, B: 0 });

  function clickCta() {
    if (!variant) return;
    setClicks((c) => ({ ...c, [variant]: c[variant] + 1 }));
  }

  return (
    <DemoShell
      step={5}
      title="A/B experiment"
      concept="Serve different variants from one flag. Measure which CTA converts better, then ship the winner."
      talkTrack={[
        "Flag checkout_button assigns each user to A or B (sticky).",
        "Switch users — note different button label/color.",
        "Click the CTA a few times to simulate conversion events.",
        "In a real system, analytics would pick the winning variant, then you set 100% to that variant.",
      ]}
    >
      <div className="experiment-stage">
        <div className="product-card">
          <p className="eyebrow">Checkout</p>
          <h2>FlagLab Cloud</h2>
          <p>Enterprise feature flags for your stack.</p>
          <button
            type="button"
            className="btn primary experiment-cta"
            style={{ background: config?.color || "#2563eb" }}
            onClick={clickCta}
          >
            {config?.label || "Continue"}
          </button>
          <p className="eval-line">
            {user.name} → variant <strong>{variant || "?"}</strong>
            {evaluation?.reason ? ` — ${evaluation.reason}` : ""}
          </p>
        </div>

        <div className="scoreboard">
          <h3>Simulated clicks</h3>
          <div className="scores">
            <div>
              <span>Variant A</span>
              <strong>{clicks.A}</strong>
            </div>
            <div>
              <span>Variant B</span>
              <strong>{clicks.B}</strong>
            </div>
          </div>
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
