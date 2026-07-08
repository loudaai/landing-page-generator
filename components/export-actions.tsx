"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { generateStandaloneHtml } from "@/lib/html-export";
import type { LandingPageContent, LandingPageDesignInput } from "@/lib/types";

export function ExportActions({
  content,
  design,
}: {
  content: LandingPageContent;
  design: LandingPageDesignInput;
}) {
  const hasContent = Boolean(content && (content.brandName || content.heroHeadline));
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCopy() {
    setError(null);
    try {
      const html = generateStandaloneHtml(content, design);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(html);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = html;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("Copy command failed");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy HTML to clipboard.");
    }
  }

  function handleDownload() {
    setError(null);
    try {
      const html = generateStandaloneHtml(content, design);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "index.html";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download index.html.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!hasContent}
        >
          {copied ? "Copied!" : "Copy HTML"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!hasContent}
        >
          Download index.html
        </Button>
      </div>
      {copied ? (
        <span className="text-xs text-muted-foreground">
          HTML copied to clipboard.
        </span>
      ) : null}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
