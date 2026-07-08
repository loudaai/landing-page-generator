import type {
  AestheticChoice,
  BackgroundStyle,
  DecorationChoice,
  DensityChoice,
  FontChoice,
  GraphicType,
  LandingPageContent,
  LandingPageDesignInput,
  RadiusChoice,
  VisualStyle,
} from "./types";

type Vars = Record<string, string>;

const FONT_STACKS: Record<FontChoice, { display: string; body: string }> = {
  modern: {
    display:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  grotesk: {
    display:
      '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif',
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  editorial: {
    display: 'Georgia, "Times New Roman", "Iowan Old Style", serif',
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  rounded: {
    display:
      'ui-rounded, "SF Pro Rounded", "Segoe UI", system-ui, -apple-system, sans-serif',
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  tech: {
    display:
      'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
};

const RADIUS_SCALE: Record<
  RadiusChoice,
  { sm: string; r: string; rl: string; xl: string }
> = {
  sharp: { sm: "6px", r: "8px", rl: "14px", xl: "18px" },
  soft: { sm: "10px", r: "16px", rl: "26px", xl: "32px" },
  rounded: { sm: "14px", r: "22px", rl: "34px", xl: "42px" },
};

const DENSITY_SCALE: Record<DensityChoice, { sec: string; hero: string }> = {
  compact: { sec: "clamp(48px, 7vw, 84px)", hero: "clamp(56px, 8vw, 96px)" },
  balanced: { sec: "clamp(76px, 9vw, 128px)", hero: "clamp(80px, 10vw, 156px)" },
  airy: { sec: "clamp(92px, 11vw, 160px)", hero: "clamp(96px, 12vw, 184px)" },
};

const DECOR_SCALE: Record<
  DecorationChoice,
  { glow: string; grid: string; panel: string; feat: string }
> = {
  minimal: { glow: "0.5", grid: "0", panel: "0.22", feat: "0" },
  balanced: { glow: "1", grid: "0.5", panel: "0.5", feat: "1" },
  rich: { glow: "1.15", grid: "0.85", panel: "0.7", feat: "1" },
};

/* Page background textures driven by the AI's backgroundStyle choice.
   Layers are intentionally low-opacity so the solid --bg still reads. */
const BG_IMAGE: Record<BackgroundStyle, string> = {
  minimal: "none",
  gradient:
    "radial-gradient(85% 60% at 50% -15%, var(--tint), transparent 58%)",
  soft:
    "radial-gradient(65% 50% at 12% 0%, var(--accent-tint), transparent 55%), radial-gradient(72% 58% at 100% 100%, var(--tint), transparent 62%)",
  editorial:
    "repeating-linear-gradient(180deg, transparent 0 39px, color-mix(in srgb, var(--border) 45%, transparent) 40px), repeating-linear-gradient(90deg, transparent 0 39px, color-mix(in srgb, var(--border) 45%, transparent) 40px)",
  industrial:
    "linear-gradient(color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)",
  premium:
    "radial-gradient(48% 40% at 82% -12%, var(--tint-strong), transparent 60%), radial-gradient(40% 42% at 0% 18%, var(--accent-tint), transparent 55%), radial-gradient(62% 50% at 50% 122%, var(--tint), transparent 62%)",
};

const BG_SIZE: Record<BackgroundStyle, string> = {
  minimal: "auto",
  gradient: "auto",
  soft: "auto",
  editorial: "40px 40px",
  industrial: "34px 34px",
  premium: "auto",
};

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

type BlueprintThemeTokens = {
  fontChoice?: FontChoice;
  radius?: RadiusChoice;
  density?: DensityChoice;
  decoration?: DecorationChoice;
  backgroundStyle?: BackgroundStyle;
};

export function themeVars(
  design: LandingPageDesignInput,
  theme: BlueprintThemeTokens = {}
): Vars {
  const p = resolvePalette(design);

  const font = FONT_STACKS[theme.fontChoice ?? "modern"];
  const radius = RADIUS_SCALE[theme.radius ?? "soft"];
  const density = DENSITY_SCALE[theme.density ?? "balanced"];
  const decor = DECOR_SCALE[theme.decoration ?? "balanced"];
  const bgImage = BG_IMAGE[theme.backgroundStyle ?? "minimal"];
  const bgSize = BG_SIZE[theme.backgroundStyle ?? "minimal"];

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
    "--radius-sm": radius.sm,
    "--radius": radius.r,
    "--radius-lg": radius.rl,
    "--radius-xl": radius.xl,
    "--border-w": "1px",
    "--border-w-strong": "1.5px",
    "--sp-1": "4px",
    "--sp-2": "8px",
    "--sp-3": "12px",
    "--sp-4": "16px",
    "--sp-5": "20px",
    "--sp-6": "26px",
    "--sp-8": "36px",
    "--sp-10": "44px",
    "--sp-12": "56px",
    "--sp-16": "80px",
    "--text-xs": "12px",
    "--text-sm": "13px",
    "--text-base": "14px",
    "--text-md": "15px",
    "--text-lg": "17px",
    "--text-xl": "19px",
    "--shadow-sm":
      design.siteTheme === "dark"
        ? "0 1px 2px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.28)"
        : "0 1px 2px rgba(15,15,25,0.08), 0 2px 8px rgba(15,15,25,0.06)",
    "--shadow-lg":
      design.siteTheme === "dark"
        ? "0 40px 90px -34px rgba(0,0,0,0.72)"
        : "0 40px 90px -38px rgba(15,15,25,0.32)",
    "--ease": "cubic-bezier(0.22, 0.61, 0.36, 1)",
    "--dur": "0.2s",
    "--shadow":
      design.siteTheme === "dark"
        ? "0 30px 70px -22px rgba(0,0,0,0.68)"
        : "0 30px 70px -26px rgba(15,15,25,0.28)",
    "--font-display": font.display,
    "--font-body": font.body,
    "--sec-pad": density.sec,
    "--hero-pad": density.hero,
    "--decor-glow": decor.glow,
    "--decor-grid": decor.grid,
    "--decor-panel": decor.panel,
    "--decor-feat": decor.feat,
    "--bg-image": bgImage,
    "--bg-size": bgSize,
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

function autoShowcaseHtml(design: LandingPageDesignInput): string {
  const accent = design.accentColor;
  const services = ["Diagnostics", "Brakes", "Maintenance", "Body & detail"];
  const cards = services
    .map(
      (s) => `<div class="sc-card"><span class="sc-ic" style="color:${accent}">✓</span><span>${s}</span></div>`
    )
    .join("");
  return `<div class="auto-showcase" aria-hidden="true">
  <div class="sc-head">
    <span class="sc-chip">Service categories</span>
    <span class="sc-status">Walk-ins welcome</span>
  </div>
  <div class="sc-grid">${cards}</div>
  <div class="sc-book">
    <div class="sc-line"></div>
    <div class="sc-line short"></div>
    <span class="sc-cta" style="background:${design.primaryColor};color:${readableText(
      design.primaryColor
    )}">Book a service</span>
  </div>
</div>`;
}

export function showcaseGraphicHtml(
  style: VisualStyle,
  design: LandingPageDesignInput
): string {
  if (style === "auto") {
    return autoShowcaseHtml(design);
  }
  if (style === "restaurant-cafe") {
    return `<div class="show-graphic show-rest" aria-hidden="true">
      <div class="show-row">
        <span class="dish lg"></span><span class="dish lg alt"></span><span class="dish lg"></span>
      </div>
      <div class="show-card">
        <span class="menu-row"><span class="menu-dot"></span><span class="art-line"></span><span class="menu-price"></span></span>
        <span class="menu-row"><span class="menu-dot"></span><span class="art-line short"></span><span class="menu-price"></span></span>
      </div>
    </div>`;
  }
  if (style === "agency") {
    const tiles = [0, 1, 2, 3, 4, 5]
      .map(
        (i) =>
          `<span class="ag-tile" style="background:${
            i % 2 ? "var(--accent)" : "var(--primary)"
          };opacity:${0.45 + (i % 3) * 0.18}"></span>`
      )
      .join("");
    return `<div class="show-graphic show-agency" aria-hidden="true"><div class="ag-grid big">${tiles}</div></div>`;
  }
  if (style === "service") {
    return autoShowcaseHtml(design);
  }
  if (style === "personal-brand") {
    const tiles = [0, 1, 2, 3]
      .map(
        (i) =>
          `<span class="pf-tile" style="background:${
            i % 2 ? "var(--accent)" : "var(--primary)"
          };opacity:${0.5 + (i % 2) * 0.25}"></span>`
      )
      .join("");
    return `<div class="show-graphic show-personal" aria-hidden="true"><div class="pf-grid">${tiles}</div></div>`;
  }
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
body { overflow-x: hidden; font-family: var(--font-body); }

.lp { background-color: var(--bg); background-image: var(--bg-image, none); background-size: var(--bg-size, auto); background-attachment: fixed; color: var(--fg); line-height: 1.65; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; min-height: 100vh; width: 100%; position: relative; overflow: hidden; font-family: var(--font-body); }
.lp .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px); }
.lp .section { padding: var(--sec-pad) 0; position: relative; }
.lp > section:nth-of-type(even) { background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 32%, transparent), transparent 88%); }
.lp .section + .section { border-top: var(--border-w) solid transparent; border-image: linear-gradient(90deg, transparent, var(--border-strong), transparent) 1; }
.lp .eyebrow { display: inline-flex; align-items: center; gap: var(--sp-2); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
.lp .eyebrow::before { content: ""; width: 22px; height: 1px; background: currentColor; }
.lp h1, .lp h2, .lp h3 { margin: 0; font-weight: 700; letter-spacing: -0.03em; font-family: var(--font-display); }
.lp h2 { font-size: clamp(30px, 4.4vw, 50px); line-height: 1.08; letter-spacing: -0.03em; }
.lp h3 { font-size: var(--text-lg); line-height: 1.3; }
.lp p { margin: 0; color: var(--muted); }
.lp .lead { font-size: clamp(16px, 1.45vw, 20px); line-height: 1.6; color: var(--muted); max-width: 56ch; }

.lp .btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-2); height: 52px; padding: 0 var(--sp-8); border-radius: var(--radius); font-weight: 600; font-size: var(--text-md); border: 1px solid transparent; text-decoration: none; transition: transform var(--dur) var(--ease), filter var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.lp .btn:hover { transform: translateY(-2px); }
.lp .btn-primary { background: var(--primary); color: var(--primary-fg); box-shadow: 0 18px 44px -16px var(--tint-strong); }
.lp .btn-secondary { background: transparent; border-color: var(--border-strong); color: var(--fg); }
.lp .btn-secondary:hover { background: var(--surface-2); }
.lp .btn-ghost { background: var(--surface-2); color: var(--fg); border-color: var(--border); }

/* Header */
.lp header.site { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4); padding: var(--sp-4) clamp(20px, 5vw, 40px); background: color-mix(in srgb, var(--bg) 72%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: var(--border-w) solid var(--border); }
.lp .brand { display: inline-flex; align-items: center; gap: var(--sp-2); font-weight: 700; letter-spacing: -0.02em; font-size: var(--text-lg); color: var(--fg); text-decoration: none; }
.lp .logo { height: 34px; width: auto; border-radius: var(--radius-sm); display: block; }
.lp .nav { display: none; gap: var(--sp-6); color: var(--muted); font-size: var(--text-base); }
.lp .nav a { color: inherit; text-decoration: none; transition: color var(--dur) var(--ease); }
.lp .nav a:hover { color: var(--fg); }
.lp .header-cta { display: inline-flex; }
.lp .header-cta .btn { height: 42px; padding: 0 var(--sp-5); font-size: var(--text-base); }
@media (min-width: 860px) { .lp .nav { display: flex; } }

/* Hero */
.lp .hero { display: grid; grid-template-columns: 1fr; gap: var(--sp-12); align-items: center; padding: var(--hero-pad) clamp(20px, 5vw, 40px); position: relative; }
.lp .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(58% 50% at 82% -6%, var(--tint), transparent 68%), radial-gradient(46% 46% at 6% 8%, var(--accent-tint), transparent 60%); pointer-events: none; }
.lp .hero-copy { position: relative; }
.lp .hero h1 { font-size: clamp(44px, 6.6vw, 82px); line-height: 1.02; letter-spacing: -0.035em; margin: var(--sp-5) 0 0; max-width: 16ch; }
.lp .hero .sub { margin-top: var(--sp-6); }
.lp .cta { display: flex; flex-wrap: wrap; gap: var(--sp-4); margin-top: var(--sp-8); }
.lp .trust { display: flex; flex-wrap: wrap; gap: var(--sp-6); margin-top: var(--sp-10); }
.lp .trust-item { display: flex; align-items: center; gap: var(--sp-2); font-size: var(--text-base); color: var(--muted); }
.lp .trust-item::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--accent); }
@media (min-width: 920px) { .lp .hero { grid-template-columns: 1.05fr 0.95fr; gap: var(--sp-16); } }

