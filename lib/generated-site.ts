import { readableText } from "./color";
import type { LandingPageDesignInput } from "./types";

export function themeVars(design: LandingPageDesignInput): Record<string, string> {
  const dark = design.siteTheme === "dark";
  const base: Record<string, string> = dark
    ? {
        "--bg": "#0a0a0a",
        "--fg": "#fafafa",
        "--muted": "#a1a1aa",
        "--card": "#18181b",
        "--border": "#27272a",
      }
    : {
        "--bg": "#ffffff",
        "--fg": "#18181b",
        "--muted": "#52525b",
        "--card": "#f4f4f5",
        "--border": "#e4e4e7",
      };

  return {
    ...base,
    "--primary": design.primaryColor,
    "--primary-fg": readableText(design.primaryColor),
    "--secondary": design.secondaryColor,
    "--accent": design.accentColor,
  };
}

export const GENERATED_SITE_CSS = `
.lp { --radius: 14px; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
.lp * { box-sizing: border-box; }
.lp .wrap { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.lp header.site { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px; border-bottom: 1px solid var(--border); }
.lp .logo { height: 34px; width: auto; border-radius: 8px; display: block; }
.lp .brand { font-weight: 600; letter-spacing: -0.01em; font-size: 16px; }
.lp .hero { display: grid; grid-template-columns: 1fr; gap: 28px; padding: 56px 20px; align-items: center; }
@media (min-width: 820px) { .lp .hero { grid-template-columns: 1.1fr 0.9fr; } }
.lp .tagline { color: var(--muted); font-size: 13px; text-transform: uppercase; letter-spacing: 0.16em; }
.lp .hero h1 { font-size: 40px; line-height: 1.08; font-weight: 700; letter-spacing: -0.02em; margin: 12px 0 0; }
.lp .hero .sub { color: var(--muted); font-size: 17px; margin: 16px 0 0; max-width: 48ch; }
.lp .cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.lp .btn { display: inline-flex; align-items: center; justify-content: center; height: 46px; padding: 0 24px; border-radius: 11px; font-weight: 600; font-size: 15px; border: 1px solid transparent; }
.lp .btn-primary { background: var(--primary); color: var(--primary-fg); }
.lp .btn-secondary { border-color: var(--border); color: var(--fg); }
.lp section.block { padding: 46px 20px; border-top: 1px solid var(--border); }
.lp h2 { font-size: 24px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 14px; }
.lp p { color: var(--muted); margin: 0; }
.lp .benefits { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.lp .benefits li { display: flex; gap: 12px; align-items: flex-start; color: var(--fg); }
.lp .benefits li::before { content: ""; margin-top: 9px; width: 7px; height: 7px; border-radius: 9999px; background: var(--accent); flex: none; }
.lp .features { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 640px) { .lp .features { grid-template-columns: 1fr 1fr; } }
.lp .feature { border: 1px solid var(--border); background: var(--card); border-radius: var(--radius); padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.lp .feature .ico { width: 26px; height: 26px; color: var(--accent); }
.lp .feature h3 { margin: 0; font-size: 16px; font-weight: 600; }
.lp .feature p { font-size: 14px; }
.lp .hero-visual { position: relative; aspect-ratio: 4 / 3; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; background: var(--card); }
.lp .hero-visual::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(135deg, var(--primary), transparent 60%), radial-gradient(circle at 82% 18%, var(--secondary), transparent 55%), radial-gradient(circle at 18% 88%, var(--accent), transparent 55%); opacity: 0.55; }
.lp .hero-visual::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.45; -webkit-mask-image: radial-gradient(circle at center, #000, transparent 72%); mask-image: radial-gradient(circle at center, #000, transparent 72%); }
.lp .mock { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 62%; padding: 14px; border-radius: 10px; background: color-mix(in srgb, var(--bg) 70%, transparent); border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
.lp .mock .line { height: 8px; border-radius: 9999px; background: var(--primary); opacity: 0.85; }
.lp .mock .line.short { width: 55%; margin-top: 8px; background: var(--accent); }
.lp .mock .bar { height: 26px; border-radius: 8px; margin-top: 12px; background: var(--secondary); }
.lp .graphics { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 720px) { .lp .graphics { grid-template-columns: 1.3fr 1fr; } }
.lp .visual-panel { position: relative; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; background: var(--card); padding: 26px; min-height: 220px; }
.lp .visual-panel::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 20%, var(--primary), transparent 50%), radial-gradient(circle at 85% 75%, var(--accent), transparent 55%); opacity: 0.4; }
.lp .visual-panel .inner { position: relative; display: flex; flex-direction: column; gap: 12px; }
.lp .visual-panel .head { width: 40%; height: 10px; border-radius: 9999px; background: var(--accent); }
.lp .visual-panel .blocks { display: flex; gap: 10px; }
.lp .visual-panel .block { width: 42px; height: 42px; border-radius: 10px; border: 1px solid var(--border); background: color-mix(in srgb, var(--secondary) 70%, transparent); }
.lp .panel-photo { position: relative; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; background: var(--card); min-height: 220px; }
.lp .panel-photo::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(140deg, var(--accent), var(--secondary)); opacity: 0.35; }
.lp .photos { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.lp .photos img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); display: block; }
.lp .faqs { display: flex; flex-direction: column; }
.lp .faq { padding: 14px 0; border-top: 1px solid var(--border); }
.lp .faq:first-child { border-top: none; }
.lp .faq h3 { margin: 0 0 4px; font-size: 15px; font-weight: 600; }
.lp .faq p { font-size: 14px; }
.lp .offer { border: 1px solid var(--border); background: var(--card); border-radius: var(--radius); padding: 22px; }
.lp .offer .label, .lp .contact .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; }
.lp .contact p { font-size: 15px; color: var(--fg); }
.lp footer.site { text-align: center; padding: 28px 20px; color: var(--muted); font-size: 13px; border-top: 1px solid var(--border); }
`;

const ICON_SHAPES = ["circle", "square", "triangle", "diamond"];

export function featureIconSvg(design: LandingPageDesignInput, index: number): string {
  const shape = ICON_SHAPES[index % ICON_SHAPES.length];
  const stroke = design.accentColor;
  const common = `fill="none" stroke="${stroke}" stroke-width="2"`;
  let shapeSvg = "";
  if (shape === "circle") {
    shapeSvg = `<circle cx="16" cy="16" r="11" ${common} />`;
  } else if (shape === "square") {
    shapeSvg = `<rect x="6" y="6" width="20" height="20" rx="5" ${common} />`;
  } else if (shape === "triangle") {
    shapeSvg = `<path d="M16 5 L27 25 L5 25 Z" ${common} stroke-linejoin="round" />`;
  } else {
    shapeSvg = `<path d="M16 4 L28 16 L16 28 L4 16 Z" ${common} stroke-linejoin="round" />`;
  }
  return `<svg class="ico" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shapeSvg}</svg>`;
}
