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
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
      >
        Upload logo
      </button>
      <button
        type="button"
        onClick={() =>
          onDesignChange({ ...design, useGeneratedImages: !design.useGeneratedImages })
        }
        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
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
      <header className="flex items-center border-b border-white/5 px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-white">
          p0r by Louda
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[720px]">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What do you want to create?
          </h1>
          <p className="mt-3 text-center text-sm text-zinc-500">
            Describe a business, product, or idea. We&apos;ll build the landing page.
          </p>

          <div className="mt-8">
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
