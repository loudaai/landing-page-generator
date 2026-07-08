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

import {
  EMPTY_FORM_INPUT,
  TONES,
  type LandingPageFormInput,
} from "@/lib/types";
import { PRESETS } from "@/lib/presets";
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

export function GeneratorForm({
  onGenerate,
  loading = false,
}: {
  onGenerate: (input: LandingPageFormInput) => void;
  loading?: boolean;
}) {
  const [form, setForm] = React.useState<LandingPageFormInput>(EMPTY_FORM_INPUT);
  const [errors, setErrors] = React.useState<FormErrors>({});

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

  function applyPreset(input: LandingPageFormInput) {
    setForm(input);
    setErrors({});
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
