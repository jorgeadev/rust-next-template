"use client";

import { useSyncExternalStore, useState, type FormEvent } from "react";
import { greet, isTauri } from "@/lib/ipc";

type Phase = "idle" | "pending" | "done" | "error";

const subscribeToBridge = () => () => {};
const serverBridge = () => false;

export function GreetDemo() {
  const [name, setName] = useState("Ada");
  const [phase, setPhase] = useState<Phase>("idle");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const bridge = useSyncExternalStore(subscribeToBridge, isTauri, serverBridge);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("pending");
    setReply("");
    setError("");

    try {
      setReply(await greet(name));
      setPhase("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setPhase("error");
    }
  }

  const call = `invoke("greet", { name: ${JSON.stringify(name)} })`;

  return (
    <section aria-label="Live IPC demo" className="mt-14">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)]">
        <article className="border border-line bg-panel p-6">
          <p className="font-mono text-xs text-rust">src-tauri/</p>
          <h2 className="mt-2 font-mono text-sm font-medium">rust core</h2>
          <p className="mt-3 max-w-[46ch] text-sm leading-6 text-muted">
            Owns the window and reaches the operating system. Anything the
            browser cannot do lives here, exposed as a plain function marked
            with <code className="font-mono text-xs">#[tauri::command]</code>.
          </p>
        </article>

        <div
          aria-hidden="true"
          className="flex h-12 items-center justify-center md:h-auto"
        >
          <div className="h-full border-l border-dashed border-line md:hidden" />
          <svg
            viewBox="0 0 120 40"
            className="hidden h-10 w-[120px] md:block"
            fill="none"
          >
            <line
              x1="10"
              y1="20"
              x2="110"
              y2="20"
              className="stroke-line"
              strokeWidth="1"
            />
            <path
              d="M10 20 H110"
              className={`signal stroke-rust ${phase === "pending" ? "signal-active" : ""}`}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="10" cy="20" r="2.5" className="fill-rust" />
            <circle cx="110" cy="20" r="2.5" className="fill-ink" />
          </svg>
        </div>

        <article className="border border-line bg-panel p-6">
          <p className="font-mono text-xs text-muted">src/app/</p>
          <h2 className="mt-2 font-mono text-sm font-medium">next.js ui</h2>
          <p className="mt-3 max-w-[46ch] text-sm leading-6 text-muted">
            Exports to static HTML, CSS and JS at build time and runs in the
            system webview. It calls the core with{" "}
            <code className="font-mono text-xs">invoke()</code> and renders
            what comes back.
          </p>
        </article>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-wrap items-stretch gap-2"
      >
        <label
          htmlFor="greet-name"
          className="flex flex-1 items-center border border-line bg-panel focus-within:border-rust sm:flex-none"
        >
          <span className="border-r border-line px-3 py-2.5 font-mono text-xs text-muted">
            name
          </span>
          <input
            id="greet-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent px-3 py-2.5 font-mono text-sm outline-none sm:w-44"
          />
        </label>
        <button
          type="submit"
          disabled={!bridge || phase === "pending"}
          className="bg-ink px-4 py-2.5 font-mono text-xs text-paper transition-colors hover:bg-rust disabled:cursor-not-allowed disabled:opacity-40"
        >
          {phase === "pending" ? "invoking…" : "invoke greet"}
        </button>
      </form>

      <p className="mt-4 border border-line bg-panel px-4 py-3 font-mono text-[13px] leading-6">
        <span className="text-muted">{call}</span>
        <span className="mx-2 text-muted">&rarr;</span>
        {phase === "done" && <span className="text-rust reveal">{reply}</span>}
        {phase === "error" && (
          <span className="text-rust reveal">ipc error: {error}</span>
        )}
        {phase === "pending" && <span className="text-muted">waiting…</span>}
        {phase === "idle" && <span className="text-muted">awaiting call</span>}
      </p>

      {bridge === false && (
        <p className="mt-3 max-w-[80ch] text-sm leading-6 text-muted">
          This preview is running in a browser, so the Rust bridge is offline.
          Run{" "}
          <code className="border border-line bg-panel px-1.5 py-0.5 font-mono text-xs">
            npm run tauri:dev
          </code>{" "}
          to open the desktop window and make the call.
        </p>
      )}
    </section>
  );
}
