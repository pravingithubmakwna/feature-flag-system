/**
 * In-memory feature flag store — perfect for live demos.
 * Flags reset to these defaults when the server restarts.
 */

export const DEFAULT_FLAGS = {
  // Demo 1: Simple on/off
  new_dashboard: {
    key: "new_dashboard",
    name: "New Dashboard UI",
    description: "Shows the redesigned dashboard when enabled",
    enabled: false,
    type: "boolean",
    demo: 1,
  },

  // Demo 2: Kill switch
  payments_enabled: {
    key: "payments_enabled",
    name: "Payments Kill Switch",
    description: "Emergency kill switch — turn OFF to disable payments instantly",
    enabled: true,
    type: "boolean",
    demo: 2,
  },

  // Demo 3: Percentage rollout
  dark_mode: {
    key: "dark_mode",
    name: "Dark Mode (Rollout)",
    description: "Gradual % rollout — only a percentage of users see dark mode",
    enabled: true,
    type: "percentage",
    percentage: 0,
    demo: 3,
  },

  // Demo 4: User / role targeting
  beta_analytics: {
    key: "beta_analytics",
    name: "Beta Analytics",
    description: "Only selected roles/users get this feature",
    enabled: true,
    type: "targeting",
    allowedRoles: ["admin", "beta"],
    allowedUsers: ["alice@company.com"],
    demo: 4,
  },

  // Demo 5: A/B experiment (variants)
  checkout_button: {
    key: "checkout_button",
    name: "Checkout Button A/B Test",
    description: "Serves variant A or B for the checkout CTA",
    enabled: true,
    type: "experiment",
    variants: {
      A: { label: "Buy Now", color: "#2563eb" },
      B: { label: "Complete Purchase", color: "#16a34a" },
    },
    distribution: { A: 50, B: 50 },
    demo: 5,
  },
};

// Mutable runtime copy
export let flags = structuredClone(DEFAULT_FLAGS);

export function resetFlags() {
  flags = structuredClone(DEFAULT_FLAGS);
  return flags;
}

export function updateFlag(key, patch) {
  if (!flags[key]) return null;
  flags[key] = { ...flags[key], ...patch, key };
  return flags[key];
}

/**
 * Evaluate whether a flag is ON for a given user context.
 * Returns { enabled, variant?, reason }
 */
export function evaluateFlag(key, context = {}) {
  const flag = flags[key];
  if (!flag) {
    return { enabled: false, reason: "Flag not found" };
  }

  if (!flag.enabled) {
    return { enabled: false, reason: "Flag master switch is OFF" };
  }

  const userId = context.userId || context.email || "anonymous";
  const role = context.role || "user";

  switch (flag.type) {
    case "boolean":
      return { enabled: true, reason: "Boolean flag is ON" };

    case "percentage": {
      const bucket = hashToPercent(userId + ":" + key);
      const enabled = bucket < (flag.percentage ?? 0);
      return {
        enabled,
        reason: enabled
          ? `User bucket ${bucket}% < rollout ${flag.percentage}%`
          : `User bucket ${bucket}% >= rollout ${flag.percentage}%`,
        bucket,
      };
    }

    case "targeting": {
      const byUser = (flag.allowedUsers || []).includes(userId);
      const byRole = (flag.allowedRoles || []).includes(role);
      const enabled = byUser || byRole;
      return {
        enabled,
        reason: enabled
          ? byUser
            ? `User ${userId} is allow-listed`
            : `Role "${role}" is allow-listed`
          : `User/role not in allow-list`,
      };
    }

    case "experiment": {
      const variant = pickVariant(userId + ":" + key, flag.distribution || {});
      const variantConfig = flag.variants?.[variant] || null;
      return {
        enabled: true,
        variant,
        variantConfig,
        reason: `Assigned to variant ${variant}`,
      };
    }

    default:
      return { enabled: false, reason: "Unknown flag type" };
  }
}

/** Stable 0–99 bucket from a string (demo-friendly, not cryptographic). */
function hashToPercent(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

function pickVariant(seed, distribution) {
  const entries = Object.entries(distribution);
  if (!entries.length) return "A";
  const bucket = hashToPercent(seed);
  let cumulative = 0;
  for (const [name, weight] of entries) {
    cumulative += weight;
    if (bucket < cumulative) return name;
  }
  return entries[entries.length - 1][0];
}
