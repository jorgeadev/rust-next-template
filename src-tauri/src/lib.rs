/// Greets someone from the Rust side of the IPC bridge.
///
/// The frontend calls this with `invoke("greet", { name })`; see
/// `src/lib/ipc.ts` for the typed wrapper.
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! This string was built in Rust.")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greet_names_the_caller() {
        let reply = greet("Ada");
        assert!(reply.contains("Ada"));
        assert!(reply.ends_with("This string was built in Rust."));
    }
}
