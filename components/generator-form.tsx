"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  EMPTY_FORM_INPUT,
  TONES,
  type LandingPageDesignInput,
  type LandingPageFormInput,
} from "@/lib/types";
import { PRESETS } from "@/lib/presets";
import { fileToDataUrl, extractPalette } from "@/lib/logo";
import {
  hasErrors,
  validateLandingPageForm,
  type FormErrors,
} from "@/lib/validation";

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {optional ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded-md border border-border bg-transparent p-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28"
        />
      </div>
    </div>
  );
}

export function GeneratorForm({
  design,
  onDesignChange,
  onGenerate,
  loading = false,
}: {
  design: LandingPageDesignInput;
  onDesignChange: (design: LandingPageDesignInput) => void;
  onGenerate: (input: LandingPageFormInput) => void;
  loading?: boolean;
}) {
  const [form, setForm] = React.useState<LandingPageFormInput>(EMPTY_FORM_INPUT);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function update<K extends keyof LandingPageFormInput>(
    key: K,
    value: LandingPageFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function patchDesign(patch: Partial<LandingPageDesignInput>) {
    onDesignChange({ ...design, ...patch });
  }

  function applyPreset(input: LandingPageFormInput) {
    setForm(input);
    setErrors({});
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const next: LandingPageDesignInput = { ...design, logoDataUrl: dataUrl };
      if (design.useLogoPalette) {
        try {
          const palette = await extractPalette(dataUrl, 3);
          next.primaryColor = palette[0] ?? design.primaryColor;
          next.secondaryColor = palette[1] ?? design.secondaryColor;
          next.accentColor = palette[2] ?? design.accentColor;
        } catch {
          /* keep manual colors */
        }
      }
      onDesignChange(next);
    } catch {
      setErrors((prev) => ({ ...prev }));
    }
  }

  async function toggleLogoPalette() {
    const next = !design.useLogoPalette;
    if (next && design.logoDataUrl) {
      try {
        const palette = await extractPalette(design.logoDataUrl, 3);
        patchDesign({
          useLogoPalette: true,
          primaryColor: palette[0] ?? design.primaryColor,
          secondaryColor: palette[1] ?? design.secondaryColor,
          accentColor: palette[2] ?? design.accentColor,
        });
        return;
      } catch {
        /* fall through to just toggle */
      }
    }
    patchDesign({ useLogoPalette: next });
  }

  function setPhotoUrl(index: number, value: string) {
    const photoUrls = [...design.photoUrls];
    while (photoUrls.length < 3) photoUrls.push("");
    photoUrls[index] = value;
    patchDesign({ photoUrls });
  }

  function handleGenerate() {
    const found = validateLandingPageForm(form);
    setErrors(found);
    if (hasErrors(found)) return;
    onGenerate(form);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Describe your landing page</CardTitle>
          <Badge variant="outline">AI ready</Badge>
        </div>
        <CardDescription>
          Fill in the details, or start from an example preset, then generate.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Example presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.input)}
                disabled={loading}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Field label="Business or product name" htmlFor="brandName" error={errors.brandName}>
          <Input
            id="brandName"
            placeholder="e.g. North End Coffee"
            value={form.brandName}
            onChange={(e) => update("brandName", e.target.value)}
            aria-invalid={Boolean(errors.brandName)}
            disabled={loading}
          />
        </Field>

        <Field label="What it does" htmlFor="whatItDoes" error={errors.whatItDoes}>
          <Textarea
            id="whatItDoes"
            placeholder="e.g. A neighborhood coffee shop serving fresh roasts and pastries."
            value={form.whatItDoes}
            onChange={(e) => update("whatItDoes", e.target.value)}
            aria-invalid={Boolean(errors.whatItDoes)}
            disabled={loading}
          />
        </Field>

        <Field label="Target audience" htmlFor="targetAudience" error={errors.targetAudience}>
          <Input
            id="targetAudience"
            placeholder="e.g. Local professionals and students"
            value={form.targetAudience}
            onChange={(e) => update("targetAudience", e.target.value)}
            aria-invalid={Boolean(errors.targetAudience)}
            disabled={loading}
          />
        </Field>

        <Field label="Main problem it solves" htmlFor="mainProblem" error={errors.mainProblem}>
          <Textarea
            id="mainProblem"
            placeholder="e.g. Nearby cafes are crowded and slow in the mornings."
            value={form.mainProblem}
            onChange={(e) => update("mainProblem", e.target.value)}
            aria-invalid={Boolean(errors.mainProblem)}
            disabled={loading}
          />
        </Field>

        <Field label="Main benefit" htmlFor="mainBenefit" error={errors.mainBenefit}>
          <Input
            id="mainBenefit"
            placeholder="e.g. Freshly roasted coffee you can order ahead."
            value={form.mainBenefit}
            onChange={(e) => update("mainBenefit", e.target.value)}
            aria-invalid={Boolean(errors.mainBenefit)}
            disabled={loading}
          />
        </Field>

        <Field label="Tone" htmlFor="tone" error={errors.tone}>
          <Select
            value={form.tone}
            onValueChange={(value) =>
              update("tone", value as LandingPageFormInput["tone"])
            }
            disabled={loading}
          >
            <SelectTrigger id="tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Primary call-to-action" htmlFor="primaryCTA" error={errors.primaryCTA}>
          <Input
            id="primaryCTA"
            placeholder="e.g. Order online"
            value={form.primaryCTA}
            onChange={(e) => update("primaryCTA", e.target.value)}
            aria-invalid={Boolean(errors.primaryCTA)}
            disabled={loading}
          />
        </Field>

        <Field label="Offer or pricing" htmlFor="offerOrPricing" optional>
          <Input
            id="offerOrPricing"
            placeholder="e.g. First order 10% off"
            value={form.offerOrPricing}
            onChange={(e) => update("offerOrPricing", e.target.value)}
            disabled={loading}
          />
        </Field>

        <Field label="Contact info" htmlFor="contactInfo" optional>
          <Input
            id="contactInfo"
            placeholder="e.g. hello@example.com"
            value={form.contactInfo}
            onChange={(e) => update("contactInfo", e.target.value)}
            disabled={loading}
          />
        </Field>

        <Separator />

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Design
          </span>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Logo</span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Upload logo
              </Button>
              {design.logoDataUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.logoDataUrl}
                    alt="Uploaded logo preview"
                    className="h-9 w-9 rounded-md border border-border object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => patchDesign({ logoDataUrl: undefined })}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                  <Button
                    type="button"
                    variant={design.useLogoPalette ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLogoPalette}
                    disabled={loading}
                  >
                    Use logo colors
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <ColorField
            label="Primary"
            value={design.primaryColor}
            onChange={(v) => patchDesign({ primaryColor: v })}
          />
          <ColorField
            label="Secondary"
            value={design.secondaryColor}
            onChange={(v) => patchDesign({ secondaryColor: v })}
          />
          <ColorField
            label="Accent"
            value={design.accentColor}
            onChange={(v) => patchDesign({ accentColor: v })}
          />

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground">Site theme</span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={design.siteTheme === "dark" ? "default" : "outline"}
                onClick={() => patchDesign({ siteTheme: "dark" })}
                disabled={loading}
              >
                Dark
              </Button>
              <Button
                type="button"
                size="sm"
                variant={design.siteTheme === "light" ? "default" : "outline"}
                onClick={() => patchDesign({ siteTheme: "light" })}
                disabled={loading}
              >
                Light
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Photo URLs <span className="text-xs font-normal text-muted-foreground">optional, up to 3</span>
            </span>
            {[0, 1, 2].map((i) => (
              <Input
                key={i}
                placeholder={`https://example.com/photo-${i + 1}.jpg`}
                value={design.photoUrls[i] ?? ""}
                onChange={(e) => setPhotoUrl(i, e.target.value)}
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate landing page"}
        </Button>
      </CardContent>
    </Card>
  );
}
