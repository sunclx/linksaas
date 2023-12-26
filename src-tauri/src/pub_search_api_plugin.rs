use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;

#[tauri::command]
async fn list_my_site() -> Result<Vec<String>, String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("all");
    file_path.push("pub_search_site.json");
    if !file_path.exists() {
        return Ok(Vec::new());
    }
    let f = fs::File::open(file_path).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let mut data = Vec::new();
    let result = f.read_to_end(&mut data).await;
    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }
    let json_str = String::from_utf8(data);
    if json_str.is_err() {
        return Err(json_str.err().unwrap().to_string());
    }
    let json_str = json_str.unwrap();
    let site_list = serde_json::from_str(&json_str);
    if site_list.is_err() {
        return Err(site_list.err().unwrap().to_string());
    }
    return Ok(site_list.unwrap());
}

#[tauri::command]
async fn set_my_site(site_list: Vec<String>) -> Result<(), String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("all");
    if !file_path.exists() {
        let result = fs::create_dir_all(&file_path).await;
        if result.is_err() {
            return Err(result.err().unwrap().to_string());
        }
    }
    file_path.push("pub_search_site.json");
    let f = fs::File::create(file_path).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let json_str = serde_json::to_string(&site_list);
    if json_str.is_err() {
        return Err(json_str.err().unwrap().to_string());
    }
    let json_str = json_str.unwrap();
    let result = f.write_all(json_str.as_bytes()).await;
    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }
    return Ok(());
}

#[tauri::command]
async fn get_search_history() -> Result<Vec<String>, String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("all");
    file_path.push("pub_search_history.json");
    if !file_path.exists() {
        return Ok(Vec::new());
    }
    let f = fs::File::open(file_path).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let mut data = Vec::new();
    let result = f.read_to_end(&mut data).await;
    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }
    let json_str = String::from_utf8(data);
    if json_str.is_err() {
        return Err(json_str.err().unwrap().to_string());
    }
    let json_str = json_str.unwrap();
    let site_list = serde_json::from_str(&json_str);
    if site_list.is_err() {
        return Err(site_list.err().unwrap().to_string());
    }
    return Ok(site_list.unwrap());
}

#[tauri::command]
async fn add_search_history(keyword: String) -> Result<(), String> {
    let history_list = get_search_history().await;
    let mut history_list = history_list.unwrap_or_default();
    if history_list.contains(&keyword) {
        return Ok(());
    }
    if &keyword == "" {
        return Ok(());
    }
    history_list.push(keyword);

    while history_list.len() > 100 {
        history_list.remove(0);
    }

    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("all");
    if !file_path.exists() {
        let result = fs::create_dir_all(&file_path).await;
        if result.is_err() {
            return Err(result.err().unwrap().to_string());
        }
    }
    file_path.push("pub_search_history.json");
    let f = fs::File::create(file_path).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let json_str = serde_json::to_string(&history_list);
    if json_str.is_err() {
        return Err(json_str.err().unwrap().to_string());
    }
    let json_str = json_str.unwrap();
    let result = f.write_all(json_str.as_bytes()).await;
    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }
    return Ok(());
}

pub struct PubSearchApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> PubSearchApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_my_site,
                get_search_history,
                add_search_history,
                set_my_site,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for PubSearchApiPlugin<R> {
    fn name(&self) -> &'static str {
        "pub_search_api"
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