/* Hero art */
.lp .hero-art { position: relative; aspect-ratio: 1 / 1; width: 100%; border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); background: linear-gradient(160deg, var(--surface), var(--surface-2)); overflow: hidden; box-shadow: var(--shadow); }
.lp .art-glow { position: absolute; inset: -20%; background: radial-gradient(40% 40% at 28% 30%, var(--tint-strong), transparent 60%), radial-gradient(42% 42% at 78% 72%, var(--accent-tint), transparent 60%); filter: blur(8px); opacity: var(--decor-glow); }
.lp .art-grid { position: absolute; inset: 0; background-image: radial-gradient(var(--border-strong) 1px, transparent 1px); background-size: 22px 22px; opacity: var(--decor-grid); -webkit-mask-image: radial-gradient(circle at 60% 40%, #000, transparent 78%); mask-image: radial-gradient(circle at 60% 40%, #000, transparent 78%); }
.lp .art-card { position: absolute; border-radius: var(--radius); background: color-mix(in srgb, var(--bg) 78%, transparent); border: var(--border-w) solid var(--border-strong); box-shadow: var(--shadow); backdrop-filter: blur(6px); padding: var(--sp-4); display: flex; flex-direction: column; gap: var(--sp-2); }
.lp .art-card--a { left: 8%; top: 16%; width: 46%; }
.lp .art-card--b { right: 8%; bottom: 14%; width: 44%; }
.lp .art-dot { width: 26px; height: 26px; border-radius: var(--radius-sm); background: var(--primary); box-shadow: 0 8px 18px -6px var(--tint-strong); }
.lp .art-line { height: 9px; border-radius: 999px; background: var(--border-strong); }
.lp .art-line.short { width: 62%; }
.lp .art-line.tiny { width: 40%; }
.lp .art-bar { height: 30px; border-radius: var(--radius-sm); background: linear-gradient(120deg, var(--primary), var(--accent)); opacity: 0.85; }
.lp .art-orb { position: absolute; right: 14%; top: 18%; width: 26%; aspect-ratio: 1; border-radius: 999px; background: radial-gradient(circle at 30% 30%, var(--primary), var(--accent)); filter: blur(2px); opacity: 0.9; }
.lp .art-ring { position: absolute; left: 30%; bottom: 22%; width: 34%; aspect-ratio: 1; border-radius: 999px; border: 2px solid var(--border-strong); }

/* Hero art shared primitives */
.lp .art-head { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2); }
.lp .art-chip { font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.04em; color: var(--accent); background: var(--accent-tint); border: var(--border-w) solid var(--border); padding: var(--sp-1) var(--sp-2); border-radius: 999px; }
.lp .art-status { font-size: var(--text-xs); color: var(--muted); }
.lp .art-foot { display: flex; align-items: center; gap: var(--sp-2); margin-top: 4px; }
.lp .art-icon { width: 22px; height: 22px; color: var(--accent); flex: none; }
.lp .art-checklist { display: flex; flex-direction: column; gap: var(--sp-2); }
.lp .art-row { display: flex; align-items: center; gap: var(--sp-2); }
.lp .art-box { width: 15px; height: 15px; border-radius: var(--radius-sm); border: var(--border-w-strong) solid var(--border-strong); flex: none; }
.lp .art-box.on { background: var(--primary); border-color: var(--primary); }
.lp .art-stat { display: flex; flex-direction: column; gap: var(--sp-2); flex: 1; padding: var(--sp-3); border-radius: var(--radius); background: var(--surface); border: var(--border-w) solid var(--border); }
.lp .art-stat b { height: 18px; border-radius: var(--radius-sm); background: var(--primary); opacity: 0.85; }
.lp .art-stat i { height: 8px; border-radius: 999px; background: var(--border-strong); }
.lp .art-stats { display: flex; gap: var(--sp-2); }
.lp .art-spark { width: 100%; height: 46px; margin-top: 4px; }
.lp .art-gauge { width: 84px; height: 84px; border-radius: 999px; background: conic-gradient(var(--primary) 0 68%, var(--secondary) 68% 100%); -webkit-mask: radial-gradient(circle 26px at center, transparent 98%, #000 100%); mask: radial-gradient(circle 26px at center, transparent 98%, #000 100%); position: relative; }
.lp .art-notes { display: flex; flex-direction: column; gap: var(--sp-2); }
.lp .art-node { width: 14px; height: 14px; border-radius: 999px; background: var(--accent); flex: none; box-shadow: 0 0 0 4px var(--accent-tint); }

/* Enhanced deterministic graphics when "Generate images" is enabled */
.lp .hero-art.art-enhanced::after { content: ""; position: absolute; left: 16%; top: 18%; width: 22%; aspect-ratio: 1; border-radius: 999px; background: radial-gradient(circle at 32% 30%, var(--accent), transparent 70%); filter: blur(5px); opacity: 0.55; }
.lp .browser.art-enhanced { box-shadow: 0 24px 70px -18px var(--tint-strong), var(--shadow); }

/* Default hero art card placement */
.lp .art-main { left: 12%; top: 14%; right: 12%; width: auto; }
.lp .art-float { right: 8%; bottom: 12%; width: 40%; }

/* Industry-specific hero art */
.lp .menu-row { display: flex; align-items: center; gap: var(--sp-2); margin-top: var(--sp-2); }
.lp .menu-dot { width: 12px; height: 12px; border-radius: 999px; flex: none; }
.lp .menu-price { width: 24px; height: 12px; border-radius: 999px; background: var(--border-strong); margin-left: auto; }
.lp .dish { width: 46px; height: 46px; border-radius: 999px; display: block; }
.lp .dish.lg { width: 72px; height: 72px; }
.lp .dish.alt { opacity: 0.85; filter: hue-rotate(20deg); }
.lp .ag-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-2); margin-top: var(--sp-3); }
.lp .ag-tile { aspect-ratio: 1; border-radius: var(--radius-sm); }
.lp .ag-grid.big { grid-template-columns: repeat(3, 1fr); gap: var(--sp-3); }
.lp .ag-grid.big .ag-tile { border-radius: var(--radius); }
.lp .avatar { width: 38px; height: 38px; border-radius: 999px; background: linear-gradient(135deg, var(--primary), var(--accent)); flex: none; }
.lp .pf-row { display: flex; align-items: center; gap: var(--sp-3); margin-top: var(--sp-2); }
.lp .pf-tile { aspect-ratio: 4 / 3; border-radius: var(--radius); display: block; }
.lp .pf-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3); }
.lp .show-graphic { border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); background: linear-gradient(160deg, var(--surface), var(--surface-2)); overflow: hidden; box-shadow: var(--shadow); height: 100%; display: flex; flex-direction: column; gap: var(--sp-4); padding: clamp(22px, 3vw, 34px); }
.lp .show-row { display: flex; gap: var(--sp-3); justify-content: center; }
.lp .show-card { display: flex; flex-direction: column; gap: var(--sp-2); border-top: var(--border-w) solid var(--border); padding-top: var(--sp-4); }
.lp .show-agency .ag-grid.big { flex: 1; }
.lp .show-personal .pf-grid { flex: 1; }

