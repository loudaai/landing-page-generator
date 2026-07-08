import type { LandingPageContent, LandingPageDesignInput } from "./types";

type Vars = Record<string, string>;

const DARK_CURATED = {
  bg: "#0a0a0c",
  surface: "#131318",
  surface2: "#1b1b22",
  fg: "#f5f5f6",
  muted: "#a3a3ad",
  border: "rgba(255,255,255,0.09)",
  borderStrong: "rgba(255,255,255,0.16)",
  glow: "rgba(255,255,255,0.07)",
  primary: "#f5f5f6",
  primaryFg: "#0a0a0c",
  secondary: "#26262e",
  accent: "#9b9ba6",
};

const LIGHT_CURATED = {
  bg: "#fafaf9",
  surface: "#ffffff",
  surface2: "#f3f3f1",
  fg: "#18181b",
  muted: "#56565f",
  border: "rgba(0,0,0,0.09)",
  borderStrong: "rgba(0,0,0,0.14)",
  glow: "rgba(0,0,0,0.05)",
  primary: "#18181b",
  primaryFg: "#ffffff",
  secondary: "#e7e7e3",
  accent: "#52525b",
};

export type VisualStyle =
  | "auto"
  | "local-business"
  | "saas"
  | "fitness"
  | "education"
  | "portfolio"
  | "service"
  | "default";

export function inferVisualStyle(content: LandingPageContent): VisualStyle {
  const text = [
    content.brandName,
    content.tagline,
    content.heroHeadline,
    content.heroSubheadline,
    content.problemDescription,
    content.solutionDescription,
    ...content.benefits,
    ...content.features.map((f) => `${f.title} ${f.description}`),
  ]
    .join(" ")
    .toLowerCase();

  if (/auto|vehicle|car|repair|mechanic|automotive|garage|tire|motor|fleet|engine|brake/.test(text))
    return "auto";
  if (/gym|workout|fitness|exercise|training|muscle|run|wellness|habit|routine|streak/.test(text))
    return "fitness";
  if (/study|student|learn|course|school|class|note|exam|education|tutoring|academic|quiz/.test(text))
    return "education";
  if (/app|software|saas|ai tool|platform|dashboard|api|tech|startup|productivity|tool/.test(text))
    return "saas";
  if (/coffee|restaurant|shop|store|bakery|local|menu|order|location/.test(text))
    return "local-business";
  if (/portfolio|designer|photographer|artist|writer|creative/.test(text))
    return "portfolio";
  if (/agency|freelance|studio|service|consult/.test(text)) return "service";
  return "default";
}

export function resolvePalette(design: LandingPageDesignInput) {
  const dark = design.siteTheme === "dark";
  const curated = dark ? DARK_CURATED : LIGHT_CURATED;

  const customized = Boolean(design.colorsCustomized);
  const logoDriven = design.useLogoPalette && Boolean(design.logoDataUrl);

  if (customized || logoDriven) {
    return {
      ...curated,
      primary: design.primaryColor,
      primaryFg: readableText(design.primaryColor),
      secondary: design.secondaryColor,
      accent: design.accentColor,
    };
  }
  return curated;
}

export function themeVars(design: LandingPageDesignInput): Vars {
  const p = resolvePalette(design);
  return {
    "--bg": p.bg,
    "--surface": p.surface,
    "--surface-2": p.surface2,
    "--fg": p.fg,
    "--muted": p.muted,
    "--border": p.border,
    "--border-strong": p.borderStrong,
    "--glow": p.glow,
    "--primary": p.primary,
    "--primary-fg": p.primaryFg,
    "--secondary": p.secondary,
    "--accent": p.accent,
    "--maxw": "1200px",
    "--radius": "16px",
    "--radius-lg": "24px",
    "--shadow":
      design.siteTheme === "dark"
        ? "0 24px 60px -20px rgba(0,0,0,0.65)"
        : "0 24px 60px -24px rgba(15,15,25,0.25)",
    "--tint": `color-mix(in srgb, ${p.primary} 16%, transparent)`,
    "--tint-strong": `color-mix(in srgb, ${p.primary} 30%, transparent)`,
    "--accent-tint": `color-mix(in srgb, ${p.accent} 22%, transparent)`,
  };
}

/* -------------------------------------------------------------------------- */
/* Shared deterministic graphics                                              */
/* -------------------------------------------------------------------------- */

