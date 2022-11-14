use tauri::async_runtime::Mutex;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, Manager, PageLoadPayload, Runtime, Window,
};
mod server;

#[derive(Default)]
pub struct ServPort(Mutex<Option<i16>>);

#[tauri::command]
pub fn remove_info_file() {
    if let Some(home_dir) = dirs::home_dir() {
        let file_path = format!("{}/.linksaas/local_api", home_dir.to_str().unwrap());
        if let Err(err) = std::fs::remove_file(file_path) {
            println!("{}", err);
        }
    }
}

#[tauri::command]
async fn get_port<R: Runtime>(app_handle: AppHandle<R>) -> i16 {
    let port = app_handle.state::<ServPort>().inner();
    if let Some(value) = port.0.lock().await.clone() {
        return value;
    }
    return 0;
}

pub struct LocalApiPlugin {
    invoke_handler: Box<dyn Fn(Invoke) + Send + Sync + 'static>,
}

impl LocalApiPlugin {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![remove_info_file, get_port]),
        }
    }
}

impl Plugin<tauri::Wry> for LocalApiPlugin {
    fn name(&self) -> &'static str {
        "local_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle, _config: serde_json::Value) -> PluginResult<()> {
        let handle = app.clone();
        app.manage(ServPort(Default::default()));
        tauri::async_runtime::spawn(async move {
            server::run(handle).await;
        });
        Ok(())
    }

    fn created(&mut self, _window: Window) {}

    fn on_page_load(&mut self, _window: Window, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke) {
        (self.invoke_handler)(message)
    }
}
