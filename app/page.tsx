"use client";

import * as React from "react";

import { StartScreen } from "@/components/start-screen";
import { Workspace } from "@/components/workspace";
import { generateStandaloneHtmlFromBlueprint } from "@/lib/html-export";
import { normalizePageBlueprint } from "@/lib/blueprint";
import {
  DEFAULT_DESIGN,
  EMPTY_FORM_INPUT,
  type ChatMessage,
  type ClarifyingAnswer,
  type ClarifyingQuestion,
  type GenerationStatus,
  type PageBlueprint,
  type LandingPageDesignInput,
  type LandingPageFormInput,
} from "@/lib/types";
import type { FormErrors } from "@/lib/validation";
import { hasErrors, validateLandingPageForm } from "@/lib/validation";

type AppMode = "start" | "workspace";

const uid = () => Math.random().toString(36).slice(2);

export default function Home() {
  const [mode, setMode] = React.useState<AppMode>("start");
  const [prompt, setPrompt] = React.useState("");
  const [form, setForm] = React.useState<LandingPageFormInput>(EMPTY_FORM_INPUT);
  const [design, setDesign] = React.useState<LandingPageDesignInput>(DEFAULT_DESIGN);

  const [generatedHtml, setGeneratedHtml] = React.useState("");
  const [projectName, setProjectName] = React.useState("");

  const [status, setStatus] = React.useState<GenerationStatus>("idle");
  const [chat, setChat] = React.useState<ChatMessage[]>([]);
  const [questions, setQuestions] = React.useState<ClarifyingQuestion[]>([]);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = React.useState(0);
  const [context, setContext] = React.useState("");

  const [followUp, setFollowUp] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});

  const currentContentRef = React.useRef<PageBlueprint | null>(null);
  const formRef = React.useRef<LandingPageFormInput>(form);
  formRef.current = form;
  const thoughtStartRef = React.useRef(0);
  const workStartRef = React.useRef(0);

  function elapsedSince(ref: React.MutableRefObject<number>): number {
    if (!ref.current) return 1;
    return Math.max(1, Math.round((Date.now() - ref.current) / 1000));
  }

  function pushMessage(msg: Omit<ChatMessage, "id">) {
    setChat((c) => [...c, { ...msg, id: uid() }]);
  }

  function mergeInferred(inferred: Record<string, string | undefined>) {
    setForm((prev) => {
      const next = { ...prev };
      if (inferred.brandName) next.brandName = inferred.brandName;
      if (inferred.businessType) next.whatItDoes = inferred.businessType;
      if (inferred.targetAudience) next.targetAudience = inferred.targetAudience;
      if (inferred.primaryCTA) next.primaryCTA = inferred.primaryCTA;
      if (inferred.tone) next.tone = inferred.tone as LandingPageFormInput["tone"];
      return next;
    });
  }

  function finishThinking() {
    pushMessage({
      role: "assistant",
      content: `Thought for ${elapsedSince(thoughtStartRef)}s`,
      status: "done",
      kind: "thought",
    });
  }

  async function runGenerate(
    effectivePrompt: string,
    designArg: LandingPageDesignInput,
    revision?: string
  ) {
    workStartRef.current = Date.now();
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formRef.current,
          prompt: effectivePrompt,
          ...(revision
            ? { revision, currentBlueprint: currentContentRef.current }
            : {}),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.blueprint) {
        throw new Error(data?.error ?? "Generation failed. Please try again.");
      }
      const nextBlueprint = normalizePageBlueprint(data.blueprint);
      currentContentRef.current = nextBlueprint;
      setGeneratedHtml(generateStandaloneHtmlFromBlueprint(nextBlueprint, designArg));
      setProjectName(nextBlueprint.meta.brandName ?? "");
      setStatus("ready");
      pushMessage({
        role: "assistant",
        content: `Worked for ${elapsedSince(workStartRef)}s — Generated the landing page.`,
        status: "done",
        kind: "work",
      });
    } catch (err) {
      setStatus("error");
      const message =
        err instanceof Error ? err.message : "Generation failed. Please try again.";
      pushMessage({
        role: "assistant",
        content: message,
        status: "error",
      });
    }
  }

  async function runPlan() {
    setStatus("thinking");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json().catch(() => null);
      const result = data?.result;
      if (
        result?.shouldAskQuestions &&
        Array.isArray(result.questions) &&
        result.questions.length
      ) {
        if (result.inferred) mergeInferred(result.inferred);
        finishThinking();
        setQuestions(result.questions);
        setActiveQuestion(0);
        setStatus("asking");
        return;
      }
      if (result?.inferred) mergeInferred(result.inferred);
      finishThinking();
      runGenerate(prompt, design);
    } catch {
      finishThinking();
      runGenerate(prompt, design);
    }
  }

  function handleGenerate() {
    setErrors({});
    if (!prompt.trim()) {
      const found = validateLandingPageForm(form);
      if (hasErrors(found)) {
        setErrors(found);
        return;
      }
    }
    thoughtStartRef.current = Date.now();
    setMode("workspace");
    setQuestions([]);
    setAnswers({});
    setContext("");
    setGeneratedHtml("");
    currentContentRef.current = null;
    setStatus("thinking");
    pushMessage({ role: "user", content: prompt.trim() || "Build a landing page" });
    runPlan();
  }

  function handleAnswer(value: string) {
    const q = questions[activeQuestion];
    if (!q) return;
    const nextAnswers = { ...answers, [q.id]: value };
    setAnswers(nextAnswers);
    setFollowUp("");

    if (activeQuestion + 1 < questions.length) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      submitAnswers(nextAnswers);
    }
  }

  function buildAnswersText(ans: Record<string, string>): string {
    return questions
      .map((q) => {
        const a = ans[q.id];
        return a ? `${q.question}\n${a}` : "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  function buildSummary(ans: Record<string, string>): string {
    const lines: string[] = [];
    for (const q of questions) {
      const a = ans[q.id];
      if (a) lines.push(`${q.question.replace(/\?+$/, "")}: ${a}`);
    }
    return lines.join("\n");
  }

  function submitAnswers(ans: Record<string, string> = answers) {
    const answersText = buildAnswersText(ans);
    const fullPrompt = [prompt, answersText].filter(Boolean).join("\n\n");
    const summary: ClarifyingAnswer[] = questions
      .filter((q) => ans[q.id])
      .map((q) => ({ questionId: q.id, question: q.question, answer: ans[q.id] }));
    setContext(answersText);
    setQuestions([]);
    setActiveQuestion(0);
    if (summary.length) {
      pushMessage({
        role: "assistant",
        content: buildSummary(ans),
        status: "done",
        kind: "summary",
      });
    }
    runGenerate(fullPrompt, design);
  }

  function skipQuestions() {
    setQuestions([]);
    setStatus("generating");
    runGenerate(prompt, design);
  }

  function handleRegenerate() {
    const fullPrompt = [prompt, context].filter(Boolean).join("\n\n");
    runGenerate(fullPrompt, design);
  }

  function handleFollowUp() {
    const text = followUp.trim();
    if (!text) return;
    setFollowUp("");
    pushMessage({ role: "user", content: text });
    const nextContext = [context, text].filter(Boolean).join("\n\n");
    setContext(nextContext);
    setStatus("generating");
    runGenerate(
      [prompt, nextContext].filter(Boolean).join("\n\n"),
      design,
      text
    );
  }

  if (mode === "workspace") {
    return (
      <Workspace
        generatedHtml={generatedHtml}
        projectName={projectName}
        chat={chat}
        status={status}
        questions={questions}
        activeQuestion={activeQuestion}
        onSelectAnswer={handleAnswer}
        onAnswerCustom={handleAnswer}
        onSkip={skipQuestions}
        followUp={followUp}
        onFollowUpChange={setFollowUp}
        onFollowUp={handleFollowUp}
        onRegenerate={handleRegenerate}
        onBack={() => setMode("start")}
      />
    );
  }

  return (
    <StartScreen
      prompt={prompt}
      onPromptChange={setPrompt}
      design={design}
      onDesignChange={setDesign}
      errors={errors}
      loading={false}
      onGenerate={handleGenerate}
    />
  );
}
