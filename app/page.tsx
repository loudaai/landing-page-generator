import { Badge } from "@/components/ui/badge";
import { GeneratorWorkspace } from "@/components/generator-workspace";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">
              AI Landing Page Generator
            </span>
            <Badge variant="outline">Beta</Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Powered by OpenRouter
          </span>
        </div>
      </header>

      <GeneratorWorkspace />

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>AI Landing Page Generator</span>
          <span>Free MVP · No account required</span>
        </div>
      </footer>
    </div>
  );
}
