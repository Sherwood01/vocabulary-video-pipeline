export type Theme = {
  name: string;
  bg: string;
  panel: string;
  panelSoft: string;
  border: string;
  text: string;
  muted: string;
  pink: string;
  blue: string;
  green: string;
  gold: string;
  purple: string;
  whiteSoft: string;
  shellGradient: string;
  moodGradient: string;
};

export const themes: Record<string, Theme> = {
  galaxy: {
    name: "galaxy",
    bg: "#07090d",
    panel: "#0f141c",
    panelSoft: "#131a24",
    border: "rgba(255,255,255,0.08)",
    text: "#f8fafc",
    muted: "#9aa4b2",
    pink: "#fb7185",
    blue: "#60a5fa",
    green: "#4ade80",
    gold: "#facc15",
    purple: "#a78bfa",
    whiteSoft: "rgba(255,255,255,0.04)",
    shellGradient: `radial-gradient(circle at 20% 0%, rgba(96,165,250,0.10), transparent 26%), radial-gradient(circle at 80% 100%, rgba(251,113,133,0.08), transparent 28%)`,
    moodGradient: `linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #0f172a 100%)`,
  },
  sunset: {
    name: "sunset",
    bg: "#1a0f2e",
    panel: "#2e1065",
    panelSoft: "#4c1d95",
    border: "rgba(245,158,11,0.25)",
    text: "#fffbeb",
    muted: "#fcd34d",
    pink: "#f472b6",
    blue: "#38bdf8",
    green: "#34d399",
    gold: "#fbbf24",
    purple: "#c084fc",
    whiteSoft: "rgba(255,255,255,0.06)",
    shellGradient: `radial-gradient(circle at 20% 0%, rgba(245,158,11,0.12), transparent 28%), radial-gradient(circle at 80% 100%, rgba(192,132,252,0.10), transparent 30%)`,
    moodGradient: `linear-gradient(180deg, #2e1065 0%, #7c3aed 35%, #c2410c 70%, #1a0f2e 100%)`,
  },
  midnight: {
    name: "midnight",
    bg: "#020617",
    panel: "#0f172a",
    panelSoft: "#1e293b",
    border: "rgba(6,182,212,0.20)",
    text: "#ecfeff",
    muted: "#67e8f9",
    pink: "#22d3ee",
    blue: "#0ea5e9",
    green: "#2dd4bf",
    gold: "#fde047",
    purple: "#818cf8",
    whiteSoft: "rgba(255,255,255,0.05)",
    shellGradient: `radial-gradient(circle at 20% 0%, rgba(14,165,233,0.12), transparent 28%), radial-gradient(circle at 80% 100%, rgba(45,212,191,0.08), transparent 30%)`,
    moodGradient: `linear-gradient(180deg, #020617 0%, #0c4a6e 30%, #155e75 60%, #0891b2 100%)`,
  },
  forest: {
    name: "forest",
    bg: "#052e16",
    panel: "#064e3b",
    panelSoft: "#065f46",
    border: "rgba(16,185,129,0.20)",
    text: "#ecfdf5",
    muted: "#6ee7b7",
    pink: "#34d399",
    blue: "#22d3ee",
    green: "#a3e635",
    gold: "#facc15",
    purple: "#c084fc",
    whiteSoft: "rgba(255,255,255,0.05)",
    shellGradient: `radial-gradient(circle at 20% 0%, rgba(34,211,238,0.10), transparent 28%), radial-gradient(circle at 80% 100%, rgba(163,230,53,0.08), transparent 30%)`,
    moodGradient: `linear-gradient(180deg, #052e16 0%, #14532d 40%, #166534 70%, #064e3b 100%)`,
  },
};

export const getTheme = (name?: string) => themes[name || "galaxy"] || themes.galaxy;
