import type { LandingPageContent, LandingPageDesignInput, PageBlueprint } from "./types";
import { normalizePageBlueprint, legacyContentToBlueprint } from "./blueprint";
import {
  GENERATED_SITE_CSS,
  BLUEPRINT_CSS,
  featureGlyphSvg,
  heroGraphicHtml,
  sectionGraphicHtml,
  showcaseGraphicHtml,
  themeVars,
  readableText,
  aestheticSkin,
} from "./generated-site";

export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function btn(label: string, variant = "btn-primary"): string {
  const esc = escapeHtml;
  return `<span class="btn ${variant}">${esc(label)}</span>`;
}

type RenderCtx = {
  design: LandingPageDesignInput;
  blueprint: PageBlueprint;
  vars: Record<string, string>;
  logo: string;
  photos: string[];
  useGen: boolean;
};

function buildVars(blueprint: PageBlueprint, design: LandingPageDesignInput): Record<string, string> {
  const base = themeVars(design, blueprint.theme);
  const customized = Boolean(design.colorsCustomized) || Boolean(design.useLogoPalette);
  if (!customized) {
    base["--primary"] = blueprint.theme.primaryColor;
    base["--primary-fg"] = readableText(blueprint.theme.primaryColor);
    base["--secondary"] = blueprint.theme.secondaryColor;
    base["--accent"] = blueprint.theme.accentColor;
  }
  return base;
}

function renderNav(ctx: RenderCtx): string {
  const esc = escapeHtml;
  const bp = ctx.blueprint;
  const items = bp.navigation.items
    .map((it) => `<a class="nav-link" href="#${esc(it.targetId)}">${esc(it.label)}</a>`)
    .join("");
  return `<header class="site">${ctx.logo}<nav class="nav">${items}</nav><span class="header-cta">${btn(bp.ctaStrategy.primaryCTA)}</span></header>`;
}

