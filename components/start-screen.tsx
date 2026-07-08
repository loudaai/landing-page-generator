"use client";

import * as React from "react";

import { ChatComposer } from "@/components/chat-composer";
import { type FormErrors } from "@/lib/validation";
import { fileToDataUrl, extractPalette } from "@/lib/logo";
import type {
  LandingPageDesignInput,
} from "@/lib/types";

export function StartScreen({
  prompt,
  onPromptChange,
  design,
  onDesignChange,
  errors,
  loading,
  onGenerate,
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  design: LandingPageDesignInput;
  onDesignChange: (design: LandingPageDesignInput) => void;
  errors: FormErrors;
  loading: boolean;
  onGenerate: () => void;
}) {
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const next: LandingPageDesignInput = {
        ...design,
        logoDataUrl: dataUrl,
        useLogoPalette: false,
        colorsCustomized: false,
      };
      try {
        const palette = await extractPalette(dataUrl, 3);
        next.primaryColor = palette[0] ?? next.primaryColor;
        next.secondaryColor = palette[1] ?? next.secondaryColor;
        next.accentColor = palette[2] ?? next.accentColor;
        next.useLogoPalette = true;
      } catch {
        /* fall back to curated palette */
      }
      onDesignChange(next);
    } catch {
      /* ignore */
    }
  }

  const plusContent = (
    <>
      <button
        type="button"
        onClick={() => logoInputRef.current?.click()}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
      >
        Upload logo
      </button>
      <button
        type="button"
        onClick={() =>
          onDesignChange({ ...design, useGeneratedImages: !design.useGeneratedImages })
        }
        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
      >
        <span>Generate images</span>
        <span
          className={`ml-2 h-4 w-7 rounded-full p-0.5 transition ${
            design.useGeneratedImages ? "bg-emerald-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`block h-3 w-3 rounded-full bg-white transition ${
              design.useGeneratedImages ? "translate-x-3" : ""
            }`}
          />
        </span>
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-5 py-4 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/por-logo-white.svg"
          alt="p0r by Louda"
          className="h-auto w-10"
        />

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/loudaai/p0r-by-louda"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub"
            className="inline-flex h-8 w-8 items-center justify-center text-zinc-400 transition hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <a
            href="https://www.facebook.com/loudatuppal/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Facebook"
            className="inline-flex h-8 w-8 items-center justify-center text-zinc-400 transition hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
            </svg>
          </a>
        </div>
      </header>

      <main className="grid min-h-[100dvh] place-items-center px-5 py-8">
        <div className="flex w-full max-w-[760px] flex-col items-center translate-y-[-3vh] sm:translate-y-[-5vh]">
          <h1             className="text-center text-[clamp(24px,2.6vw,30px)] font-semibold leading-[1.1] tracking-[-0.04em] text-white">
            What do you want to create?
          </h1>

          <div className="mt-7 w-full sm:mt-9">
            <ChatComposer
              value={prompt}
              onChange={onPromptChange}
              onSubmit={onGenerate}
              placeholder="Ask p0r to build..."
              plusContent={plusContent}
              disabled={loading}
              submitLabel={loading ? "Generating..." : "Generate"}
            />
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {design.logoDataUrl ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.logoDataUrl}
                alt="Logo"
                className="h-6 w-6 rounded-md border border-white/10 object-contain"
              />
              Logo added
            </div>
          ) : null}

          {Object.keys(errors).length > 0 ? (
            <p className="mt-3 text-center text-sm text-destructive">
              Add a prompt to continue.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