/* Ambient float for hero art */
@keyframes p0r-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.lp .art-orb, .lp .art-ring { animation: p0r-float 9s ease-in-out infinite; }
.lp .art-float { animation: p0r-float 7s ease-in-out infinite; }

/* Scroll-reveal (driven by inline script; safe without JS) */
.lp .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
.lp .reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .lp .reveal { opacity: 1; transform: none; transition: none; }
}

/* Card hover lift + accent glow */
.lp .benefit, .lp .feature, .lp .service-card, .lp .panel, .lp .step { transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.lp .benefit:hover, .lp .feature:hover, .lp .service-card:hover, .lp .panel:hover, .lp .step:hover { transform: translateY(-4px); border-color: var(--border-strong); box-shadow: var(--shadow); }

/* Button sheen on hover */
.lp .btn { position: relative; overflow: hidden; }
.lp .btn::after { content: ""; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, color-mix(in srgb, #fff 24%, transparent) 50%, transparent 70%); transform: translateX(-130%); pointer-events: none; }
.lp .btn:hover::after { transform: translateX(130%); transition: transform .6s var(--ease); }

/* Section heads */
.lp .section-head { max-width: 720px; margin-bottom: clamp(36px, 5vw, 60px); }
.lp .section-head.center { margin-left: auto; margin-right: auto; text-align: center; }
.lp .section-head .eyebrow { margin-bottom: var(--sp-4); }

/* Problem / Solution split */
.lp .split { display: grid; grid-template-columns: 1fr; gap: var(--sp-5); }
.lp .panel { position: relative; border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); background: var(--surface); padding: clamp(28px, 3.4vw, 44px); overflow: hidden; box-shadow: var(--shadow-sm); }
.lp .panel::before { content: ""; position: absolute; inset: 0; background: radial-gradient(80% 60% at 100% 0%, var(--tint), transparent 60%); opacity: var(--decor-panel); }
.lp .panel.alt { background: linear-gradient(160deg, var(--surface), var(--surface-2)); border-color: var(--border-strong); }
.lp .panel .tag { font-size: var(--text-sm); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }
.lp .panel h3 { font-size: clamp(20px, 2.4vw, 28px); margin: var(--sp-3) 0 var(--sp-4); }
.lp .panel p { font-size: 16px; }
@media (min-width: 820px) { .lp .split { grid-template-columns: 1fr 1fr; gap: var(--sp-6); } }

/* Benefits grid */
.lp .benefits { display: grid; grid-template-columns: 1fr; gap: var(--sp-4); }
.lp .benefit { display: flex; gap: var(--sp-4); align-items: flex-start; border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius-lg); padding: var(--sp-6); box-shadow: var(--shadow-sm); }
.lp .benefit .mark { flex: none; width: 32px; height: 32px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--tint); color: var(--primary); border: var(--border-w) solid var(--border-strong); font-weight: 700; font-size: var(--text-base); }
.lp .benefit p { color: var(--fg); font-size: var(--text-md); }
@media (min-width: 640px) { .lp .benefits { grid-template-columns: 1fr 1fr; } }
@media (min-width: 980px) { .lp .benefits { grid-template-columns: repeat(4, 1fr); } }

