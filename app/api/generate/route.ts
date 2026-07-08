import { NextResponse, type NextRequest } from "next/server";

import {
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/prompts";
import { normalizeLandingPageContent, parseAiJson } from "@/lib/parse";
import { validateLandingPageForm } from "@/lib/validation";
import type { LandingPageFormInput } from "@/lib/types";

const MODEL = process.env.OPENROUTER_MODEL || "tencent/hy3:free";
const API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key is not configured on the server." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const input: LandingPageFormInput = {
    brandName: String(raw.brandName ?? ""),
    whatItDoes: String(raw.whatItDoes ?? ""),
    targetAudience: String(raw.targetAudience ?? ""),
    mainProblem: String(raw.mainProblem ?? ""),
    mainBenefit: String(raw.mainBenefit ?? ""),
    tone: (String(raw.tone ?? "Clear and practical") ||
      "Clear and practical") as LandingPageFormInput["tone"],
    primaryCTA: String(raw.primaryCTA ?? ""),
    offerOrPricing: String(raw.offerOrPricing ?? ""),
    contactInfo: String(raw.contactInfo ?? ""),
  };

  const errors = validateLandingPageForm(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const upstream = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": "AI Landing Page Generator",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserPrompt(input) },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 502 }
      );
    }

    const upstreamJson = await upstream.json();
    const rawContent =
      upstreamJson?.choices?.[0]?.message?.content ?? "";

    const parsed = parseAiJson(rawContent);
    const content = normalizeLandingPageContent(parsed);

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "AI generation timed out or failed. Please try again." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
