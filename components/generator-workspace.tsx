"use client";

import * as React from "react";

import { GeneratorForm } from "@/components/generator-form";
import { LandingPreview } from "@/components/landing-preview";
import { ExportActions } from "@/components/export-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_LANDING_PAGE } from "@/lib/sample-content";
import {
  DEFAULT_DESIGN,
  type LandingPageContent,
  type LandingPageDesignInput,
  type LandingPageFormInput,
} from "@/lib/types";

const STAGES = ["Writing copy", "Structuring sections", "Preparing preview"];

export function GeneratorWorkspace() {
  const [content, setContent] = React.useState<LandingPageContent>(
    SAMPLE_LANDING_PAGE
  );
  const [design, setDesign] = React.useState<LandingPageDesignInput>(DEFAULT_DESIGN);
  const [loading, setLoading] = React.useState(false);
  const [stage, setStage] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading) return;
    setStage(0);
    const interval = window.setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [loading]);

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
        <GeneratorForm
          design={design}
          onDesignChange={setDesign}
          onGenerate={handleGenerate}
          loading={loading}
        />
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
            {loading ? (
              <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Generating landing page
                  <span className="text-foreground"> · {STAGES[stage]}</span>
                </p>
              </div>
            ) : (
              <LandingPreview content={content} design={design} />
            )}
          </CardContent>
        </Card>
        <ExportActions content={content} design={design} />
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </section>
    </main>
  );
}