/* Features bento */
.lp .bento { display: grid; grid-template-columns: 1fr; gap: var(--sp-5); }
.lp .feature { position: relative; display: flex; flex-direction: column; gap: var(--sp-3); border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius-lg); padding: clamp(24px, 3vw, 34px); overflow: hidden; box-shadow: var(--shadow-sm); }
.lp .feature::after { content: ""; position: absolute; right: -40px; top: -40px; width: 180px; height: 180px; border-radius: 999px; background: radial-gradient(circle, var(--accent-tint), transparent 70%); opacity: var(--decor-feat); }
.lp .feature .glyph { width: 32px; height: 32px; color: var(--accent); }
.lp .feature h3 { font-size: clamp(18px, 1.9vw, 22px); }
.lp .feature p { font-size: var(--text-md); position: relative; }
.lp .feature .mini { margin-top: auto; display: flex; gap: var(--sp-2); flex-wrap: wrap; }
.lp .feature .chip { font-size: var(--text-xs); color: var(--muted); border: var(--border-w) solid var(--border); border-radius: 999px; padding: var(--sp-1) var(--sp-3); }
@media (min-width: 820px) {
  .lp .bento { grid-template-columns: repeat(6, 1fr); }
  .lp .feature { grid-column: span 3; }
  .lp .feature:nth-child(4n+1) { grid-column: span 4; }
  .lp .feature:nth-child(4n) { grid-column: span 2; }
}

