"use client";

import * as React from "react";

import { StartScreen } from "@/components/start-screen";
import { Workspace } from "@/components/workspace";
import { generateStandaloneHtml } from "@/lib/html-export";
import {
  DEFAULT_DESIGN,
  EMPTY_FORM_INPUT,
  type ChatMessage,
  type ClarifyingQuestion,
  type GenerationStatus,
  type LandingPageContent,
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

  async function runGenerate(effectivePrompt: string) {
    setStatus("generating");
    pushMessage({
      role: "assistant",
      content: "Writing the landing page copy...",
      status: "working",
    });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, prompt: effectivePrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data?.content) {
        throw new Error(data?.error ?? "Generation failed. Please try again.");
      }
      const nextContent = data.content as LandingPageContent;
      setGeneratedHtml(generateStandaloneHtml(nextContent, design));
      setProjectName(nextContent.brandName ?? "");
      setStatus("ready");
      pushMessage({
        role: "assistant",
        content: "Ready. You can copy or download the HTML.",
        status: "done",
      });
    } catch {
      setStatus("error");
      pushMessage({
        role: "assistant",
        content: "Something went wrong. Please try Regenerate.",
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
      const data = await res.json();
      const result = data?.result;
      if (result?.shouldAskQuestions && Array.isArray(result.questions) && result.questions.length) {
        setQuestions(result.questions);
        setActiveQuestion(0);
        if (result.inferred) mergeInferred(result.inferred);
        setStatus("asking");
        pushMessage({
          role: "assistant",
          content: "I need a few details before building.",
          status: "working",
        });
        return;
      }
      if (result?.inferred) mergeInferred(result.inferred);
      runGenerate(prompt);
    } catch {
      runGenerate(prompt);
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
    setMode("workspace");
    setQuestions([]);
    setAnswers({});
    setContext("");
    setGeneratedHtml("");
    setStatus("thinking");
    pushMessage({ role: "user", content: prompt.trim() || "Build a landing page" });
    pushMessage({
      role: "assistant",
      content: "Thinking through the page direction...",
      status: "working",
    });
    runPlan();
  }

  function handleAnswer(value: string) {
    const q = questions[activeQuestion];
    if (!q) return;
    const nextAnswers = { ...answers, [q.id]: value };
    setAnswers(nextAnswers);
    pushMessage({ role: "user", content: value });

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

  function submitAnswers(ans: Record<string, string> = answers) {
    const answersText = buildAnswersText(ans);
    const fullPrompt = [prompt, answersText].filter(Boolean).join("\n\n");
    setContext(answersText);
    setQuestions([]);
    setActiveQuestion(0);
    setStatus("generating");
    pushMessage({
      role: "assistant",
      content: "Got it. Building your landing page...",
      status: "working",
    });
    runGenerate(fullPrompt);
  }

  function skipQuestions() {
    setQuestions([]);
    setStatus("generating");
    pushMessage({
      role: "assistant",
      content: "Building your landing page...",
      status: "working",
    });
    runGenerate(prompt);
  }

  function handleRegenerate() {
    const fullPrompt = [prompt, context].filter(Boolean).join("\n\n");
    setStatus("generating");
    pushMessage({
      role: "assistant",
      content: "Regenerating the landing page...",
      status: "working",
    });
    runGenerate(fullPrompt);
  }

  function handleFollowUp() {
    const text = followUp.trim();
    if (!text) return;
    setFollowUp("");
    pushMessage({ role: "user", content: text });
    const nextContext = [context, text].filter(Boolean).join("\n\n");
    setContext(nextContext);
    setStatus("generating");
    pushMessage({
      role: "assistant",
      content: "Updating the landing page...",
      status: "working",
    });
    runGenerate([prompt, nextContext].filter(Boolean).join("\n\n"));
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
        onCustomAnswer={handleAnswer}
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
