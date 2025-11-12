"use client";

import { useMemo } from "react";
import { ScriptInput, ProductionPreset } from "@/lib/pipeline";

const PRESETS: { value: ProductionPreset; label: string; summary: string }[] = [
  {
    value: "faceless-news",
    label: "Faceless Newsroom",
    summary: "Fast-paced bulletin style with animated headlines.",
  },
  {
    value: "tech-review",
    label: "Tech Review",
    summary: "Spec-driven visuals, energetic delivery, tech overlays.",
  },
  {
    value: "motivational",
    label: "Motivational Spotlight",
    summary: "Epic gradients, quote overlays, cinematic punch-ins.",
  },
  {
    value: "educational",
    label: "Explainer Classroom",
    summary: "Clean diagrams, animated annotations, calm pace.",
  },
  {
    value: "storytelling",
    label: "Narrative Story",
    summary: "Soft cinematic b-roll, parallax, narrative structure.",
  },
];

export interface ScriptFormProps {
  values: ScriptInput;
  onChange: (payload: ScriptInput) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export function ScriptForm({ values, onChange, onSubmit, isGenerating }: ScriptFormProps) {
  const isReady = useMemo(() => values.script.trim().length > 40, [values.script]);

  return (
    <section className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <header className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold text-white">Script Ingestion</h2>
        <p className="text-sm text-slate-400">
          Drop your script and production targets. The agent will synthesize voice, visuals, music,
          and SEO in one pass.
        </p>
      </header>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="channelName">
            Channel name
          </label>
          <input
            id="channelName"
            value={values.channelName}
            onChange={(event) =>
              onChange({
                ...values,
                channelName: event.target.value,
              })
            }
            placeholder="Automation Insights"
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="audience">
            Target audience
          </label>
          <input
            id="audience"
            value={values.targetAudience}
            onChange={(event) =>
              onChange({
                ...values,
                targetAudience: event.target.value,
              })
            }
            placeholder="Solo content creators scaling production"
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Production persona</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESETS.map((preset) => {
              const active = values.persona === preset.value;
              return (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() =>
                    onChange({
                      ...values,
                      persona: preset.value,
                    })
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-indigo-400/80 bg-indigo-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <p className="text-sm font-medium">{preset.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{preset.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="duration">
              Target duration
            </label>
            <select
              id="duration"
              value={values.desiredLength}
              onChange={(event) =>
                onChange({
                  ...values,
                  desiredLength: event.target.value as ScriptInput["desiredLength"],
                })
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="short">Short (4-6 minutes)</option>
              <option value="medium">Medium (6-9 minutes)</option>
              <option value="long">Long (10+ minutes)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="publishDate">
              Publish schedule
            </label>
            <input
              id="publishDate"
              type="datetime-local"
              value={values.publishDate}
              onChange={(event) =>
                onChange({
                  ...values,
                  publishDate: event.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="script">
            Script
          </label>
          <textarea
            id="script"
            rows={12}
            value={values.script}
            onChange={(event) =>
              onChange({
                ...values,
                script: event.target.value,
              })
            }
            placeholder="Paste your final narration script here..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <p className="mt-1 text-xs text-slate-500">
            Minimum 40 characters. Multi-paragraph scripts automatically generate scene cuts.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Voice, visuals, music, captions, SEO, and upload automations deploy in under 30 seconds.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isReady || isGenerating}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition enabled:hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isGenerating ? "Synthesizing…" : "Generate Automation"}
        </button>
      </div>
    </section>
  );
}