/* Showcase */
.lp .showcase { display: grid; grid-template-columns: 1fr; gap: var(--sp-5); }
.lp .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--sp-4); }
.lp .gallery img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius); border: var(--border-w) solid var(--border); display: block; }
.lp .photo-panel { position: relative; border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); overflow: hidden; aspect-ratio: 4 / 3; box-shadow: var(--shadow); }
.lp .photo-panel img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (min-width: 820px) { .lp .showcase { grid-template-columns: 1.2fr 1fr; align-items: stretch; } }

/* Browser mockup graphic */
.lp .browser { border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); background: var(--surface); overflow: hidden; box-shadow: var(--shadow); height: 100%; display: flex; flex-direction: column; }
.lp .browser-bar { display: flex; gap: var(--sp-2); padding: var(--sp-3) var(--sp-4); border-bottom: var(--border-w) solid var(--border); background: var(--surface-2); }
.lp .browser-bar span { width: 11px; height: 11px; border-radius: 999px; background: var(--border-strong); }
.lp .browser-body { padding: var(--sp-5); display: flex; flex-direction: column; gap: var(--sp-4); flex: 1; }
.lp .bb-row { display: flex; gap: var(--sp-4); align-items: center; }
.lp .bb-thumb { width: 54px; height: 54px; border-radius: var(--radius); background: linear-gradient(135deg, var(--primary), var(--accent)); flex: none; opacity: 0.9; }
.lp .bb-thumb.alt { background: linear-gradient(135deg, var(--accent), var(--secondary)); }
.lp .bb-lines { display: flex; flex-direction: column; gap: var(--sp-2); flex: 1; }
.lp .bb-lines span { height: 9px; border-radius: 999px; background: var(--border-strong); }
.lp .bb-lines span.short { width: 65%; }
.lp .bb-lines span.tiny { width: 40%; }
.lp .bb-stack { display: flex; gap: var(--sp-2); margin-top: auto; }
.lp .bb-pill { height: 30px; flex: 1; border-radius: var(--radius-sm); background: var(--tint); border: var(--border-w) solid var(--border); }

/* Auto-specific showcase */
.lp .auto-showcase { border-radius: var(--radius-lg); border: var(--border-w) solid var(--border); background: linear-gradient(160deg, var(--surface), var(--surface-2)); overflow: hidden; box-shadow: var(--shadow); height: 100%; display: flex; flex-direction: column; gap: var(--sp-5); padding: clamp(22px, 3vw, 34px); }
.lp .sc-head { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2); }
.lp .sc-chip { font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.04em; color: var(--accent); background: var(--accent-tint); border: var(--border-w) solid var(--border); padding: var(--sp-1) var(--sp-2); border-radius: 999px; }
.lp .sc-status { font-size: var(--text-xs); color: var(--muted); }
.lp .sc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3); }
.lp .sc-card { display: flex; align-items: center; gap: var(--sp-2); border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius); padding: 14px; font-size: var(--text-base); color: var(--fg); }
.lp .sc-ic { font-weight: 700; }
.lp .sc-book { margin-top: auto; display: flex; flex-direction: column; gap: var(--sp-2); }
.lp .sc-line { height: 9px; border-radius: 999px; background: var(--border-strong); }
.lp .sc-line.short { width: 60%; }
.lp .sc-cta { align-self: flex-start; margin-top: var(--sp-2); height: 42px; display: inline-flex; align-items: center; padding: 0 var(--sp-5); border-radius: var(--radius-sm); font-weight: 600; font-size: var(--text-base); }

/* FAQ */
.lp .faqs { display: flex; flex-direction: column; border-top: var(--border-w) solid var(--border); }
.lp .faq { display: flex; gap: var(--sp-5); align-items: flex-start; padding: var(--sp-6) var(--sp-1); border-bottom: var(--border-w) solid var(--border); }
.lp .faq .q-mark { flex: none; width: 32px; height: 32px; border-radius: var(--radius-sm); display: grid; place-items: center; border: var(--border-w) solid var(--border-strong); color: var(--accent); font-weight: 700; }
.lp .faq h3 { font-size: var(--text-lg); margin-bottom: var(--sp-2); }
.lp .faq p { font-size: var(--text-md); }

/* CTA band — brand-tinted, glowing */
.lp .cta-band { position: relative; border-radius: var(--radius-lg); overflow: hidden; border: var(--border-w) solid color-mix(in srgb, var(--accent) 40%, var(--border-strong)); background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 16%, var(--surface)), color-mix(in srgb, var(--accent) 14%, var(--surface-2))); padding: clamp(48px, 7vw, 88px); text-align: center; box-shadow: var(--shadow-lg); }
.lp .cta-band::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 90% at 50% 0%, var(--tint-strong), transparent 70%); }
.lp .cta-band > * { position: relative; }
.lp .cta-band h2 { font-size: clamp(30px, 4.6vw, 52px); }
.lp .cta-band .lead { margin: var(--sp-4) auto var(--sp-8); }
.lp .cta-band .cta { justify-content: center; display: flex; flex-wrap: wrap; gap: var(--sp-4); }

