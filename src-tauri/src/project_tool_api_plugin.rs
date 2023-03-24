use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::{fs, io::AsyncWriteExt};

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct ProjectLinksaasYml {
    project_id: String,
    access_token: String,
}

#[tauri::command]
async fn set_git_hook(
    git_path: String,
    project_id: String,
    access_token: String,
    post_commit_hook: bool,
) -> Result<(), String> {
    //检查是否是git目录
    let mut base_path = PathBuf::from(&git_path);
    base_path.push(".git");
    if base_path.exists() == false || base_path.is_dir() == false {
        return Err("not git repo".into());
    }
    //创建.linksaas.yml
    let mut cfg_path = PathBuf::from(&git_path);
    cfg_path.push(".linksaas.yml");
    let cfg = ProjectLinksaasYml {
        project_id: project_id,
        access_token: access_token,
    };
    let yml_content = serde_yaml::to_string(&cfg);
    if yml_content.is_err() {
        return Err(yml_content.err().unwrap().to_string());
    }
    let yml_content = yml_content.unwrap();
    if let Err(err) = fs::write(&cfg_path, yml_content.as_bytes()).await {
        return Err(err.to_string());
    }

    //移除.git/hooks/post-commit
    let mut post_commit_path = base_path;
    post_commit_path.push("hooks");
    post_commit_path.push("post-commit");
    if post_commit_path.exists() {
        if let Err(err) = fs::remove_file(&post_commit_path).await {
            return Err(err.to_string());
        }
    }
    //创建.git/hooks/post-commit
    if post_commit_hook {
        let prog_path = std::env::current_exe();
        if prog_path.is_err() {
            return Err(prog_path.err().unwrap().to_string());
        }
        let prog_path = prog_path.unwrap();

       return save_post_hook(&post_commit_path, &prog_path).await;
    }
    Ok(())
}

#[cfg(target_os = "windows")]
async fn save_post_hook(file_path: &PathBuf, prog_path: &PathBuf) -> Result<(), String> {
    let f = fs::OpenOptions::new()
        .write(true)
        .create(true)
        .open(file_path)
        .await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }

    let mut f = f.unwrap();
    let content = format!("#!/bin/sh\n\n\"{}\" postHook", prog_path.to_str().unwrap());
    if let Err(err) = f.write_all(content.as_bytes()).await {
        return Err(err.to_string());
    }
    Ok(())
}

#[cfg(target_os = "linux")]
async fn save_post_hook(file_path: &PathBuf, prog_path: &PathBuf) -> Result<(), String> {
    let f = fs::OpenOptions::new()
        .mode(0o700)
        .write(true)
        .create(true)
        .open(file_path)
        .await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }

    let mut f = f.unwrap();
    let content = format!("#!/bin/sh\n\n{} postHook", prog_path.to_str().unwrap());
    if let Err(err) = f.write_all(content.as_bytes()).await {
        return Err(err.to_string());
    }
    Ok(())
}

#[cfg(target_os = "macos")]
async fn save_post_hook(file_path: &PathBuf, prog_path: &PathBuf) -> Result<(), String> {
    let f = fs::OpenOptions::new()
        .mode(0o700)
        .write(true)
        .create(true)
        .open(file_path)
        .await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }

    let mut f = f.unwrap();
    let content = format!("#!/bin/sh\n\n{} postHook", prog_path.to_str().unwrap());
    if let Err(err) = f.write_all(content.as_bytes()).await {
        return Err(err.to_string());
    }
    Ok(())
}


pub struct ProjectToolApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectToolApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![set_git_hook]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectToolApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_tool_api"
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
