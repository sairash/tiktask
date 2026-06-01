import { create } from "zustand";

export interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  accent: string;
  accentText: string;
  muted: string;
  inputBg: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      bg: "#f5f5f4",
      card: "#ffffff",
      text: "#000000",
      accent: "#f59e0b",
      accentText: "#ffffff",
      muted: "#d6d3d1",
      inputBg: "#e7e5e4",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      bg: "#0f172a",
      card: "#1e293b",
      text: "#f1f5f9",
      accent: "#3b82f6",
      accentText: "#ffffff",
      muted: "#475569",
      inputBg: "#334155",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      bg: "#052e16",
      card: "#14532d",
      text: "#dcfce7",
      accent: "#22c55e",
      accentText: "#052e16",
      muted: "#166534",
      inputBg: "#15803d",
    },
  },
  {
    id: "rose",
    name: "Rose",
    colors: {
      bg: "#fff1f2",
      card: "#ffffff",
      text: "#1c1917",
      accent: "#f43f5e",
      accentText: "#ffffff",
      muted: "#fecdd3",
      inputBg: "#ffe4e6",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      bg: "#0c4a6e",
      card: "#075985",
      text: "#e0f2fe",
      accent: "#0ea5e9",
      accentText: "#0c4a6e",
      muted: "#0369a1",
      inputBg: "#0284c7",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: {
      bg: "#f5f3ff",
      card: "#ffffff",
      text: "#1c1917",
      accent: "#8b5cf6",
      accentText: "#ffffff",
      muted: "#ddd6fe",
      inputBg: "#ede9fe",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      bg: "#431407",
      card: "#7c2d12",
      text: "#fff7ed",
      accent: "#f97316",
      accentText: "#431407",
      muted: "#9a3412",
      inputBg: "#c2410c",
    },
  },
  {
    id: "mocha",
    name: "Mocha",
    colors: {
      bg: "#292524",
      card: "#44403c",
      text: "#fafaf9",
      accent: "#d97706",
      accentText: "#292524",
      muted: "#57534e",
      inputBg: "#57534e",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    colors: {
      bg: "#fdf2f8",
      card: "#ffffff",
      text: "#1c1917",
      accent: "#ec4899",
      accentText: "#ffffff",
      muted: "#fbcfe8",
      inputBg: "#fce7f3",
    },
  },
  {
    id: "nord",
    name: "Nord",
    colors: {
      bg: "#2e3440",
      card: "#3b4252",
      text: "#eceff4",
      accent: "#88c0d0",
      accentText: "#2e3440",
      muted: "#4c566a",
      inputBg: "#434c5e",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    colors: {
      bg: "#ecfdf5",
      card: "#ffffff",
      text: "#1c1917",
      accent: "#10b981",
      accentText: "#ffffff",
      muted: "#a7f3d0",
      inputBg: "#d1fae5",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    colors: {
      bg: "#1e1f29",
      card: "#282a36",
      text: "#f8f8f2",
      accent: "#bd93f9",
      accentText: "#1e1f29",
      muted: "#44475a",
      inputBg: "#44475a",
    },
  },
];

export function themeToCss(colors: ThemeColors): string {
  return `:root {
  --theme-bg: ${colors.bg};
  --theme-card: ${colors.card};
  --theme-text: ${colors.text};
  --theme-accent: ${colors.accent};
  --theme-accent-text: ${colors.accentText};
  --theme-muted: ${colors.muted};
  --theme-input-bg: ${colors.inputBg};
}`;
}

export function applyCss(css: string) {
  let styleEl = document.getElementById("custom-theme-css") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "custom-theme-css";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

interface ThemeStore {
  activeThemeId: string;
  customCss: string;
  setActiveThemeId: (id: string) => void;
  setCustomCss: (css: string) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  activeThemeId: "default",
  customCss: "",
  setActiveThemeId: (id) => set({ activeThemeId: id }),
  setCustomCss: (css) => set({ customCss: css }),
}));

export default useThemeStore;