export const FEATURE_ICONS: string[][] = [
  ["M13 2 L4 14 L11 14 L10 22 L20 9 L13 9 Z"],
  ["M12 3 L19 6 V11 C19 16 16 19 12 21 C8 19 5 16 5 11 V6 Z"],
  ["M4 20 V11", "M10 20 V4", "M16 20 V13"],
  ["M12 3 L21 8 L12 13 L3 8 Z", "M3 13 L12 18 L21 13"],
  [
    "M12 3 C17 3 20 7 20 12 C20 17 17 21 12 21 C7 21 3 17 3 12 C3 7 7 3 12 3 Z",
    "M3 12 H21",
    "M12 3 C9 7 9 17 12 21",
    "M12 3 C15 7 15 17 12 21",
  ],
  [
    "M12 20 C12 20 4 14 4 8.5 C4 6 6 4 8.5 4 C10.5 4 12 5.5 12 5.5 C12 5.5 13.5 4 15.5 4 C18 4 20 6 20 8.5 C20 14 12 20 12 20 Z",
  ],
  [
    "M12 3 C17 3 21 7 21 12 C21 17 17 21 12 21 C7 21 3 17 3 12 C3 7 7 3 12 3 Z",
    "M8 12 L11 15 L16 9",
  ],
  [
    "M12 3 C17 3 21 7 21 12 C21 17 17 21 12 21 C7 21 3 17 3 12 C3 7 7 3 12 3 Z",
    "M12 8 C14.2 8 16 9.8 16 12 C16 14.2 14.2 16 12 16 C9.8 16 8 14.2 8 12 C8 9.8 9.8 8 12 8 Z",
  ],
  [
    "M14 4 C18 6 19 11 17 15 L9 15 C7 11 6 6 10 4 C11 5 12 5 14 4 Z",
    "M9 15 L7 19 L10 18 Z",
    "M14 15 L17 19 L14 18 Z",
    "M12 9 C13.1 9 14 9.9 14 11 C14 12.1 13.1 13 12 13 C10.9 13 10 12.1 10 11 C10 9.9 10.9 9 12 9 Z",
  ],
  ["M4 20 C5 16 9 16 9 16 C13 16 14 12 14 12 L19 7 C20 6 20 5 19 4 C18 3 17 3 16 4 L11 9 C11 9 7 10 7 14 C7 18 4 20 4 20 Z", "M14 12 L16 14"],
  ["M6 11 V8 C6 5.2 8.2 3 11 3 C13.8 3 16 5.2 16 8 V11", "M5 11 H18 V20 H5 Z"],
  ["M15 4 L20 9", "M19 3 L21 5", "M14 9 L16 11", "M4 20 L10 14", "M6 16 L8 18"],
];

