use crate::user_api_plugin::{decrypt, encrypt};
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct LocalRepoSettingInfo {
    pub gitlab_protocol: String,
    pub gitlab_token: String,
    pub github_token: String,
    pub gitee_token: String,
    pub atomgit_token: String,
    pub gitcode_token: String,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct LocalRepoInfo {
    pub id: String,
    pub name: String,
    pub path: String,
    pub setting: Option<LocalRepoSettingInfo>,
}

async fn encrypt_token<R: Runtime>(app_handle: AppHandle<R>, token: &str) -> String {
    if token == "" {
        return String::from("");
    }
    let enc_data = encrypt(app_handle, Vec::from(token), true).await;
    if enc_data.is_err() {
        return String::from("");
    }
    let enc_data = enc_data.unwrap();
    return base64::encode(enc_data);
}

async fn decrypt_token<R: Runtime>(app_handle: AppHandle<R>, token: &str) -> String {
    if token == "" {
        return String::from("");
    }
    let dec_data = base64::decode(token);
    if dec_data.is_err() {
        return String::from("");
    }
    let dec_data = decrypt(app_handle, dec_data.unwrap(), true).await;
    if dec_data.is_err() {
        return String::from("");
    }
    let dec_data = String::from_utf8(dec_data.unwrap());
    if dec_data.is_err() {
        return String::from("");
    }
    return dec_data.unwrap();
}

async fn load_data() -> Result<Vec<LocalRepoInfo>, String> {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return Err("miss user dir".into());
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("all");
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

async fn save_data(repo_list: &Vec<LocalRepoInfo>) -> Result<(), String> {
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
async fn add_repo(id: String, name: String, path: String) -> Result<(), String> {
    let repo_list = load_data().await;
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
        setting: None,
    });

    return save_data(&repo_list).await;
}

#[tauri::command]
async fn update_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    id: String,
    name: String,
    path: String,
    setting: LocalRepoSettingInfo,
) -> Result<(), String> {
    let repo_list = load_data().await;
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
                setting: Some(LocalRepoSettingInfo {
                    gitlab_protocol: setting.gitlab_protocol.clone(),
                    gitlab_token: encrypt_token(app_handle.clone(), &setting.gitlab_token).await,
                    github_token: encrypt_token(app_handle.clone(), &setting.github_token).await,
                    gitee_token: encrypt_token(app_handle.clone(), &setting.gitee_token).await,
                    atomgit_token: encrypt_token(app_handle.clone(), &setting.atomgit_token).await,
                    gitcode_token: encrypt_token(app_handle.clone(), &setting.gitcode_token).await,
                }),
            });
        } else {
            new_repo_list.push(repo.clone());
        }
    }

    return save_data(&new_repo_list).await;
}

//删除本地仓库
#[tauri::command]
async fn remove_repo(id: String) -> Result<(), String> {
    let repo_list = load_data().await;
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
    return save_data(&new_repo_list).await;
}

//列出本地仓库
#[tauri::command]
async fn list_repo<R: Runtime>(app_handle: AppHandle<R>) -> Result<Vec<LocalRepoInfo>, String> {
    let repo_list = load_data().await;
    if repo_list.is_err() {
        return Err(repo_list.err().unwrap());
    }
    let repo_list = repo_list.unwrap();
    let mut ret_list = Vec::new();
    for repo in repo_list {
        if repo.setting.is_none() {
            ret_list.push(repo);
        } else {
            let setting = (&repo.setting).clone().unwrap();
            ret_list.push(LocalRepoInfo {
                id: repo.id.clone(),
                name: repo.name.clone(),
                path: repo.path.clone(),
                setting: Some(LocalRepoSettingInfo {
                    gitlab_protocol: setting.gitlab_protocol.clone(),
                    gitlab_token: decrypt_token(app_handle.clone(), &setting.gitlab_token).await,
                    github_token: decrypt_token(app_handle.clone(), &setting.github_token).await,
                    gitee_token: decrypt_token(app_handle.clone(), &setting.gitee_token).await,
                    atomgit_token: decrypt_token(app_handle.clone(), &setting.atomgit_token).await,
                    gitcode_token: decrypt_token(app_handle.clone(), &setting.gitcode_token).await,
                }),
            });
        }
    }
    return Ok(ret_list);
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
