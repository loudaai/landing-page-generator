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

const STATUS_LABEL: Record<GenerationStatus, string> = {
  idle: "Ready",
  thinking: "Thinking through the page direction...",
  asking: "I need a few details before building.",
  generating: "Writing the landing page copy...",
  ready: "Ready. You can copy or download the HTML.",
  error: "Something went wrong. Try again.",
};

function ThoughtIcon() {
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
  }, [chat, questions, activeQuestion]);

  const busy = status === "thinking" || status === "generating";
  const activeQuestionObj =
    status === "asking" && activeQuestion < questions.length
      ? questions[activeQuestion]
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
                  className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                >
                  {msg.content}
                </div>
              );
            }
            if (msg.status === "thinking" || msg.status === "working") {
              return (
                <div key={msg.id} className="flex items-center gap-2 text-xs text-zinc-500">
                  <ThoughtIcon />
                  <span>Thinking...</span>
                </div>
              );
            }
            return (
              <div key={msg.id} className="text-sm leading-relaxed text-zinc-300">
                {msg.content}
              </div>
            );
          })}

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
              {status === "ready" ? "Preview" : STATUS_LABEL[status]}
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
                  <p className="text-sm text-zinc-400">{STATUS_LABEL[status]}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
