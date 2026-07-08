import { NextResponse, type NextRequest } from "next/server";

import {
  buildPlannerSystemPrompt,
  buildPlannerUserPrompt,
} from "@/lib/prompts";
import { parseAiJson } from "@/lib/parse";
import type { ClarifyingQuestion, PlanningResult } from "@/lib/types";

const MODEL = process.env.OPENROUTER_MODEL || "tencent/hy3:free";
const API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function extractBrand(prompt: string): string | undefined {
  const match = prompt.match(/(?:called|for)\s+([A-Z][\w&.'-]+(?:\s+[A-Z][\w&.'-]+){0,2})/);
  return match?.[1]?.trim();
}

function inferIndustry(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/auto|vehicle|car|repair|mechanic|garage|tire|motor|fleet|brake/.test(p))
    return "auto";
  if (/gym|workout|fitness|exercise|training|wellness|habit|routine/.test(p))
    return "fitness";
  if (/study|student|learn|course|school|exam|education|tutoring|quiz/.test(p))
    return "education";
  if (/app|software|saas|ai tool|platform|dashboard|api|startup|productivity/.test(p))
    return "saas";
  if (/coffee|restaurant|cafe|shop|store|bakery|menu|local/.test(p))
    return "local-business";
  if (/portfolio|designer|photographer|artist|writer|creative/.test(p))
    return "portfolio";
  if (/agency|freelance|studio|consult/.test(p)) return "agency";
  if (/personal brand|coach|creator|influencer/.test(p)) return "personal-brand";
  return "default";
}

function localPlan(prompt: string): PlanningResult {
  const brand = extractBrand(prompt);
  const visualStyle = inferIndustry(prompt);

  const questions: ClarifyingQuestion[] = [
    {
      id: "cta",
      question: "What should visitors do first?",
      recommendedOption: "Get in touch",
      options: [
        "Get in touch",
        "Book a call",
        "Request a quote",
        "Shop now",
        "Sign up",
      ],
      allowCustomAnswer: true,
    },
    {
      id: "audience",
      question: "Who is the page mainly for?",
      recommendedOption: "New customers",
      options: [
        "New customers",
        "Existing customers",
        "Local community",
        "Other businesses",
        "Other",
      ],
      allowCustomAnswer: true,
    },
    {
      id: "offer",
      question: "What offer or service should be emphasized?",
      recommendedOption: "Your main service",
      options: [
        "Your main service",
        "A special offer",
        "A free consultation",
        "A featured product",
        "Other",
      ],
      allowCustomAnswer: true,
    },
    {
      id: "tone",
      question: "What tone should the page use?",
      recommendedOption: "Clear and practical",
      options: [
        "Clear and practical",
        "Friendly and casual",
        "Professional and direct",
        "Premium but not hypey",
        "Other",
      ],
      allowCustomAnswer: true,
    },
  ];

  return {
    shouldAskQuestions: true,
    confidence: "low",
    inferred: {
      brandName: brand,
      businessType: undefined,
      primaryCTA: "Get in touch",
      tone: "Clear and practical",
      visualStyle,
    },
    questions,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const prompt = String(raw.prompt ?? "").trim();

  if (!prompt) {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ result: localPlan(prompt) });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
          { role: "system", content: buildPlannerSystemPrompt() },
          { role: "user", content: buildPlannerUserPrompt(prompt) },
        ],
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json({ result: localPlan(prompt) });
    }

    const upstreamJson = await upstream.json();
    const rawContent = upstreamJson?.choices?.[0]?.message?.content ?? "";
    const parsed = parseAiJson(rawContent) as Partial<PlanningResult>;

    const questions: ClarifyingQuestion[] = Array.isArray(parsed.questions)
      ? parsed.questions
          .filter((q) => Boolean(q) && typeof q === "object")
          .slice(0, 4)
          .map((q, i) => ({
            id: String(q.id ?? `q${i}`),
            question: String(q.question ?? ""),
            recommendedOption: q.recommendedOption ? String(q.recommendedOption) : undefined,
            options: Array.isArray(q.options)
              ? q.options.filter((o) => typeof o === "string").map(String)
              : [],
            allowCustomAnswer: q.allowCustomAnswer !== false,
          }))
      : [];

    const result: PlanningResult = {
      shouldAskQuestions: Boolean(parsed.shouldAskQuestions) && questions.length > 0,
      confidence: (parsed.confidence as PlanningResult["confidence"]) || "medium",
      inferred: (parsed.inferred as PlanningResult["inferred"]) ?? {},
      questions,
    };

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ result: localPlan(prompt) });
  } finally {
    clearTimeout(timeout);
  }
}