/* Footer */
.lp footer.site { padding: clamp(40px, 5vw, 64px) clamp(20px, 5vw, 40px); border-top: var(--border-w) solid var(--border); display: flex; flex-wrap: wrap; gap: var(--sp-3); align-items: center; justify-content: space-between; color: var(--muted); font-size: var(--text-base); }
.lp footer.site .brand { font-size: var(--text-md); }
.lp .muted-text { color: var(--muted); }
`;

/* -------------------------------------------------------------------------- */
/* Blueprint-aware deterministic graphics                                    */
/* -------------------------------------------------------------------------- */

function autoInspectionGraphic(design: LandingPageDesignInput): string {
  const accent = design.accentColor;
  return `<div class="art-card art-main" style="left:10%;top:12%;right:10%;width:auto">
    <div class="art-head"><span class="art-chip">Vehicle inspection</span><span class="art-status">In progress</span></div>
    <div class="art-checklist">
      <span class="art-row"><span class="art-box on"></span><span class="art-line"></span></span>
      <span class="art-row"><span class="art-box on"></span><span class="art-line short"></span></span>
      <span class="art-row"><span class="art-box"></span><span class="art-line tiny"></span></span>
    </div>
    <div class="art-foot">${wrenchSvg(accent)}<span class="art-line short"></span></div>
  </div>`;
}

function autoBookingGraphic(design: LandingPageDesignInput): string {
  const accent = design.accentColor;
  return `<div class="art-card art-float" style="right:8%;bottom:12%;width:44%">
    <span class="art-dot"></span>
    <div class="art-line"></div>
    <div class="art-line short"></div>
    <span class="sc-cta" style="background:${design.primaryColor};color:${readableText(design.primaryColor)}">Book a service</span>
    <span class="art-line tiny"></span>
  </div>`;
}

function workflowGraphic(): string {
  const nodes = ["1", "2", "3"].map((n) => `<span class="wf-node">${n}</span>`).join('<span class="wf-line"></span>');
  return `<div class="art-card art-main" style="left:10%;top:14%;right:10%;width:auto">
    <div class="art-head"><span class="art-chip">Workflow</span><span class="art-status">Automated</span></div>
    <div class="wf-row">${nodes}</div>
    <div class="art-line short"></div>
  </div>`;
}

function studyGraphic(): string {
  return `<div class="art-card art-main" style="left:8%;top:12%;right:8%;width:auto">
    <div class="art-head"><span class="art-chip">Study set</span><span class="art-status">82%</span></div>
    <div class="art-notes">
      <span class="art-line"></span><span class="art-line"></span><span class="art-line short"></span><span class="art-line tiny"></span>
    </div>
    <div class="art-checklist">
      <span class="art-row"><span class="art-box on"></span><span class="art-line short"></span></span>
      <span class="art-row"><span class="art-box"></span><span class="art-line tiny"></span></span>
    </div>
  </div>`;
}

function localBizGraphic(design: LandingPageDesignInput): string {
  return `<div class="art-card art-main" style="left:8%;top:12%;right:8%;width:auto">
    <div class="art-head"><span class="art-chip">Visit us</span><span class="art-status">Local</span></div>
    <div class="art-notes">
      <span class="art-line"></span><span class="art-line short"></span>
    </div>
    <div class="art-line tiny"></div>
    <span class="sc-cta" style="background:${design.primaryColor};color:${readableText(design.primaryColor)}">Add your address</span>
  </div>`;
}

function portfolioGraphic(): string {
  return `<div class="art-card art-main" style="left:10%;top:14%;width:46%">
    <div class="art-line"></div><div class="art-line short"></div>
  </div>
  <div class="art-card art-float" style="right:10%;bottom:14%;width:40%">
    <div class="art-bar"></div><div class="art-line"></div>
  </div>`;
}

function restaurantGraphic(design: LandingPageDesignInput): string {
  const accent = design.accentColor;
  const rows = [0, 1, 2]
    .map(
      () =>
        `<span class="menu-row"><span class="menu-dot" style="background:${accent}"></span><span class="art-line"></span><span class="menu-price"></span></span>`
    )
    .join("");
  return `<div class="art-card art-main" style="left:9%;top:11%;right:9%;width:auto">
    <div class="art-head"><span class="art-chip">Today's menu</span><span class="art-status">Fresh daily</span></div>
    ${rows}
    <div class="art-line short"></div>
  </div>
  <div class="art-card art-float" style="right:8%;bottom:11%;width:36%">
    <span class="dish" style="background:radial-gradient(circle at 32% 30%, var(--primary), ${accent})"></span>
    <span class="art-line short"></span>
  </div>`;
}

function agencyGraphic(): string {
  const tiles = [0, 1, 2, 3, 4, 5]
    .map(
      (i) =>
        `<span class="ag-tile" style="background:${
          i % 2 ? "var(--accent)" : "var(--primary)"
        };opacity:${0.5 + (i % 3) * 0.18}"></span>`
    )
    .join("");
  return `<div class="art-card art-main" style="left:9%;top:11%;right:9%;width:auto">
    <div class="art-head"><span class="art-chip">Selected work</span><span class="art-status">2024</span></div>
    <div class="ag-grid">${tiles}</div>
    <div class="art-line short"></div>
  </div>
  <div class="art-card art-float" style="right:8%;bottom:11%;width:36%">
    <div class="art-bar"></div><span class="art-line"></span>
  </div>`;
}

function serviceGraphic(design: LandingPageDesignInput): string {
  return `<div class="art-card art-main" style="left:9%;top:11%;right:9%;width:auto">
    <div class="art-head"><span class="art-chip">Book a visit</span><span class="art-status">Open</span></div>
    <div class="art-checklist">
      <span class="art-row"><span class="art-box on"></span><span class="art-line"></span></span>
      <span class="art-row"><span class="art-box"></span><span class="art-line short"></span></span>
    </div>
    <span class="sc-cta" style="background:${design.primaryColor};color:${readableText(design.primaryColor)}">Book now</span>
  </div>
  <div class="art-card art-float" style="right:8%;bottom:11%;width:36%">
    <span class="art-dot"></span><span class="art-line short"></span>
  </div>`;
}

function personalGraphic(): string {
  return `<div class="art-card art-main" style="left:9%;top:11%;right:9%;width:auto">
    <div class="art-head"><span class="art-chip">About</span><span class="art-status">Available</span></div>
    <div class="pf-row"><span class="avatar"></span><div class="art-notes"><span class="art-line"></span><span class="art-line short"></span></div></div>
    <div class="art-line short"></div><div class="art-line tiny"></div>
  </div>
  <div class="art-card art-float" style="right:8%;bottom:11%;width:36%">
    <span class="art-bar"></span><span class="art-line short"></span>
  </div>`;
}

