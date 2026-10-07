import { invoke, isTauri } from "@tauri-apps/api/core";

export { isTauri };

/**
 * Typed wrappers around the Rust commands registered in
 * `src-tauri/src/lib.rs`. Keep the names in sync with
 * `tauri::generate_handler![]`.
 */
export function greet(name: string) {
	return invoke<string>("greet", { name });
}
