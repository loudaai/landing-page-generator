import type { LandingPageContent, LandingPageDesignInput } from "./types";
import {
  GENERATED_SITE_CSS,
  featureIconSvg,
  themeVars,
} from "./generated-site";

export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function varsToStyle(design: LandingPageDesignInput): string {
  return Object.entries(themeVars(design))
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}

export function generateStandaloneHtml(
  content: LandingPageContent,
  design: LandingPageDesignInput
): string {
  const esc = escapeHtml;
  const styleAttr = varsToStyle(design);

  const logo = design.logoDataUrl
    ? `<img class="logo" src="${esc(design.logoDataUrl)}" alt="Logo" />`
    : `<span class="brand">${esc(content.brandName)}</span>`;

  const heroPhoto = design.photoUrls.find((p) => p.trim() !== "");
  const heroVisual = heroPhoto
    ? `<img class="hero-visual" src="${esc(heroPhoto)}" alt="" style="object-fit:cover" />`
    : `<div class="hero-visual"><div class="mock"><div class="line"></div><div class="line short"></div><div class="bar"></div></div></div>`;

  const benefits = content.benefits
    .map((benefit) => `<li>${esc(benefit)}</li>`)
    .join("");

  const features = content.features
    .map(
      (feature, i) => `
        <div class="feature">
          ${featureIconSvg(design, i)}
          <h3>${esc(feature.title)}</h3>
          <p>${esc(feature.description)}</p>
        </div>`
    )
    .join("");

  const faqs = content.faqs
    .map(
      (faq) => `
        <div class="faq">
          <h3>${esc(faq.question)}</h3>
          <p>${esc(faq.answer)}</p>
        </div>`
    )
    .join("");

  const photos = design.photoUrls.filter((p) => p.trim() !== "");
  const gallery = photos.length
    ? `<section class="block"><h2>Gallery</h2><div class="photos">${photos
        .map((url) => `<img src="${esc(url)}" alt="" />`)
        .join("")}</div></section>`
    : "";

  const secondPhoto =
    design.photoUrls[1]?.trim() || design.photoUrls[2]?.trim() || "";
  const panelPhoto = secondPhoto
    ? `<img class="panel-photo" src="${esc(secondPhoto)}" alt="" style="object-fit:cover" />`
    : `<div class="panel-photo"></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(content.brandName)}</title>
<style>${GENERATED_SITE_CSS}</style>
</head>
<body>
<div class="lp" style="${styleAttr}">
  <header class="site">
    ${logo}
    <span class="brand">${esc(content.brandName)}</span>
  </header>

  <section class="hero">
    <div>
      ${content.tagline ? `<div class="tagline">${esc(content.tagline)}</div>` : ""}
      <h1>${esc(content.heroHeadline)}</h1>
      ${content.heroSubheadline ? `<p class="sub">${esc(content.heroSubheadline)}</p>` : ""}
      <div class="cta">
        ${
          content.primaryCTA
            ? `<span class="btn btn-primary">${esc(content.primaryCTA)}</span>`
            : ""
        }
        ${
          content.secondaryCTA
            ? `<span class="btn btn-secondary">${esc(content.secondaryCTA)}</span>`
            : ""
        }
      </div>
    </div>
    ${heroVisual}
  </section>

  <section class="block">
    <h2>${esc(content.problemTitle)}</h2>
    <p>${esc(content.problemDescription)}</p>
  </section>

  <section class="block">
    <h2>${esc(content.solutionTitle)}</h2>
    <p>${esc(content.solutionDescription)}</p>
  </section>

  ${
    benefits
      ? `<section class="block"><h2>Why it helps</h2><ul class="benefits">${benefits}</ul></section>`
      : ""
  }

  ${
    features
      ? `<section class="block"><h2>What you get</h2><div class="features">${features}</div></section>`
      : ""
  }

  <section class="block">
    <h2>A closer look</h2>
    <div class="graphics">
      <div class="visual-panel">
        <div class="inner">
          <div class="head"></div>
          <div class="blocks"><div class="block"></div><div class="block"></div><div class="block"></div></div>
          <div class="head" style="width:60%"></div>
        </div>
      </div>
      ${panelPhoto}
    </div>
  </section>

  ${gallery}

  ${
    faqs
      ? `<section class="block"><h2>FAQ</h2><div class="faqs">${faqs}</div></section>`
      : ""
  }

  ${
    content.pricingOrOffer
      ? `<section class="block"><div class="offer"><div class="label">Offer</div><p>${esc(
          content.pricingOrOffer
        )}</p></div></section>`
      : ""
  }

  ${
    content.contactText
      ? `<section class="block"><div class="contact"><div class="label">Contact</div><p>${esc(
          content.contactText
        )}</p></div></section>`
      : ""
  }

  <footer class="site">${esc(content.footerText)}</footer>
</div>
</body>
</html>`;
}
