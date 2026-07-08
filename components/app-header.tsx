import * as React from "react";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/loudatuppal" },
  { label: "X", href: "https://x.com/loudaai" },
  { label: "Instagram", href: "https://www.instagram.com/louda.ai" },
];

const GITHUB_URL = "https://github.com/loudaai/p0r-by-louda";

const linkClass =
  "relative text-sm text-zinc-400 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-200 hover:after:w-full";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3 sm:px-6">
        {/* Left: logo */}
        <div className="flex items-center justify-self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/por-logo-white.svg"
            alt="p0r by Louda"
            className="h-auto w-9"
          />
        </div>

        {/* Center: social text links */}
        <nav className="hidden items-center gap-7 justify-self-center md:flex">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: GitHub button */}
        <div className="flex justify-self-end">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white px-2.5 py-1 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