function renderSection(section: PageBlueprint["sections"][number], ctx: RenderCtx): string {
  const esc = escapeHtml;
  const bp = ctx.blueprint;
  const id = esc(section.id);

  switch (section.type) {
    case "hero": {
      const visual = heroGraphicHtml(section.visual, ctx.design);
      const cls =
        section.layout === "centered"
          ? "centered"
          : section.layout === "service-hero"
            ? "service-hero"
            : "";
      return `<section class="hero ${cls}" id="${id}">
        <div class="hero-copy">
          ${section.eyebrow ? `<span class="eyebrow">${esc(section.eyebrow)}</span>` : ""}
          <h1>${esc(section.headline)}</h1>
          ${section.subheadline ? `<p class="sub lead">${esc(section.subheadline)}</p>` : ""}
          <div class="cta">${btn(section.primaryCTA)}${section.secondaryCTA ? btn(section.secondaryCTA, "btn-secondary") : ""}</div>
        </div>
        ${visual}
      </section>`;
    }
    case "value-strip": {
      const items = section.items.map((i) => `<span class="vs-item">${esc(i)}</span>`).join("");
      return `<section class="section" id="${id}"><div class="wrap"><div class="value-strip ${esc(section.layout)}">${items}</div></div></section>`;
    }
    case "services": {
      const gridCls = section.layout === "service-list" ? "service-list" : "services-grid";
      const cards = section.services
        .map((sv, i) =>
          section.layout === "service-list"
            ? `<div class="service-row"><span class="sr-num">${i + 1}</span><div><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div></div>`
            : `<div class="service-card"><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div>`
        )
        .join("");
      return `<section class="section services ${section.layout === "bento" ? "bento" : ""}" id="${id}">
        <div class="wrap">
          <div class="section-head">${section.eyebrow ? `<span class="eyebrow">${esc(section.eyebrow)}</span>` : ""}<h2>${esc(section.title)}</h2>${section.description ? `<p class="lead">${esc(section.description)}</p>` : ""}</div>
          <div class="${gridCls}">${cards}</div>
        </div>
      </section>`;
    }
    case "problem-solution": {
      return `<section class="section" id="${id}"><div class="wrap"><div class="split">
        <div class="panel"><span class="tag">Problem</span><h3>${esc(section.problemTitle)}</h3><p>${esc(section.problemDescription)}</p></div>
        <div class="panel"><span class="tag">Solution</span><h3>${esc(section.solutionTitle)}</h3><p>${esc(section.solutionDescription)}</p></div>
      </div></div></section>`;
    }
    case "benefits": {
      const cards = section.benefits
        .map(
          (b, i) =>
            `<div class="benefit"><span class="mark">${i + 1}</span><p>${esc(b.title)}${b.description ? `<br/><span class="muted-text">${esc(b.description)}</span>` : ""}</p></div>`
        )
        .join("");
      return `<section class="section" id="${id}"><div class="wrap">${section.title ? `<div class="section-head"><h2>${esc(section.title)}</h2></div>` : ""}<div class="benefits">${cards}</div></div></section>`;
    }
    case "features": {
      const cards = section.features
        .map(
          (f, i) =>
            `<div class="feature">${featureGlyphSvg(i, ctx.design.accentColor)}<h3>${esc(f.title)}</h3><p>${esc(f.description)}</p></div>`
        )
        .join("");
      return `<section class="section" id="${id}"><div class="wrap"><div class="section-head">${section.eyebrow ? `<span class="eyebrow">${esc(section.eyebrow)}</span>` : ""}<h2>${esc(section.title || "What you get")}</h2></div><div class="bento">${cards}</div></div></section>`;
    }
    case "process": {
      const inner =
        section.layout === "timeline"
          ? `<div class="timeline">${section.steps
              .map((st) => `<div class="tl-item"><h3>${esc(st.title)}</h3><p>${esc(st.description)}</p></div>`)
              .join("")}</div>`
          : section.layout === "cards"
            ? `<div class="process-cards">${section.steps
                .map(
                  (st) =>
                    `<div class="step"><div class="step-num">→</div><div><h3>${esc(st.title)}</h3><p>${esc(st.description)}</p></div></div>`
                )
                .join("")}</div>`
            : `<div class="steps">${section.steps
                .map(
                  (st, i) =>
                    `<div class="step"><div class="step-num">${i + 1}</div><div><h3>${esc(st.title)}</h3><p>${esc(st.description)}</p></div></div>`
                )
                .join("")}</div>`;
      return `<section class="section" id="${id}"><div class="wrap"><div class="section-head"><h2>${esc(section.title)}</h2>${section.description ? `<p class="lead">${esc(section.description)}</p>` : ""}</div>${inner}</div></section>`;
    }
    case "showcase": {
      const showPhotos = ctx.photos.length > 0;
      const visual = showPhotos
        ? `<div class="gallery">${ctx.photos
            .map((p) => `<img src="${esc(p)}" alt="" loading="lazy" />`)
            .join("")}</div>`
        : ctx.blueprint.graphics.sectionVisuals[0] && ctx.blueprint.graphics.sectionVisuals[0] !== "none"
          ? `<div class="photo-panel">${sectionGraphicHtml(ctx.blueprint.graphics.sectionVisuals[0], ctx.design)}</div>`
          : `<div class="photo-panel">${showcaseGraphicHtml(ctx.blueprint.meta.visualStyle, ctx.design)}</div>`;
      return `<section class="section" id="${id}"><div class="wrap"><div class="section-head">${section.eyebrow ? `<span class="eyebrow">${esc(section.eyebrow)}</span>` : ""}<h2>${esc(section.title || "A closer look")}</h2>${section.description ? `<p class="lead">${esc(section.description)}</p>` : ""}</div><div class="showcase">${visual}</div></div></section>`;
    }
    case "pricing-offer": {
      return `<section class="section" id="${id}"><div class="wrap"><div class="offer">
        <div class="section-head" style="text-align:center">${section.eyebrow ? `<span class="eyebrow" style="justify-content:center">${esc(section.eyebrow)}</span>` : ""}<h2>${esc(section.title || "Offer")}</h2></div>
        <p>${esc(section.offer)}</p>
        <div class="cta">${btn(bp.ctaStrategy.primaryCTA)}</div>
      </div></div></section>`;
    }
    case "contact": {
      const modeLabel: Record<string, string> = {
        email: "Add your email",
        phone: "Add your phone number",
        "form-placeholder": "Add a contact form",
        "booking-placeholder": "Book a service",
        none: "Get in touch",
      };
      const rows: string[] = [];
      if (section.details) {
        rows.push(`<div class="cc-row"><span class="cc-ic">i</span><span>${esc(section.details)}</span></div>`);
      }
      rows.push(`<div class="cc-row"><span class="cc-ic">@</span><span>${esc(modeLabel[section.contactMode] ?? "Get in touch")}</span></div>`);
      return `<section class="section" id="${id}"><div class="wrap"><div class="contact-card ${esc(section.layout)}">
        ${section.title ? `<div class="section-head"><h2>${esc(section.title)}</h2>${section.description ? `<p class="lead">${esc(section.description)}</p>` : ""}</div>` : ""}
        <div class="contact-rows">${rows.join("")}</div>
        <div class="cta">${btn(bp.ctaStrategy.primaryCTA)}</div>
      </div></div></section>`;
    }
    case "faq": {
      const items = section.faqs
        .map(
          (f, i) =>
            `<div class="faq"><span class="q-mark">${i + 1}</span><div><h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p></div></div>`
        )
        .join("");
      return `<section class="section" id="${id}"><div class="wrap"><div class="section-head">${section.eyebrow ? `<span class="eyebrow">${esc(section.eyebrow)}</span>` : ""}<h2>${esc(section.title || "Questions, answered")}</h2></div><div class="faqs">${items}</div></div></section>`;
    }
    case "final-cta": {
      return `<section class="section" id="${id}"><div class="wrap"><div class="cta-band">
        <h2>${esc(section.headline)}</h2>
        ${section.subheadline ? `<p class="lead">${esc(section.subheadline)}</p>` : ""}
        <div class="cta">${btn(section.primaryCTA)}${section.secondaryCTA ? btn(section.secondaryCTA, "btn-secondary") : ""}</div>
      </div></div></section>`;
    }
    case "footer": {
      return `<footer class="site" id="${id}"><span class="brand">${esc(bp.meta.brandName)}</span><span>${esc(section.text)}</span></footer>`;
    }
    default:
      return "";
  }
}