export function heroGraphicHtml(
  graphic: GraphicType,
  design: LandingPageDesignInput
): string {
  const enhanced = design.useGeneratedImages ? " art-enhanced" : "";
  const base = `<div class="art-glow"></div><div class="art-grid"></div>`;

  switch (graphic) {
    case "auto-service-dashboard":
      return `<div class="hero-art art-auto${enhanced}" aria-hidden="true">${base}${autoInspectionGraphic(design)}${autoBookingGraphic(design)}</div>`;
    case "inspection-checklist":
      return `<div class="hero-art art-auto${enhanced}" aria-hidden="true">${base}${autoInspectionGraphic(design)}</div>`;
    case "booking-card":
      return `<div class="hero-art art-auto${enhanced}" aria-hidden="true">${base}${autoBookingGraphic(design)}</div>`;
    case "saas-dashboard":
      return heroArtHtml("saas", design);
    case "workflow-nodes":
      return `<div class="hero-art${enhanced}" aria-hidden="true">${base}${workflowGraphic()}</div>`;
    case "fitness-progress":
      return heroArtHtml("fitness", design);
    case "study-cards":
      return `<div class="hero-art art-edu${enhanced}" aria-hidden="true">${base}${studyGraphic()}</div>`;
    case "local-business-card":
      return `<div class="hero-art${enhanced}" aria-hidden="true">${base}${localBizGraphic(design)}</div>`;
    case "portfolio-showcase":
      return `<div class="hero-art${enhanced}" aria-hidden="true">${base}${portfolioGraphic()}</div>`;
    case "restaurant-menu":
      return `<div class="hero-art art-restaurant${enhanced}" aria-hidden="true">${base}${restaurantGraphic(design)}</div>`;
    case "agency-grid":
      return `<div class="hero-art art-agency${enhanced}" aria-hidden="true">${base}${agencyGraphic()}</div>`;
    case "service-booking":
      return `<div class="hero-art art-service${enhanced}" aria-hidden="true">${base}${serviceGraphic(design)}</div>`;
    case "personal-card":
      return `<div class="hero-art art-personal${enhanced}" aria-hidden="true">${base}${personalGraphic()}</div>`;
    case "abstract-gradient":
      return heroArtHtml("default", design);
    case "none":
    default:
      return "";
  }
}

export function sectionGraphicHtml(
  graphic: GraphicType,
  design: LandingPageDesignInput
): string {
  if (graphic === "none") return "";
  return heroGraphicHtml(graphic, design);
}

/* -------------------------------------------------------------------------- */
/* Blueprint section CSS                                                      */
/* -------------------------------------------------------------------------- */

export const BLUEPRINT_CSS = `
/* Navigation */
.lp .nav-link { color: inherit; text-decoration: none; font-size: var(--text-base); transition: color var(--dur) var(--ease); }
.lp .nav-link:hover { color: var(--fg); }
.lp .header-cta .btn { height: 40px; padding: 0 var(--sp-5); font-size: var(--text-base); }

/* Hero layout variants */
.lp .hero.centered { grid-template-columns: 1fr; text-align: center; }
.lp .hero.centered .cta { justify-content: center; }
.lp .hero.centered .eyebrow { margin-left: auto; margin-right: auto; }
.lp .hero.service-hero .hero-copy { order: 1; }
.lp .hero.service-hero .hero-visual { order: 0; }
.lp .hero .hero-visual { width: 100%; }

/* Value strip */
.lp .value-strip { display: flex; flex-wrap: wrap; gap: var(--sp-3); }
.lp .value-strip.row { justify-content: center; }
.lp .vs-item { display: inline-flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-4); border-radius: 999px; border: var(--border-w) solid var(--border); background: var(--surface); font-size: var(--text-sm); color: var(--muted); }
.lp .vs-item::before { content: ""; width: 6px; height: 6px; border-radius: 999px; background: var(--accent); }
.lp .value-strip.chips { gap: var(--sp-2); }
.lp .value-strip.chips .vs-item { border-radius: var(--radius); }

/* Services */
.lp .services-grid { display: grid; grid-template-columns: 1fr; gap: var(--sp-4); }
.lp .service-card { border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius); padding: clamp(22px, 2.6vw, 30px); }
.lp .service-card h3 { font-size: clamp(17px, 1.8vw, 21px); }
.lp .service-card p { font-size: var(--text-md); margin-top: var(--sp-2); }
.lp .service-list { display: flex; flex-direction: column; gap: var(--sp-3); }
.lp .service-row { display: flex; gap: var(--sp-4); align-items: flex-start; border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius); padding: var(--sp-5); }
.lp .service-row .sr-num { flex: none; width: 30px; height: 30px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--tint); color: var(--primary); border: var(--border-w) solid var(--border-strong); font-weight: 700; font-size: var(--text-base); }
@media (min-width: 720px) { .lp .services-grid { grid-template-columns: repeat(3, 1fr); } .lp .services.bento .services-grid { grid-template-columns: repeat(6, 1fr); } .lp .services.bento .service-card { grid-column: span 2; } }
.lp .services.bento .service-card:nth-child(4n+1) { grid-column: span 3; }
.lp .services.bento .service-card:nth-child(4n) { grid-column: span 3; }

/* Process */
.lp .steps { display: grid; grid-template-columns: 1fr; gap: var(--sp-4); counter-reset: step; }
.lp .step { display: flex; gap: var(--sp-4); align-items: flex-start; border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius); padding: var(--sp-5); }
.lp .step .step-num { flex: none; width: 34px; height: 34px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--primary); color: var(--primary-fg); font-weight: 700; }
.lp .step h3 { font-size: var(--text-lg); } .lp .step p { font-size: var(--text-md); margin-top: var(--sp-2); }
.lp .timeline { display: flex; flex-direction: column; gap: 0; border-left: 2px solid var(--border-strong); padding-left: var(--sp-6); }
.lp .tl-item { position: relative; padding: 0 0 var(--sp-6); }
.lp .tl-item::before { content: ""; position: absolute; left: -29px; top: 4px; width: 12px; height: 12px; border-radius: 999px; background: var(--accent); }
.lp .tl-item h3 { font-size: var(--text-lg); } .lp .tl-item p { font-size: var(--text-md); }
.lp .process-cards { display: grid; grid-template-columns: 1fr; gap: var(--sp-4); }
@media (min-width: 720px) { .lp .steps, .lp .process-cards { grid-template-columns: repeat(3, 1fr); } }

/* Workflow graphic */
.lp .wf-row { display: flex; align-items: center; gap: var(--sp-2); }
.lp .wf-node { width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--primary); color: var(--primary-fg); display: grid; place-items: center; font-weight: 700; font-size: var(--text-sm); }
.lp .wf-line { flex: 1; height: 2px; background: var(--border-strong); border-radius: 2px; }

/* Pricing / offer */
.lp .offer { border: var(--border-w) solid var(--border-strong); background: linear-gradient(160deg, var(--surface), var(--surface-2)); border-radius: var(--radius-lg); padding: clamp(28px, 4vw, 48px); text-align: center; }
.lp .offer p { font-size: clamp(16px, 1.6vw, 19px); color: var(--fg); max-width: 60ch; margin: var(--sp-4) auto 0; }
.lp .offer .cta { justify-content: center; display: flex; flex-wrap: wrap; gap: var(--sp-4); margin-top: var(--sp-6); }

/* Contact */
.lp .contact-card { border: var(--border-w) solid var(--border); background: var(--surface); border-radius: var(--radius-lg); padding: clamp(26px, 3vw, 40px); display: grid; gap: var(--sp-4); }
.lp .contact-card .cc-row { display: flex; align-items: center; gap: var(--sp-3); font-size: var(--text-md); color: var(--fg); }
.lp .contact-card .cc-ic { flex: none; width: 34px; height: 34px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--tint); color: var(--accent); border: var(--border-w) solid var(--border-strong); font-weight: 700; }
.lp .contact.split { grid-template-columns: 1fr; gap: var(--sp-8); align-items: center; }
@media (min-width: 820px) { .lp .contact.split { grid-template-columns: 1fr 1fr; } }

/* Section eyebrow helper already exists; ensure spacing */
.lp .section-head .eyebrow { margin-bottom: var(--sp-4); }
`;

