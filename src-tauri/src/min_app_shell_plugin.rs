use crate::min_app_plugin::get_min_app_perm;
use tauri::api::dialog::confirm;
use tauri::Manager;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn open_browser<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    project_id: String,
    url: String,
) -> Result<(), String> {
    //检查权限
    let perm = get_min_app_perm(app_handle.clone(), window.clone(), project_id.clone()).await;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    let perm = perm.extra_perm;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    if !perm.open_browser {
        return Err("no perm".into());
    }
    tauri::async_runtime::spawn(async move {
        let shell_scope = app_handle.shell_scope();
        confirm(
            Some(&window),
            "打开浏览器",
            format!("是否打开链接 {}", url),
            move |ok| {
                if ok {
                    if let Err(err) = tauri::api::shell::open(&shell_scope, url, None) {
                        println!("{}", err);
                    }
                }
            },
        );
    });
    return Ok(());
}

pub struct MinAppShellPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> MinAppShellPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![open_browser]),
        }
    }
}

impl<R: Runtime> Plugin<R> for MinAppShellPlugin<R> {
    fn name(&self) -> &'static str {
        "min_app_shell"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, _app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
