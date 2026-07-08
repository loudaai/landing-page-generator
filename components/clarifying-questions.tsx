"use client";

import * as React from "react";

import type { ClarifyingQuestion } from "@/lib/types";

export function ClarifyingQuestions({
  question,
  onSelect,
  onCustom,
  onSkip,
}: {
  question: ClarifyingQuestion;
  onSelect: (value: string) => void;
  onCustom: (value: string) => void;
  onSkip: () => void;
}) {
  const [custom, setCustom] = React.useState("");

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm text-zinc-200">{question.question}</p>
      <div className="flex flex-col gap-1.5">
        {question.options.map((option) => {
          const recommended = question.recommendedOption === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-left text-sm text-zinc-300 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
            >
              {option}
              {recommended ? (
                <span className="ml-1 text-zinc-500">· recommended</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {question.allowCustomAnswer ? (
        <div className="mt-0.5 flex items-center gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && custom.trim()) {
                e.preventDefault();
                onCustom(custom.trim());
              }
            }}
            placeholder="Other..."
            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => custom.trim() && onCustom(custom.trim())}
            disabled={!custom.trim()}
            className="flex-none rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSkip}
        className="mt-0.5 self-start text-xs text-zinc-500 hover:text-zinc-300"
      >
        Skip
      </button>
    </div>
  );
}