/* -------------------------------------------------------------------------- */
/* Aesthetic skins (P2: cohesive premium templates)                          */
/* The AI picks one; it layers a signature look on top of the token system.  */
/* -------------------------------------------------------------------------- */

export type AestheticSkin = { cls: string; css: string };

const AESTHETIC_SKINS: Record<AestheticChoice, AestheticSkin> = {
  minimal: {
    cls: "aesthetic-minimal",
    css: `
.lp.aesthetic-minimal { --sec-pad: clamp(64px, 9vw, 120px); --shadow: 0 24px 60px -32px rgba(0,0,0,0.45); }
.lp.aesthetic-minimal .section + .section { border-top-color: color-mix(in srgb, var(--border) 55%, transparent); }
.lp.aesthetic-minimal .benefit, .lp.aesthetic-minimal .feature, .lp.aesthetic-minimal .service-card, .lp.aesthetic-minimal .panel { border-color: color-mix(in srgb, var(--border) 65%, transparent); }
.lp.aesthetic-minimal .hero h1 { letter-spacing: -0.02em; }
.lp.aesthetic-minimal .eyebrow::before { width: 24px; }
.lp.aesthetic-minimal .cta-band { background: var(--surface); }
`,
  },
  saas: {
    cls: "aesthetic-saas",
    css: `
.lp.aesthetic-saas { --decor-glow: 1.2; --radius: 14px; --radius-lg: 22px; }
.lp.aesthetic-saas .btn-primary { box-shadow: 0 14px 34px -12px var(--tint-strong); }
.lp.aesthetic-saas .feature, .lp.aesthetic-saas .service-card { box-shadow: var(--shadow-sm); }
.lp.aesthetic-saas .feature::after { opacity: 1; }
.lp.aesthetic-saas .hero::before { background: radial-gradient(60% 50% at 82% 0%, var(--tint-strong), transparent 70%); }
.lp.aesthetic-saas .cta-band { border-color: var(--border-strong); }
`,
  },
  studio: {
    cls: "aesthetic-studio",
    css: `
.lp.aesthetic-studio { --font-display: Georgia, "Times New Roman", "Iowan Old Style", "Noto Serif", serif; --sec-pad: clamp(60px, 8vw, 112px); }
.lp.aesthetic-studio h1, .lp.aesthetic-studio h2, .lp.aesthetic-studio h3 { letter-spacing: -0.01em; font-weight: 600; }
.lp.aesthetic-studio .section + .section { border-top: 1px solid color-mix(in srgb, var(--border) 55%, transparent); }
.lp.aesthetic-studio .eyebrow { letter-spacing: 0.22em; }
.lp.aesthetic-studio .lead { font-size: clamp(17px, 1.5vw, 21px); }
.lp.aesthetic-studio .feature, .lp.aesthetic-studio .benefit, .lp.aesthetic-studio .service-card { border-color: color-mix(in srgb, var(--border) 55%, transparent); }
`,
  },
  bold: {
    cls: "aesthetic-bold",
    css: `
.lp.aesthetic-bold { --radius: 10px; --radius-lg: 16px; --shadow: 0 30px 70px -24px rgba(0,0,0,0.7); }
.lp.aesthetic-bold .hero h1 { letter-spacing: -0.04em; font-weight: 800; }
.lp.aesthetic-bold .btn { font-weight: 700; }
.lp.aesthetic-bold .feature, .lp.aesthetic-bold .benefit, .lp.aesthetic-bold .service-card { border-width: var(--border-w-strong); }
.lp.aesthetic-bold .cta-band { border-width: var(--border-w-strong); }
.lp.aesthetic-bold .step-num, .lp.aesthetic-bold .q-mark, .lp.aesthetic-bold .benefit .mark { border-width: var(--border-w-strong); }
`,
  },
};

export function aestheticSkin(aesthetic: AestheticChoice): AestheticSkin {
  return AESTHETIC_SKINS[aesthetic] ?? AESTHETIC_SKINS.saas;
}