export function featureGlyphSvg(index: number, color: string): string {
  const paths = FEATURE_ICONS[index % FEATURE_ICONS.length];
  const inner = paths
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />`
    )
    .join("");
  return `<svg class="glyph" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

function wrenchSvg(color: string): string {
  return `<svg class="art-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 7 L17 4 C19 2 22 5 20 7 L13 14 L9 10 Z M4 20 L10 14" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
}

export function heroArtHtml(
  style: VisualStyle,
  design: LandingPageDesignInput
): string {
  const accent = design.accentColor;
  const enhanced = design.useGeneratedImages ? " art-enhanced" : "";
  const base = `<div class="art-glow"></div><div class="art-grid"></div>`;

  if (style === "auto") {
    return `<div class="hero-art art-auto${enhanced}" aria-hidden="true">${base}
      <div class="art-card art-main">
        <div class="art-head"><span class="art-chip">Vehicle inspection</span><span class="art-status">In progress</span></div>
        <div class="art-checklist">
          <span class="art-row"><span class="art-box on"></span><span class="art-line"></span></span>
          <span class="art-row"><span class="art-box on"></span><span class="art-line short"></span></span>
          <span class="art-row"><span class="art-box"></span><span class="art-line tiny"></span></span>
        </div>
        <div class="art-foot">${wrenchSvg(accent)}<span class="art-line short"></span></div>
      </div>
      <div class="art-card art-float">
        <span class="art-dot"></span><span class="art-line"></span><span class="art-bar"></span>
      </div>
    </div>`;
  }

  if (style === "saas") {
    return `<div class="hero-art art-saas${enhanced}" aria-hidden="true">${base}
      <div class="art-card art-main">
        <div class="art-head"><span class="art-chip">Dashboard</span><span class="art-status">Live</span></div>
        <div class="art-stats">
          <span class="art-stat"><b></b><i></i></span>
          <span class="art-stat"><b></b><i></i></span>
          <span class="art-stat"><b></b><i></i></span>
        </div>
        <svg class="art-spark" viewBox="0 0 200 48" preserveAspectRatio="none"><polyline points="0,40 32,30 64,34 96,18 128,24 160,10 200,16" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </div>
      <div class="art-card art-float">
        <span class="art-node"></span><span class="art-line short"></span><span class="art-node"></span>
      </div>
    </div>`;
  }

  if (style === "fitness") {
    return `<div class="hero-art art-fitness${enhanced}" aria-hidden="true">${base}
      <div class="art-card art-main">
        <div class="art-head"><span class="art-chip">Today's plan</span><span class="art-status">Day 12</span></div>
        <div class="art-gauge"></div>
        <div class="art-checklist">
          <span class="art-row"><span class="art-box on"></span><span class="art-line"></span></span>
          <span class="art-row"><span class="art-box"></span><span class="art-line short"></span></span>
        </div>
      </div>
      <div class="art-card art-float">
        <span class="art-dot"></span><span class="art-bar"></span>
      </div>
    </div>`;
  }

  if (style === "education") {
    return `<div class="hero-art art-edu${enhanced}" aria-hidden="true">${base}
      <div class="art-card art-main">
        <div class="art-head"><span class="art-chip">Study set</span><span class="art-status">82%</span></div>
        <div class="art-notes">
          <span class="art-line"></span><span class="art-line"></span><span class="art-line short"></span><span class="art-line tiny"></span>
        </div>
        <div class="art-checklist">
          <span class="art-row"><span class="art-box on"></span><span class="art-line short"></span></span>
          <span class="art-row"><span class="art-box"></span><span class="art-line tiny"></span></span>
        </div>
      </div>
      <div class="art-card art-float">
        <span class="art-dot"></span><span class="art-line short"></span>
      </div>
    </div>`;
  }

  // default / floating UI cards
  return `<div class="hero-art${enhanced}" aria-hidden="true">${base}
    <div class="art-card art-card--a">
      <span class="art-dot"></span>
      <div class="art-line"></div>
      <div class="art-line short"></div>
    </div>
    <div class="art-card art-card--b">
      <div class="art-bar"></div>
      <div class="art-line"></div>
      <div class="art-line short"></div>
    </div>
    <div class="art-orb"></div>
    <div class="art-ring"></div>
  </div>`;
}

export function showcaseGraphicHtml(
  style: VisualStyle,
  design: LandingPageDesignInput
): string {
  const enhanced = design.useGeneratedImages ? " art-enhanced" : "";
  return `<div class="browser${enhanced}" aria-hidden="true">
  <div class="browser-bar"><span></span><span></span><span></span></div>
  <div class="browser-body">
    <div class="bb-row">
      <div class="bb-thumb"></div>
      <div class="bb-lines"><span></span><span class="short"></span><span class="tiny"></span></div>
    </div>
    <div class="bb-row">
      <div class="bb-thumb alt"></div>
      <div class="bb-lines"><span></span><span class="short"></span></div>
    </div>
    <div class="bb-stack">
      <div class="bb-pill"></div>
      <div class="bb-pill"></div>
      <div class="bb-pill"></div>
    </div>
  </div>
</div>`;
}

export function readableText(hex: string): string {
  const value = hex.replace("#", "").trim();
  if (value.length !== 6) return "#0a0a0c";
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#0a0a0c";
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0a0a0c" : "#ffffff";
}

/* -------------------------------------------------------------------------- */
/* Generated site stylesheet                                                  */
/* -------------------------------------------------------------------------- */

export const GENERATED_SITE_CSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--bg); }
body { overflow-x: hidden; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

.lp { background: var(--bg); color: var(--fg); line-height: 1.6; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; min-height: 100vh; width: 100%; position: relative; overflow: hidden; }
.lp .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
.lp .section { padding: clamp(56px, 8vw, 104px) 0; position: relative; }
.lp .section + .section { border-top: 1px solid var(--border); }
.lp .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); }
.lp .eyebrow::before { content: ""; width: 18px; height: 1px; background: currentColor; }
.lp h1, .lp h2, .lp h3 { margin: 0; font-weight: 700; letter-spacing: -0.025em; }
.lp h2 { font-size: clamp(28px, 4vw, 44px); line-height: 1.1; }
.lp h3 { font-size: 18px; line-height: 1.3; }
.lp p { margin: 0; color: var(--muted); }
.lp .lead { font-size: clamp(16px, 1.4vw, 19px); color: var(--muted); max-width: 56ch; }

.lp .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 50px; padding: 0 26px; border-radius: 12px; font-weight: 600; font-size: 15px; border: 1px solid transparent; text-decoration: none; transition: transform .15s ease, filter .15s ease; }
.lp .btn:hover { transform: translateY(-1px); }
.lp .btn-primary { background: var(--primary); color: var(--primary-fg); box-shadow: 0 12px 30px -12px var(--tint-strong); }
.lp .btn-secondary { background: transparent; border-color: var(--border-strong); color: var(--fg); }
.lp .btn-ghost { background: var(--surface-2); color: var(--fg); border-color: var(--border); }

/* Header */
.lp header.site { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 24px; background: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
.lp .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.02em; font-size: 17px; }
.lp .logo { height: 34px; width: auto; border-radius: 9px; display: block; }
.lp .nav { display: none; gap: 22px; color: var(--muted); font-size: 14px; }
.lp .nav a { color: inherit; text-decoration: none; }
.lp .nav a:hover { color: var(--fg); }
.lp .header-cta { display: inline-flex; }
.lp .header-cta .btn { height: 40px; padding: 0 18px; font-size: 14px; }
@media (min-width: 860px) { .lp .nav { display: flex; } }

/* Hero */
.lp .hero { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; padding: clamp(56px, 8vw, 110px) 24px; position: relative; }
.lp .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 50% at 80% 0%, var(--tint), transparent 70%); pointer-events: none; }
.lp .hero-copy { position: relative; }
.lp .hero h1 { font-size: clamp(40px, 6.4vw, 76px); line-height: 1.02; letter-spacing: -0.035em; margin: 18px 0 0; }
.lp .hero .sub { margin-top: 22px; }
.lp .cta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }
.lp .trust { display: flex; flex-wrap: wrap; gap: 22px; margin-top: 38px; }
.lp .trust-item { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--muted); }
.lp .trust-item::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--accent); }
@media (min-width: 920px) { .lp .hero { grid-template-columns: 1.05fr 0.95fr; gap: 56px; } }

/* Hero art */
.lp .hero-art { position: relative; aspect-ratio: 1 / 1; width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--border); background: linear-gradient(160deg, var(--surface), var(--surface-2)); overflow: hidden; box-shadow: var(--shadow); }
.lp .art-glow { position: absolute; inset: -20%; background: radial-gradient(40% 40% at 28% 30%, var(--tint-strong), transparent 60%), radial-gradient(42% 42% at 78% 72%, var(--accent-tint), transparent 60%); filter: blur(8px); }
.lp .art-grid { position: absolute; inset: 0; background-image: radial-gradient(var(--border-strong) 1px, transparent 1px); background-size: 22px 22px; opacity: 0.5; -webkit-mask-image: radial-gradient(circle at 60% 40%, #000, transparent 78%); mask-image: radial-gradient(circle at 60% 40%, #000, transparent 78%); }
.lp .art-card { position: absolute; border-radius: 14px; background: color-mix(in srgb, var(--bg) 78%, transparent); border: 1px solid var(--border-strong); box-shadow: 0 18px 40px -18px rgba(0,0,0,0.5); backdrop-filter: blur(6px); padding: 16px; display: flex; flex-direction: column; gap: 9px; }
.lp .art-card--a { left: 8%; top: 16%; width: 46%; }
.lp .art-card--b { right: 8%; bottom: 14%; width: 44%; }
.lp .art-dot { width: 26px; height: 26px; border-radius: 8px; background: var(--primary); box-shadow: 0 8px 18px -6px var(--tint-strong); }
.lp .art-line { height: 9px; border-radius: 999px; background: var(--border-strong); }
.lp .art-line.short { width: 62%; }
.lp .art-line.tiny { width: 40%; }
.lp .art-bar { height: 30px; border-radius: 9px; background: linear-gradient(120deg, var(--primary), var(--accent)); opacity: 0.85; }
.lp .art-orb { position: absolute; right: 14%; top: 18%; width: 26%; aspect-ratio: 1; border-radius: 999px; background: radial-gradient(circle at 30% 30%, var(--primary), var(--accent)); filter: blur(2px); opacity: 0.9; }
.lp .art-ring { position: absolute; left: 30%; bottom: 22%; width: 34%; aspect-ratio: 1; border-radius: 999px; border: 2px solid var(--border-strong); }

/* Hero art shared primitives */
.lp .art-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.lp .art-chip { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: var(--accent); background: var(--accent-tint); border: 1px solid var(--border); padding: 4px 9px; border-radius: 999px; }
.lp .art-status { font-size: 11px; color: var(--muted); }
.lp .art-foot { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.lp .art-icon { width: 22px; height: 22px; color: var(--accent); flex: none; }
.lp .art-checklist { display: flex; flex-direction: column; gap: 9px; }
.lp .art-row { display: flex; align-items: center; gap: 10px; }
.lp .art-box { width: 15px; height: 15px; border-radius: 5px; border: 1.5px solid var(--border-strong); flex: none; }
.lp .art-box.on { background: var(--primary); border-color: var(--primary); }
.lp .art-stat { display: flex; flex-direction: column; gap: 7px; flex: 1; padding: 12px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); }
.lp .art-stat b { height: 18px; border-radius: 6px; background: var(--primary); opacity: 0.85; }
.lp .art-stat i { height: 8px; border-radius: 999px; background: var(--border-strong); }
.lp .art-stats { display: flex; gap: 10px; }
.lp .art-spark { width: 100%; height: 46px; margin-top: 4px; }
.lp .art-gauge { width: 84px; height: 84px; border-radius: 999px; background: conic-gradient(var(--primary) 0 68%, var(--secondary) 68% 100%); -webkit-mask: radial-gradient(circle 26px at center, transparent 98%, #000 100%); mask: radial-gradient(circle 26px at center, transparent 98%, #000 100%); position: relative; }
.lp .art-notes { display: flex; flex-direction: column; gap: 9px; }
.lp .art-node { width: 14px; height: 14px; border-radius: 999px; background: var(--accent); flex: none; box-shadow: 0 0 0 4px var(--accent-tint); }

/* Enhanced deterministic graphics when "Generate images" is enabled */
.lp .hero-art.art-enhanced::after { content: ""; position: absolute; left: 16%; top: 18%; width: 22%; aspect-ratio: 1; border-radius: 999px; background: radial-gradient(circle at 32% 30%, var(--accent), transparent 70%); filter: blur(5px); opacity: 0.55; }
.lp .browser.art-enhanced { box-shadow: 0 24px 70px -18px var(--tint-strong), var(--shadow); }

/* Default hero art card placement */
.lp .art-main { left: 12%; top: 14%; right: 12%; width: auto; }
.lp .art-float { right: 8%; bottom: 12%; width: 40%; }

/* Section heads */
.lp .section-head { max-width: 720px; margin-bottom: clamp(28px, 4vw, 48px); }
.lp .section-head.center { margin-left: auto; margin-right: auto; text-align: center; }
.lp .section-head .eyebrow { margin-bottom: 14px; }

/* Problem / Solution split */
.lp .split { display: grid; grid-template-columns: 1fr; gap: 20px; }
.lp .panel { position: relative; border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--surface); padding: clamp(26px, 3vw, 38px); overflow: hidden; }
.lp .panel::before { content: ""; position: absolute; inset: 0; background: radial-gradient(80% 60% at 100% 0%, var(--tint), transparent 60%); opacity: 0.5; }
.lp .panel.alt { background: linear-gradient(160deg, var(--surface), var(--surface-2)); border-color: var(--border-strong); }
.lp .panel .tag { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }
.lp .panel h3 { font-size: clamp(20px, 2.4vw, 28px); margin: 12px 0 14px; }
.lp .panel p { font-size: 16px; }
@media (min-width: 820px) { .lp .split { grid-template-columns: 1fr 1fr; gap: 24px; } }

/* Benefits grid */
.lp .benefits { display: grid; grid-template-columns: 1fr; gap: 16px; }
.lp .benefit { display: flex; gap: 14px; align-items: flex-start; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius); padding: 20px; }
.lp .benefit .mark { flex: none; width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: var(--tint); color: var(--primary); border: 1px solid var(--border-strong); font-weight: 700; font-size: 14px; }
.lp .benefit p { color: var(--fg); font-size: 15px; }
@media (min-width: 640px) { .lp .benefits { grid-template-columns: 1fr 1fr; } }
@media (min-width: 980px) { .lp .benefits { grid-template-columns: repeat(4, 1fr); } }

/* Features bento */
.lp .bento { display: grid; grid-template-columns: 1fr; gap: 18px; }
.lp .feature { position: relative; display: flex; flex-direction: column; gap: 12px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius-lg); padding: clamp(22px, 2.6vw, 30px); overflow: hidden; }
.lp .feature::after { content: ""; position: absolute; right: -40px; top: -40px; width: 160px; height: 160px; border-radius: 999px; background: radial-gradient(circle, var(--accent-tint), transparent 70%); }
.lp .feature .glyph { width: 30px; height: 30px; color: var(--accent); }
.lp .feature h3 { font-size: clamp(17px, 1.8vw, 21px); }
.lp .feature p { font-size: 15px; position: relative; }
.lp .feature .mini { margin-top: auto; display: flex; gap: 8px; flex-wrap: wrap; }
.lp .feature .chip { font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 4px 10px; }
@media (min-width: 820px) {
  .lp .bento { grid-template-columns: repeat(6, 1fr); }
  .lp .feature { grid-column: span 3; }
  .lp .feature:nth-child(4n+1) { grid-column: span 4; }
  .lp .feature:nth-child(4n) { grid-column: span 2; }
}

/* Showcase */
.lp .showcase { display: grid; grid-template-columns: 1fr; gap: 20px; }
.lp .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.lp .gallery img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); display: block; }
.lp .photo-panel { position: relative; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; aspect-ratio: 4 / 3; }
.lp .photo-panel img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (min-width: 820px) { .lp .showcase { grid-template-columns: 1.2fr 1fr; align-items: stretch; } }

/* Browser mockup graphic */
.lp .browser { border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--surface); overflow: hidden; box-shadow: var(--shadow); height: 100%; display: flex; flex-direction: column; }
.lp .browser-bar { display: flex; gap: 7px; padding: 13px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.lp .browser-bar span { width: 11px; height: 11px; border-radius: 999px; background: var(--border-strong); }
.lp .browser-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; flex: 1; }
.lp .bb-row { display: flex; gap: 14px; align-items: center; }
.lp .bb-thumb { width: 54px; height: 54px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--accent)); flex: none; opacity: 0.9; }
.lp .bb-thumb.alt { background: linear-gradient(135deg, var(--accent), var(--secondary)); }
.lp .bb-lines { display: flex; flex-direction: column; gap: 9px; flex: 1; }
.lp .bb-lines span { height: 9px; border-radius: 999px; background: var(--border-strong); }
.lp .bb-lines span.short { width: 65%; }
.lp .bb-lines span.tiny { width: 40%; }
.lp .bb-stack { display: flex; gap: 10px; margin-top: auto; }
.lp .bb-pill { height: 30px; flex: 1; border-radius: 9px; background: var(--tint); border: 1px solid var(--border); }

/* FAQ */
.lp .faqs { display: flex; flex-direction: column; border-top: 1px solid var(--border); }
.lp .faq { display: flex; gap: 18px; align-items: flex-start; padding: 22px 4px; border-bottom: 1px solid var(--border); }
.lp .faq .q-mark { flex: none; width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; border: 1px solid var(--border-strong); color: var(--accent); font-weight: 700; }
.lp .faq h3 { font-size: 17px; margin-bottom: 6px; }
.lp .faq p { font-size: 15px; }

/* CTA band */
.lp .cta-band { position: relative; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-strong); background: linear-gradient(135deg, var(--surface), var(--surface-2)); padding: clamp(40px, 6vw, 72px); text-align: center; }
.lp .cta-band::before { content: ""; position: absolute; inset: 0; background: radial-gradient(50% 80% at 50% 0%, var(--tint-strong), transparent 70%); }
.lp .cta-band > * { position: relative; }
.lp .cta-band h2 { font-size: clamp(28px, 4.4vw, 48px); }
.lp .cta-band .lead { margin: 16px auto 28px; }
.lp .cta-band .cta { justify-content: center; display: flex; flex-wrap: wrap; gap: 14px; }

/* Footer */
.lp footer.site { padding: 40px 24px; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; color: var(--muted); font-size: 14px; }
.lp footer.site .brand { font-size: 15px; }
.lp .muted-text { color: var(--muted); }
`;
