use crate::min_app_plugin::get_min_app_perm;
use tauri::api::dialog::FileDialogBuilder;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::sync::oneshot;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct File {
    pub file_name: String,
    pub file_data: Vec<u8>,
}

//读取文件,只在微应用里面调用
#[tauri::command]
async fn read_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    project_id: String,
    multi: bool,
) -> Result<Vec<File>, String> {
    //检查权限
    let perm = get_min_app_perm(app_handle.clone(), window, project_id.clone()).await;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    let perm = perm.fs_perm;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    if !perm.read_file {
        return Err("no perm".into());
    }
    //读取文件
    let (tx, rx) = oneshot::channel();
    let builder = FileDialogBuilder::new().set_title("读取文件");
    if multi {
        builder.pick_files(|files| {
            tx.send(files).unwrap();
        })
    } else {
        builder.pick_file(|file| {
            if file.is_none() {
                tx.send(None).unwrap();
            } else {
                tx.send(Some(vec![file.unwrap()])).unwrap();
            }
        })
    }
    let files = rx.await;
    if files.is_err() {
        return Err(files.err().unwrap().to_string());
    }
    let files = files.unwrap();
    if files.is_none() {
        return Ok(Vec::new());
    }
    let files = files.unwrap();
    let mut ret_list = Vec::new();
    for file in files {
        let file_name = file.file_name();
        if file_name.is_none() {
            return Err("unkwown file name".into());
        }
        let file_name = file_name.unwrap();
        let file_name = file_name.to_str();
        if file_name.is_none() {
            return Err("unkwown file name".into());
        }
        let file_name = file_name.unwrap();

        let file_data = tokio::fs::read(file.clone()).await;
        if file_data.is_err() {
            return Err(file_data.err().unwrap().to_string());
        }
        let file_data = file_data.unwrap();
        ret_list.push(File {
            file_name: String::from(file_name),
            file_data: file_data,
        });
    }
    return Ok(ret_list);
}

//写文件,只在微应用里面调用
#[tauri::command]
async fn write_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    project_id: String,
    file_data: Vec<u8>,
) -> Result<(), String> {
    //检查权限
    let perm = get_min_app_perm(app_handle.clone(), window, project_id.clone()).await;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    let perm = perm.fs_perm;
    if perm.is_none() {
        return Err("no perm".into());
    }
    let perm = perm.unwrap();
    if !perm.write_file {
        return Err("no perm".into());
    }
    //写入文件
    let (tx, rx) = oneshot::channel();
    FileDialogBuilder::new()
        .set_title("写入文件")
        .save_file(|file| {
            tx.send(file).unwrap();
        });
    let file = rx.await;
    if file.is_err() {
        return Err(file.err().unwrap().to_string());
    }
    let file = file.unwrap();
    if file.is_none() {
        return Ok(());
    }
    let file = file.unwrap();
    let res = tokio::fs::write(file, &file_data).await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    Ok(())
}

pub struct MinAppFsPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> MinAppFsPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![read_file, write_file,]),
        }
    }
}

impl<R: Runtime> Plugin<R> for MinAppFsPlugin<R> {
    fn name(&self) -> &'static str {
        "min_app_fs"
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
