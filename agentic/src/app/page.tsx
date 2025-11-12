"use client";

import { useMemo, useState } from "react";
import { ScriptForm } from "../components/form/script-form";
import { AutomationResults } from "../components/results/automation-results";
import { generateVideoPlan, GenerationResult, ScriptInput } from "../lib/pipeline";

const STARTER_SCRIPT = [
  "If you could publish a high-quality YouTube video every day without touching an editor, how quickly would your channel grow?",
  "Today we're deploying an AI video automation agent capable of transforming raw scripts into fully-edited uploads. It understands your tone, assembles visuals, and handles SEO.",
  "You'll see how the agent interprets narration to build a b-roll plan, sync captions, and even stage the upload on YouTube Studio with optimized metadata.",
  "Stick around to watch the workflow in action and grab the blueprint to automate your own content machine.",
].join(" ");

const INITIAL_INPUT: ScriptInput = {
  script: STARTER_SCRIPT,
  persona: "tech-review",
  targetAudience: "AI-first YouTube creators scaling production",
  desiredLength: "medium",
  publishDate: "",
  channelName: "Agentic Automation Lab",
};

export default function Home() {
  const [form, setForm] = useState<ScriptInput>(INITIAL_INPUT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scriptChars = useMemo(() => form.script.trim().length, [form.script]);

  const handleSubmit = () => {
    try {
      setIsGenerating(true);
      setError(null);
      const output = generateVideoPlan(form);
      setResult(output);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center sm:space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-200">
            <span className="size-2 rounded-full bg-indigo-400" />
            Agentic Automation Suite
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            AI YouTube Video Automation Agent
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-400 sm:text-base">
            Paste your script once. The agent synthesizes neural voice, maps dynamic visuals, layers
            background music, generates SEO metadata, and queues the upload to YouTube without human
            intervention.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>{scriptChars} characters ingested</span>
            <span className="text-slate-700">|</span>
            <span>Export-ready in under 30 seconds</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ScriptForm values={form} onChange={setForm} onSubmit={handleSubmit} isGenerating={isGenerating} />
          <AutomationResults result={result} />
        </div>
      </section>
    </main>
  );
}
