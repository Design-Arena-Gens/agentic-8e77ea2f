"use client";

import { useMemo, useState } from "react";
import { GenerationResult } from "../../lib/pipeline";

export interface AutomationResultsProps {
  result: GenerationResult | null;
}

const tabs = [
  { id: "timeline", label: "Timeline" },
  { id: "voice", label: "Voiceover" },
  { id: "visuals", label: "Visuals" },
  { id: "music", label: "Music" },
  { id: "seo", label: "SEO" },
  { id: "upload", label: "Upload" },
];

export function AutomationResults({ result }: AutomationResultsProps) {
  const [activeTab, setActiveTab] = useState("timeline");

  const statusMetrics = useMemo(() => {
    if (!result) return null;

    const totalMs = result.steps.reduce((acc, step) => acc + step.durationMs, 0);
    const completed = result.steps.filter((step) => step.status === "completed").length;

    return {
      totalMs,
      completed,
    };
  }, [result]);

  if (!result) {
    return (
      <section className="flex h-full min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 text-center">
        <div className="max-w-sm space-y-2">
          <p className="text-sm font-semibold text-slate-300">Awaiting a script</p>
          <p className="text-sm text-slate-500">
            Once you generate, the full automation blueprint appears with timeline, voice, visuals,
            music, SEO, and upload orchestration.
          </p>
        </div>
      </section>
    );
  }

  const createdAt = new Date(result.createdAt).toLocaleString();

  return (
    <section className="space-y-4 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/80 shadow-lg shadow-slate-950/40">
      <header className="border-b border-slate-800/80 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Automation Blueprint</h2>
            <p className="text-xs text-slate-500">Generated {createdAt}</p>
          </div>
          {statusMetrics && (
            <div className="flex items-center gap-4 text-xs">
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400">
                {statusMetrics.completed}/{result.steps.length} stages complete
              </span>
              <span className="text-slate-400">{Math.round(statusMetrics.totalMs / 1000)}s total runtime</span>
            </div>
          )}
        </div>
        <ol className="mt-4 flex flex-wrap gap-3 text-xs">
          {result.steps.map((step) => (
            <li
              key={step.id}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1"
            >
              <span
                className={`block size-2 rounded-full ${
                  step.status === "completed" ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              <span className="font-medium text-slate-200">{step.name}</span>
              <span className="text-slate-500">{step.durationMs}ms</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="px-6">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500 text-white shadow shadow-indigo-500/40"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pb-6">
        {activeTab === "timeline" && <TimelineView result={result} />}
        {activeTab === "voice" && <VoiceView result={result} />}
        {activeTab === "visuals" && <VisualsView result={result} />}
        {activeTab === "music" && <MusicView result={result} />}
        {activeTab === "seo" && <SeoView result={result} />}
        {activeTab === "upload" && <UploadView result={result} />}
      </div>
    </section>
  );
}

function TimelineView({ result }: { result: GenerationResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="text-sm text-slate-300">
          Total runtime{" "}
          <span className="font-semibold text-white">{Math.round(result.timeline.totalDuration)}s</span>{" "}
          across {result.timeline.scenes.length} scenes. Scenes sync with AI voiceover, captions, and
          b-roll automatically.
        </p>
      </div>
      <div className="space-y-3">
        {result.timeline.scenes.map((scene) => (
          <article
            key={scene.id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow shadow-slate-950/30"
          >
            <header className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-300">{scene.id}</span>
              <span>
                {scene.start}s → {scene.end}s
              </span>
            </header>
            <h3 className="mt-2 text-sm font-semibold text-white">{scene.headline}</h3>
            <p className="mt-2 text-sm text-slate-300">{scene.voiceLine}</p>
            <p className="mt-3 text-xs text-slate-400">Visual directive: {scene.visual}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function VoiceView({ result }: { result: GenerationResult }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-4 text-sm text-indigo-100">
        <span className="font-semibold text-white">Voice ID · {result.voiceTrack.voiceId}</span>
        <span className="rounded-full border border-indigo-400/60 bg-indigo-400/10 px-3 py-1 text-xs">
          {result.voiceTrack.style}
        </span>
        <span>{Math.round(result.voiceTrack.durationSeconds)}s duration</span>
        <a
          href={result.voiceTrack.downloadUrl}
          className="ml-auto text-xs font-semibold text-indigo-300 underline-offset-4 hover:text-white hover:underline"
        >
          Download synthesized track
        </a>
      </div>
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Transcript segments</p>
        <div className="space-y-2 text-sm text-slate-200">
          {result.voiceTrack.transcript.map((line) => (
            <p key={line} className="rounded-lg bg-slate-900/60 px-3 py-2">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualsView({ result }: { result: GenerationResult }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {result.visuals.map((asset, index) => (
        <article
          key={`${asset.source}-${index}`}
          className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow shadow-slate-950/30"
        >
          <header className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-indigo-200">{asset.type}</span>
            <span>
              {asset.cueIn}s → {asset.cueOut}s
            </span>
          </header>
          <p className="mt-3 text-sm font-semibold text-white">{asset.description}</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            {asset.overlays.map((overlay) => (
              <li key={overlay}>• {overlay}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Source: {asset.source}</p>
        </article>
      ))}
    </div>
  );
}

function MusicView({ result }: { result: GenerationResult }) {
  const wave = useMemo(() => {
    const steps = Math.max(12, Math.ceil(result.timeline.totalDuration / 8));
    return Array.from({ length: steps }, (_, index) => ({
      height: 20 + Math.abs(Math.sin(index / 1.4)) * 60,
    }));
  }, [result.timeline.totalDuration]);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
        <span className="rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Track · {result.music.trackId}
        </span>
        <span>{result.music.mood}</span>
        <span>{result.music.bpm} BPM</span>
        <span>
          {result.music.cueIn}s → {result.music.cueOut}s
        </span>
        <p className="ml-auto text-xs text-slate-400">{result.music.mixNotes}</p>
      </div>
      <div className="flex h-32 items-end gap-1 rounded-lg border border-slate-900 bg-slate-900/80 p-4">
        {wave.map((bar, index) => (
          <span
            key={index}
            style={{ height: `${bar.height}px` }}
            className="w-2 flex-1 rounded-t-full bg-gradient-to-t from-indigo-500/20 to-indigo-400/80"
          />
        ))}
      </div>
    </div>
  );
}

function SeoView({ result }: { result: GenerationResult }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-5 text-sm text-indigo-100 shadow shadow-indigo-500/20">
        <h3 className="text-sm font-semibold text-white">Title</h3>
        <p className="mt-2 text-base font-semibold text-white">{result.seo.title}</p>
        <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-200">
          Call to action
        </h4>
        <p className="mt-1 text-sm text-indigo-100">{result.seo.callToAction}</p>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-200">
        <h3 className="text-sm font-semibold text-white">Description</h3>
        <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-900/70 p-3 text-xs text-slate-300">
          {result.seo.description}
        </pre>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold text-white">Tags & Keywords</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {result.seo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-medium text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Chapters</h4>
          <ul className="mt-2 space-y-2 text-xs text-slate-300">
            {result.seo.chapters.map((chapter) => (
              <li key={chapter.timestamp} className="flex justify-between">
                <span>{chapter.timestamp}</span>
                <span className="max-w-[200px] text-right">{chapter.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold text-white">Thumbnail Briefs</h3>
        <ol className="mt-3 space-y-3 text-sm text-slate-200">
          {result.seo.thumbnailConcepts.map((concept, index) => (
            <li key={concept} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
              <span className="text-xs font-semibold text-slate-500">Concept {index + 1}</span>
              <p className="mt-1">{concept}</p>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}

function UploadView({ result }: { result: GenerationResult }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-sm text-emerald-100">
        <h3 className="text-sm font-semibold text-white">Publishing</h3>
        <dl className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="uppercase tracking-wide text-emerald-200">Visibility</dt>
            <dd className="font-semibold text-white">{result.upload.visibility}</dd>
          </div>
          {result.upload.scheduledFor && (
            <div className="flex justify-between">
              <dt className="uppercase tracking-wide text-emerald-200">Scheduled</dt>
              <dd>{new Date(result.upload.scheduledFor).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </article>

      <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-200">
        <h3 className="text-sm font-semibold text-white">Automation Hooks</h3>
        <ul className="mt-3 space-y-2 text-xs text-slate-300">
          {result.upload.endScreens.map((item) => (
            <li key={item}>• End screen: {item}</li>
          ))}
          {result.upload.cards.map((item) => (
            <li key={item}>• Card: {item}</li>
          ))}
        </ul>
      </article>

      <article className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
        <h3 className="text-sm font-semibold text-white">Playlist Targeting</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {result.upload.playlistSuggestions.map((playlist) => (
            <span
              key={playlist}
              className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-slate-200"
            >
              {playlist}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
