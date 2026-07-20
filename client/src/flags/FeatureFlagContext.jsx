import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUser } from "../context/UserContext.jsx";

const FeatureFlagContext = createContext(null);

const API = "/api";

export function FeatureFlagProvider({ children }) {
  const { context } = useUser();
  const [definitions, setDefinitions] = useState([]);
  const [evaluated, setEvaluated] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [defRes, evalRes] = await Promise.all([
        fetch(`${API}/flags`),
        fetch(`${API}/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context }),
        }),
      ]);

      if (!defRes.ok || !evalRes.ok) {
        throw new Error("Failed to load feature flags");
      }

      const defData = await defRes.json();
      const evalData = await evalRes.json();
      setDefinitions(defData.flags || []);
      setEvaluated(evalData.results || {});
    } catch (err) {
      setError(err.message || "Could not reach flag API");
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateFlag = useCallback(
    async (key, patch) => {
      const res = await fetch(`${API}/flags/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Update failed");
      await refresh();
    },
    [refresh]
  );

  const resetFlags = useCallback(async () => {
    const res = await fetch(`${API}/flags/reset`, { method: "POST" });
    if (!res.ok) throw new Error("Reset failed");
    await refresh();
  }, [refresh]);

  const isEnabled = useCallback(
    (key) => Boolean(evaluated[key]?.enabled),
    [evaluated]
  );

  const getVariant = useCallback(
    (key) => evaluated[key]?.variant ?? null,
    [evaluated]
  );

  const getEvaluation = useCallback(
    (key) => evaluated[key] ?? null,
    [evaluated]
  );

  const value = useMemo(
    () => ({
      definitions,
      evaluated,
      loading,
      error,
      refresh,
      updateFlag,
      resetFlags,
      isEnabled,
      getVariant,
      getEvaluation,
    }),
    [
      definitions,
      evaluated,
      loading,
      error,
      refresh,
      updateFlag,
      resetFlags,
      isEnabled,
      getVariant,
      getEvaluation,
    ]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }
  return ctx;
}

/** Convenience hook: boolean gate */
export function useFlag(key) {
  const { isEnabled, getEvaluation, loading } = useFeatureFlags();
  return {
    enabled: isEnabled(key),
    evaluation: getEvaluation(key),
    loading,
  };
}
