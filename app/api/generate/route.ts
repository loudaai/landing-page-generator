import { NextResponse, type NextRequest } from "next/server";

import {
  buildBlueprintSystemPrompt,
  buildBlueprintRevisionPrompt,
  buildBlueprintUserPrompt,
} from "@/lib/prompts";
import { normalizePageBlueprint } from "@/lib/blueprint";
import { parseAiJson } from "@/lib/parse";
import { validateLandingPageForm } from "@/lib/validation";
import type { PageBlueprint, LandingPageFormInput } from "@/lib/types";

const MODEL = process.env.OPEN_GATEWAY_MODEL || "tencent/hy3:free";
const API_KEY = process.env.OPEN_GATEWAY_API_KEY;
const BASE_URL = process.env.OPEN_GATEWAY_BASE_URL || "https://opengateway.gitlawb.com/v1";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callOpenGateway(messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const upstream = await fetch(
      `${BASE_URL}/chat/completions`,
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
          messages,
          temperature: 0.7,
        }),
        signal: controller.signal,
      }
    );

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      throw new Error(
        `OpenGateway responded ${upstream.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`
      );
    }

    const json = await upstream.json();
    return String(json?.choices?.[0]?.message?.content ?? "");
  } finally {
    clearTimeout(timeout);
  }
}

function buildInput(raw: Record<string, unknown>): LandingPageFormInput {
  return {
    prompt: String(raw.prompt ?? "").trim(),
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
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OpenGateway API key is not configured on the server." },
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
  const input = buildInput(raw);

  if (!input.prompt) {
    const errors = validateLandingPageForm(input);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Please describe what you want to build." },
        { status: 400 }
      );
    }
  }

  const revisionInstruction = raw.revision
    ? String(raw.revision).trim()
    : undefined;
  const currentBlueprint = (raw.currentBlueprint ?? null) as PageBlueprint | null;

  const systemPrompt = buildBlueprintSystemPrompt();
  const userPrompt = revisionInstruction
    ? buildBlueprintRevisionPrompt(input, currentBlueprint, revisionInstruction)
    : buildBlueprintUserPrompt(input);

  const attempts: ChatMessage[][] = [
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    [
      { role: "system", content: `${systemPrompt}\n\nYour previous response was not valid JSON, or it was missing the required blueprint fields. Respond with ONLY the PageBlueprint JSON object and nothing else.` },
      { role: "user", content: userPrompt },
    ],
  ];

  let lastError = "AI generation timed out or failed. Please try again.";

  for (const messages of attempts) {
    let rawContent: string;
    try {
      rawContent = await callOpenGateway(messages);
    } catch (err) {
      lastError =
        err instanceof Error && err.message.startsWith("OpenGateway")
          ? "AI provider error. Please try again."
          : "AI generation timed out or failed. Please try again.";
      continue;
    }

    const parsed = parseAiJson(rawContent);
    if (
      parsed &&
      typeof parsed === "object" &&
      (("sections" in parsed) || ("meta" in parsed))
    ) {
      const blueprint = normalizePageBlueprint(parsed, input.prompt);
      return NextResponse.json({ blueprint });
    }
    lastError = "The AI returned an invalid blueprint. Retrying...";
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
