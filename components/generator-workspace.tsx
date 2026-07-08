"use client";

import * as React from "react";

import { GeneratorForm } from "@/components/generator-form";
import { LandingPreview } from "@/components/landing-preview";
import { ExportActions } from "@/components/export-actions";
import { Card, CardContent } from "@/components/ui/card";
import { SAMPLE_LANDING_PAGE } from "@/lib/sample-content";
import type { LandingPageContent, LandingPageFormInput } from "@/lib/types";

export function GeneratorWorkspace() {
  const [content, setContent] = React.useState<LandingPageContent>(
    SAMPLE_LANDING_PAGE
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleGenerate(input: LandingPageFormInput) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok || !data?.content) {
        throw new Error(data?.error ?? "Generation failed. Please try again.");
      }
      setContent(data.content as LandingPageContent);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Generation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-2">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Generate your landing page
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe your business or idea, then preview the generated page.
          </p>
        </div>
        <GeneratorForm onGenerate={handleGenerate} loading={loading} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Preview</h2>
          <p className="text-sm text-muted-foreground">
            Live preview from generated content. Copy or download the HTML.
          </p>
        </div>
        <Card className="p-0">
          <CardContent className="p-3">
            <LandingPreview content={content} />
          </CardContent>
        </Card>
        <ExportActions content={content} />
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </section>
    </main>
  );
}
