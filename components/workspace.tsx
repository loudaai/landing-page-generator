"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { ExportActions } from "@/components/export-actions";
import { ChatComposer } from "@/components/chat-composer";
import { ClarifyingQuestions } from "@/components/clarifying-questions";
import type {
  ChatMessage,
  ClarifyingQuestion,
  GenerationStatus,
} from "@/lib/types";

type ViewMode = "desktop" | "tablet" | "mobile";

const VIEW_WIDTH: Record<ViewMode, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 animate-spin text-zinc-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 4 3 3 0 0 0 5 1V5a2 2 0 0 0-3-1Z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 4 3 3 0 0 1-5 1" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 7 17 4a3 3 0 0 1 4 4l-7 7-4-4Z" />
      <path d="M4 20 10 14" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function Workspace({
  generatedHtml,
  projectName,
  chat,
  status,
  questions,
  activeQuestion,
  onSelectAnswer,
  onCustomAnswer,
  onSkip,
  followUp,
  onFollowUpChange,
  onFollowUp,
  onRegenerate,
  onBack,
}: {
  generatedHtml: string;
  projectName: string;
  chat: ChatMessage[];
  status: GenerationStatus;
  questions: ClarifyingQuestion[];
  activeQuestion: number;
  onSelectAnswer: (value: string) => void;
  onCustomAnswer: (value: string) => void;
  onSkip: () => void;
  followUp: string;
  onFollowUpChange: (value: string) => void;
  onFollowUp: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}) {
  const [view, setView] = React.useState<ViewMode>("desktop");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chat, questions, activeQuestion, status]);

  const busy = status === "thinking" || status === "generating";
  const activeQuestionObj =
    status === "asking" && activeQuestion < questions.length
      ? questions[activeQuestion]
      : null;

  const liveStatus =
    status === "thinking"
      ? "Thinking through the page direction..."
      : status === "asking"
        ? "Asking a few questions..."
        : status === "generating"
          ? "Generating the landing page..."
          : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <aside className="flex w-[340px] flex-col border-r border-white/10 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <span className="text-sm font-semibold tracking-tight">p0r by Louda</span>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-zinc-500 hover:text-white"
          >
            New
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {chat.map((msg) => {
            if (msg.role === "system") return null;
            if (msg.role === "user") {
              return (
                <div
                  key={msg.id}
                  className="max-w-[90%] rounded-2xl rounded-bl-sm border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  {msg.content}
                </div>
              );
            }
            if (msg.status === "error") {
              return (
                <div key={msg.id} className="flex items-start gap-2 text-sm text-amber-400">
                  <AlertIcon />
                  <span>{msg.content}</span>
                </div>
              );
            }
            if (msg.kind === "summary") {
              return (
                <div
                  key={msg.id}
                  className="rounded-xl border border-white/10 bg-zinc-900/50 px-3 py-2.5 text-xs leading-relaxed text-zinc-300"
                >
                  <div className="mb-1.5 font-medium text-zinc-200">Summary</div>
                  {msg.content
                    .split("\n")
                    .slice(1)
                    .map((line, i) => (
                      <div key={i} className="text-zinc-400">
                        {line}
                      </div>
                    ))}
                </div>
              );
            }
            const Icon =
              msg.kind === "work" ? ToolIcon : msg.kind === "thought" ? BrainIcon : null;
            return (
              <div key={msg.id} className="flex items-start gap-2 text-sm text-zinc-400">
                {Icon ? <Icon /> : null}
                <span>{msg.content}</span>
              </div>
            );
          })}

          {liveStatus ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Spinner />
              <span>{liveStatus}</span>
            </div>
          ) : null}

          {activeQuestionObj ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-3">
              <ClarifyingQuestions
                question={activeQuestionObj}
                onSelect={onSelectAnswer}
                onCustom={onCustomAnswer}
                onSkip={onSkip}
              />
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/5 p-3">
          <ChatComposer
            value={followUp}
            onChange={onFollowUpChange}
            onSubmit={onFollowUp}
            placeholder="Ask for a change, then Enter..."
            disabled={busy}
            submitLabel="Send"
          />
        </div>
      </aside>

      <section className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{projectName || "Untitled"}</span>
            <Badge variant="outline" className="border-white/10 text-zinc-400">
              {status === "ready" ? "Preview" : liveStatus ?? "Ready"}
            </Badge>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 p-0.5">
            {(["desktop", "tablet", "mobile"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`rounded-md px-2.5 py-1 text-xs capitalize ${
                  view === mode ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <ExportActions html={generatedHtml} disabled={!generatedHtml} />
            <button
              type="button"
              onClick={onRegenerate}
              disabled={busy}
              title="Regenerate"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-auto bg-zinc-900">
          <div className="mx-auto h-full transition-all" style={{ maxWidth: VIEW_WIDTH[view] }}>
            {generatedHtml ? (
              <iframe
                srcDoc={generatedHtml}
                title="Generated landing page preview"
                className="h-full w-full border-0 bg-transparent"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-white" />
                  <p className="text-sm text-zinc-400">
                    {liveStatus ?? "Preparing your landing page..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
