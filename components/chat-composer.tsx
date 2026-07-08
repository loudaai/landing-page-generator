"use client";

import * as React from "react";

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask p0r to build...",
  plusContent,
  disabled = false,
  submitLabel = "Generate",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  plusContent?: React.ReactNode;
  disabled?: boolean;
  submitLabel?: string;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  function resize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  React.useEffect(resize, [value]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim().length > 0) onSubmit();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {plusContent ? (
        <div
          className={`absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950 p-1 shadow-2xl ${
            menuOpen ? "block" : "hidden"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          {plusContent}
        </div>
      ) : null}

      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-zinc-900 p-2">
        <button
          type="button"
          onClick={() => plusContent && setMenuOpen((v) => !v)}
          disabled={disabled || !plusContent}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
          aria-label="Add options"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="min-h-[48px] max-h-[160px] flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          className="flex h-9 flex-none items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-black disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
