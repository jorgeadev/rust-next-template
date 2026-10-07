import { GreetDemo } from "@/components/greet-demo";

const repo = "https://github.com/jorgeadev/rust-next-template";

const commands = [
	{
		command: "pnpm tauri:dev",
		role: "Run the desktop app. Edits to the UI or the Rust core reload in place.",
	},
	{
		command: "pnpm tauri:build",
		role: "Bundle an installer for this operating system into src-tauri/target/release/bundle/.",
	},
	{
		command: "pnpm dev",
		role: "Preview the UI in a browser. The Rust bridge is unavailable there.",
	},
	{
		command: "pnpm check",
		role: "Format, lint, and typecheck the frontend.",
	},
	{
		command: "pnpm rust:test",
		role: "Run the Rust unit tests.",
	},
	{
		command: "pnpm rust:clippy",
		role: "Lint the Rust core, with warnings treated as errors.",
	},
];

export default function Home() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 sm:px-10">
			<header className="flex items-center justify-between gap-4 border-b border-line py-5">
				<span className="font-mono text-sm">rust-next-template</span>
				<nav className="flex items-center gap-5 font-mono text-xs text-muted">
					<a
						href="https://v2.tauri.app/"
						target="_blank"
						rel="noreferrer"
						className="transition-colors hover:text-rust"
					>
						tauri
					</a>
					<a
						href="https://nextjs.org/docs"
						target="_blank"
						rel="noreferrer"
						className="transition-colors hover:text-rust"
					>
						next.js
					</a>
					<a
						href={repo}
						target="_blank"
						rel="noreferrer"
						className="transition-colors hover:text-rust"
					>
						github
					</a>
				</nav>
			</header>

			<main className="flex flex-1 flex-col py-16">
				<p className="font-mono text-xs text-muted">
					tauri 2 · next.js 16 · rust
				</p>
				<h1 className="mt-4 max-w-[24ch] text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
					Rust core. Next.js window.
				</h1>
				<p className="mt-5 max-w-[68ch] text-base leading-7 text-muted">
					The window you are looking at is a static Next.js export
					running in the system webview; the process behind it is
					Rust. Everything on this page ships with the template,
					including the live call below.
				</p>

				<GreetDemo />

				<section className="mt-16">
					<h2 className="border-b border-line pb-3 font-mono text-sm">
						commands
					</h2>
					<dl className="divide-y divide-line">
						{commands.map((entry) => (
							<div
								key={entry.command}
								className="grid gap-1 py-3 sm:grid-cols-[260px_minmax(0,1fr)] sm:gap-6"
							>
								<dt className="font-mono text-[13px]">
									{entry.command}
								</dt>
								<dd className="max-w-[70ch] text-sm leading-6 text-muted">
									{entry.role}
								</dd>
							</div>
						))}
					</dl>
				</section>
			</main>

			<footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-5 font-mono text-xs text-muted">
				<span>MIT licensed</span>
				<span>built with tauri + next.js</span>
			</footer>
		</div>
	);
}
