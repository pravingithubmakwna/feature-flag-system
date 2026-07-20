import { useState } from "react";
import DemoShell from "../components/DemoShell.jsx";
import { useFlag } from "../flags/FeatureFlagContext.jsx";

export default function Demo2KillSwitch() {
  const { enabled, evaluation } = useFlag("payments_enabled");
  const [message, setMessage] = useState("");

  function pay() {
    if (!enabled) {
      setMessage("Payments are disabled by kill switch. Try again later.");
      return;
    }
    setMessage("Payment of $49.00 succeeded.");
  }

  return (
    <DemoShell
      step={2}
      title="Kill switch"
      concept="When something breaks in production, disable the risky path instantly — no waiting for a deploy."
      talkTrack={[
        "Show checkout working with payments_enabled ON.",
        "Imagine a payment gateway outage or critical bug.",
        "In Admin, turn Payments Kill Switch OFF.",
        "Click Pay again — feature is blocked. Instant incident mitigation.",
        "Turn it back ON when the provider recovers.",
      ]}
    >
      <div className="checkout-card">
        <h2>Pro Plan</h2>
        <p className="price">
          $49 <span>/ month</span>
        </p>
        <ul>
          <li>Unlimited projects</li>
          <li>Priority support</li>
          <li>Feature flag console</li>
        </ul>
        <button
          type="button"
          className={`btn primary ${enabled ? "" : "disabled-look"}`}
          onClick={pay}
        >
          {enabled ? "Pay $49" : "Payments unavailable"}
        </button>
        {message && (
          <p className={`pay-msg ${enabled ? "ok" : "warn"}`}>{message}</p>
        )}
        {evaluation && <p className="eval-line">Why: {evaluation.reason}</p>}
      </div>
    </DemoShell>
  );
}
