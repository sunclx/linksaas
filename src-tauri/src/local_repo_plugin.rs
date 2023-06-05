use crate::user_api_plugin::get_user_id;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct LocalRepoInfo {
    pub id: String,
    pub name: String,
    pub path: String,
}

async fn load_data(user_id: &String) -> Result<Vec<LocalRepoInfo>, String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push(user_id);
    file_path.push("local_repo.json");
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
    let repo_list = serde_json::from_str(&json_str);
    if repo_list.is_err() {
        return Err(repo_list.err().unwrap().to_string());
    }
    return Ok(repo_list.unwrap());
}

async fn save_data(user_id: &String, repo_list: &Vec<LocalRepoInfo>) -> Result<(), String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push(user_id);
    if !file_path.exists() {
        let result = fs::create_dir_all(&file_path).await;
        if result.is_err() {
            return Err(result.err().unwrap().to_string());
        }
    }
    file_path.push("local_repo.json");
    let f = fs::File::create(file_path).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let json_str = serde_json::to_string(&repo_list);
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

//增加本地仓库
#[tauri::command]
async fn add_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    id: String,
    name: String,
    path: String,
) -> Result<(), String> {
    let user_id = get_user_id(app_handle.clone()).await;
    let repo_list = load_data(&user_id).await;
    if repo_list.is_err() {
        return Err(repo_list.err().unwrap());
    }
    let mut repo_list = repo_list.unwrap();
    for repo in &repo_list {
        if repo.id == id {
            return Ok(());
        }
    }
    repo_list.push(LocalRepoInfo {
        id: id,
        name: name,
        path: path,
    });

    return save_data(&user_id, &repo_list).await;
}

#[tauri::command]
async fn update_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    id: String,
    name: String,
    path: String,
) -> Result<(), String> {
    let user_id = get_user_id(app_handle.clone()).await;
    let repo_list = load_data(&user_id).await;
    if repo_list.is_err() {
        return Err(repo_list.err().unwrap());
    }
    let repo_list = repo_list.unwrap();
    let mut new_repo_list = Vec::new();
    for repo in &repo_list {
        if repo.id == id {
            new_repo_list.push(LocalRepoInfo {
                id: id.clone(),
                name: name.clone(),
                path: path.clone(),
            });
        } else {
            new_repo_list.push(repo.clone());
        }
    }

    return save_data(&user_id, &new_repo_list).await;
}

//删除本地仓库
#[tauri::command]
async fn remove_repo<R: Runtime>(app_handle: AppHandle<R>, id: String) -> Result<(), String> {
    let user_id = get_user_id(app_handle.clone()).await;
    let repo_list = load_data(&user_id).await;
    if repo_list.is_err() {
        return Err(repo_list.err().unwrap());
    }
    let repo_list = repo_list.unwrap();
    let mut new_repo_list = Vec::new();
    for repo in &repo_list {
        if repo.id != id {
            new_repo_list.push(repo.clone());
        }
    }
    return save_data(&user_id, &new_repo_list).await;
}

//列出本地仓库
#[tauri::command]
async fn list_repo<R: Runtime>(app_handle: AppHandle<R>) -> Result<Vec<LocalRepoInfo>, String> {
    let user_id = get_user_id(app_handle.clone()).await;
    return load_data(&user_id).await;
}

pub struct LocalRepoPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> LocalRepoPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_repo,
                update_repo,
                remove_repo,
                list_repo
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for LocalRepoPlugin<R> {
    fn name(&self) -> &'static str {
        "local_repo"
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
