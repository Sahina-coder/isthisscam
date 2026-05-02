// ─── Global Theme Config ──────────────────────────────────────────────────────
// Default = Royal Blue Crystal
// After scan: green (safe) / red (scam) / yellow (suspicious)

export const THEMES = {
  default: {
    primary:      "#4361ee",
    primaryLight: "#7b9cff",
    primaryGlow:  "rgba(67,97,238,0.3)",
    aurora:       ["#4361ee", "#3a86ff", "#7209b7"],
    particles:    ["#4361ee", "#3a86ff", "#a8c1ff", "#ffffff"],
    glowColor:    "225 80 60",
    glowColors:   ["#4361ee", "#3a86ff", "#7b9cff"],
    scanBtn:      "linear-gradient(135deg, #4361ee 0%, #3a86ff 100%)",
    scanGlow:     "rgba(67,97,238,0.5)",
    accent:       "#3a86ff",
  },
  safe: {
    primary:      "#22c55e",
    primaryLight: "#4ade80",
    primaryGlow:  "rgba(34,197,94,0.3)",
    aurora:       ["#22c55e", "#4ade80", "#16a34a"],
    particles:    ["#22c55e", "#4ade80", "#86efac", "#ffffff"],
    glowColor:    "145 75 55",
    glowColors:   ["#22c55e", "#4ade80", "#86efac"],
    scanBtn:      "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    scanGlow:     "rgba(34,197,94,0.5)",
    accent:       "#4ade80",
  },
  scam: {
    primary:      "#ff4d6d",
    primaryLight: "#ff8fa3",
    primaryGlow:  "rgba(255,77,109,0.3)",
    aurora:       ["#ff4d6d", "#c9184a", "#ff0a54"],
    particles:    ["#ff4d6d", "#c9184a", "#ff8fa3", "#ffffff"],
    glowColor:    "350 80 60",
    glowColors:   ["#ff4d6d", "#c9184a", "#ff8fa3"],
    scanBtn:      "linear-gradient(135deg, #ff4d6d 0%, #c9184a 100%)",
    scanGlow:     "rgba(255,77,109,0.5)",
    accent:       "#ff4d6d",
  },
  suspicious: {
    primary:      "#f59e0b",
    primaryLight: "#fbbf24",
    primaryGlow:  "rgba(245,158,11,0.3)",
    aurora:       ["#f59e0b", "#fbbf24", "#d97706"],
    particles:    ["#f59e0b", "#fbbf24", "#fde68a", "#ffffff"],
    glowColor:    "40 85 60",
    glowColors:   ["#f59e0b", "#fbbf24", "#fde68a"],
    scanBtn:      "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    scanGlow:     "rgba(245,158,11,0.5)",
    accent:       "#fbbf24",
  },
};

export function getThemeFromScore(score) {
  if (score === null || score === undefined) return "default";
  if (score >= 61) return "scam";
  if (score >= 31) return "suspicious";
  return "safe";
}

export function getRiskConfig(score) {
  if (score >= 81) return { label: "🔴 Almost Certainly a Scam", color: "#ff4d6d", bg: "rgba(255,77,109,0.06)", border: "rgba(255,77,109,0.25)" };
  if (score >= 61) return { label: "🟠 High Risk",               color: "#fb923c", bg: "rgba(251,146,60,0.06)",  border: "rgba(251,146,60,0.25)"  };
  if (score >= 31) return { label: "🟡 Suspicious — Be Careful", color: "#fbbf24", bg: "rgba(251,191,36,0.06)",  border: "rgba(251,191,36,0.25)"  };
  return              { label: "🟢 Likely Safe",                 color: "#22c55e", bg: "rgba(34,197,94,0.06)",   border: "rgba(34,197,94,0.25)"   };
}

export function getSignalColor(type) {
  if (type === "red")    return { bar: "#ff4d6d", bg: "rgba(255,77,109,0.07)"  };
  if (type === "yellow") return { bar: "#fbbf24", bg: "rgba(251,191,36,0.07)"  };
  return                        { bar: "#22c55e", bg: "rgba(34,197,94,0.07)"   };
}