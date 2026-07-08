import type { CSSProperties } from "react";

import { GENERATED_SITE_CSS, themeVars } from "@/lib/generated-site";
import type {
  LandingPageContent,
  LandingPageDesignInput,
  SiteTheme,
} from "@/lib/types";

function FeatureIcon({ design, index }: { design: LandingPageDesignInput; index: number }) {
  const shapes = ["circle", "square", "triangle", "diamond"];
  const shape = shapes[index % shapes.length];
  const stroke = design.accentColor;
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2,
  } as const;
  let shapeSvg: React.ReactNode;
  if (shape === "circle") {
    shapeSvg = <circle cx={16} cy={16} r={11} {...common} />;
  } else if (shape === "square") {
    shapeSvg = <rect x={6} y={6} width={20} height={20} rx={5} {...common} />;
  } else if (shape === "triangle") {
    shapeSvg = <path d="M16 5 L27 25 L5 25 Z" strokeLinejoin="round" {...common} />;
  } else {
    shapeSvg = <path d="M16 4 L28 16 L16 28 L4 16 Z" strokeLinejoin="round" {...common} />;
  }
  return (
    <svg className="ico" viewBox="0 0 32 32" aria-hidden="true">
      {shapeSvg}
    </svg>
  );
}

function HeroOrPhoto({ design }: { design: LandingPageDesignInput }) {
  const photo = design.photoUrls.find((p) => p.trim() !== "");
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        className="hero-visual"
        style={{ objectFit: "cover" }}
      />
    );
  }
  return <div className="hero-visual">
    <div className="mock">
      <div className="line" />
      <div className="line short" />
      <div className="bar" />
    </div>
  </div>;
}

export function LandingPreview({
  content,
  design,
}: {
  content: LandingPageContent;
  design: LandingPageDesignInput;
}) {
  const style = themeVars(design) as CSSProperties;
  const photos = design.photoUrls.filter((p) => p.trim() !== "");
  const secondPhoto = design.photoUrls[1]?.trim() || design.photoUrls[2]?.trim() || "";

  return (
    <div className="lp" style={style}>
      <style>{GENERATED_SITE_CSS}</style>
      <header className="site">
        {design.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="logo" src={design.logoDataUrl} alt="Logo" />
        ) : (
          <span className="brand">{content.brandName}</span>
        )}
        <span className="brand">{content.brandName}</span>
      </header>

      <section className="hero">
        <div>
          {content.tagline ? <div className="tagline">{content.tagline}</div> : null}
          <h1>{content.heroHeadline}</h1>
          {content.heroSubheadline ? (
            <p className="sub">{content.heroSubheadline}</p>
          ) : null}
          <div className="cta">
            {content.primaryCTA ? (
              <span className="btn btn-primary">{content.primaryCTA}</span>
            ) : null}
            {content.secondaryCTA ? (
              <span className="btn btn-secondary">{content.secondaryCTA}</span>
            ) : null}
          </div>
        </div>
        <HeroOrPhoto design={design} />
      </section>

      <section className="block">
        <h2>{content.problemTitle}</h2>
        <p>{content.problemDescription}</p>
      </section>

      <section className="block">
        <h2>{content.solutionTitle}</h2>
        <p>{content.solutionDescription}</p>
      </section>

      {content.benefits.length > 0 ? (
        <section className="block">
          <h2>Why it helps</h2>
          <ul className="benefits">
            {content.benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.features.length > 0 ? (
        <section className="block">
          <h2>What you get</h2>
          <div className="features">
            {content.features.map((feature, i) => (
              <div className="feature" key={i}>
                <FeatureIcon design={design} index={i} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="block">
        <h2>A closer look</h2>
        <div className="graphics">
          <div className="visual-panel">
            <div className="inner">
              <div className="head" />
              <div className="blocks">
                <div className="block" />
                <div className="block" />
                <div className="block" />
              </div>
              <div className="head" style={{ width: "60%" }} />
            </div>
          </div>
          {secondPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="panel-photo" src={secondPhoto} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <div className="panel-photo" />
          )}
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="block">
          <h2>Gallery</h2>
          <div className="photos">
            {photos.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      {content.faqs.length > 0 ? (
        <section className="block">
          <h2>FAQ</h2>
          <div className="faqs">
            {content.faqs.map((faq, i) => (
              <div className="faq" key={i}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {content.pricingOrOffer ? (
        <section className="block">
          <div className="offer">
            <div className="label">Offer</div>
            <p>{content.pricingOrOffer}</p>
          </div>
        </section>
      ) : null}

      {content.contactText ? (
        <section className="block">
          <div className="contact">
            <div className="label">Contact</div>
            <p>{content.contactText}</p>
          </div>
        </section>
      ) : null}

      <footer className="site">{content.footerText}</footer>
    </div>
  );
}