export function generateStandaloneHtmlFromBlueprint(
  blueprint: PageBlueprint,
  design: LandingPageDesignInput
): string {
  const bp = normalizePageBlueprint(blueprint);
  const esc = escapeHtml;
  const vars = buildVars(bp, design);
  const styleAttr = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");

  const logo = design.logoDataUrl
    ? `<a class="brand" href="#top"><img class="logo" src="${esc(design.logoDataUrl)}" alt="Logo" /></a>`
    : `<a class="brand" href="#top">${esc(bp.meta.brandName)}</a>`;

  const photos = design.photoUrls.filter((p) => p.trim() !== "");
  const useGen = Boolean(design.useGeneratedImages) || bp.graphics.useGeneratedImages;
  const skin = aestheticSkin(bp.theme.aesthetic);
  const ctx: RenderCtx = { design, blueprint: bp, vars, logo, photos, useGen };

  const nav = bp.navigation.showNav ? renderNav(ctx) : "";
  const sectionsHtml = bp.sections.map((s) => renderSection(s, ctx)).join("");

  return `<!doctype html>
<html lang="en" style="${styleAttr}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(bp.meta.brandName)}</title>
<meta name="description" content="${esc(bp.meta.pageGoal)}" />
<style>${GENERATED_SITE_CSS}${BLUEPRINT_CSS}${skin.css}</style>
</head>
<body>
<div class="lp ${skin.cls}" id="top">
  ${nav}
  ${sectionsHtml}
</div>
</body>
</html>`;
}

export function generateStandaloneHtml(
  content: LandingPageContent,
  design: LandingPageDesignInput
): string {
  const blueprint = legacyContentToBlueprint(content);
  return generateStandaloneHtmlFromBlueprint(blueprint, design);
}
