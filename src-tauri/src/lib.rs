pub mod commands;

pub use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::ingest_image_bytes,
            commands::compute_spectral_indices,
            commands::compute_lulc_distribution,
            commands::assess_priority,
            commands::fuse_evidence,
            commands::analyze_change,
            commands::generate_report
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
