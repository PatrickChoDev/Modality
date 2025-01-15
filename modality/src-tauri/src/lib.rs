mod config;
mod core;
use config::ConfigState;
use core::mqtt;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_config(state: tauri::State<ConfigState>, path: String, value: serde_json::Value) -> Result<(), String> {
    let mut config = state.0.lock().map_err(|_| "Failed to lock state")?;
    config.set(&path, value)
}

#[tauri::command]
fn load_config(state: tauri::State<ConfigState>, path: String) -> Result<Option<serde_json::Value>, String> {
    let config = state.0.lock().map_err(|_| "Failed to lock state")?;
    Ok(config.get(&path))
}

#[tauri::command]
fn reset_category(state: tauri::State<ConfigState>, category: String) -> Result<(), String> {
    let mut config = state.0.lock().map_err(|_| "Failed to lock state")?;
    config.reset_category(&category)
}

pub fn run() {
    let mqtt_cluster = core::mqtt::setup_mqtt_cluster().expect("Failed to setup MQTT cluster");

    tauri::Builder::default()
        .manage(mqtt_cluster)
        .invoke_handler(tauri::generate_handler![greet, save_config, load_config, reset_category])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
