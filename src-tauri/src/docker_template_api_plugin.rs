use crate::notice_decode::new_wrong_session_notice;
use async_zip::read::seek::ZipFileReader;
use async_zip::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use proto_gen_rust::docker_template_api::docker_template_api_client::DockerTemplateApiClient;
use proto_gen_rust::docker_template_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs::File;
use tokio::io::AsyncReadExt;

#[tauri::command]
async fn list_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListCateRequest,
) -> Result<ListCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_app_with_template<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListAppWithTemplateRequest,
) -> Result<ListAppWithTemplateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.list_app_with_template(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddCommentRequest,
) -> Result<AddCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.add_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_comment_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_comment".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveCommentRequest,
) -> Result<RemoveCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.remove_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("xx".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListCommentRequest,
) -> Result<ListCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.list_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_app_with_template<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetAppWithTemplateRequest,
) -> Result<GetAppWithTemplateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.get_app_with_template(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn pack_template<R: Runtime>(window: Window<R>, path: String) -> Result<String, String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let app_tmp_dir = crate::get_tmp_dir();
    if app_tmp_dir.is_none() {
        return Err("no tmp dir".into());
    }
    let tmp_dir = mktemp::Temp::new_dir_in(app_tmp_dir.unwrap());
    if tmp_dir.is_err() {
        return Err(tmp_dir.err().unwrap().to_string());
    }
    let tmp_dir = tmp_dir.unwrap();
    let mut tmp_path = tmp_dir.release();
    tmp_path.push("template.zip");
    let tmp_file = File::create(&tmp_path).await;
    if tmp_file.is_err() {
        return Err(tmp_file.err().unwrap().to_string());
    }
    let mut tmp_file = tmp_file.unwrap();
    let mut writer = ZipFileWriter::new(&mut tmp_file);

    for entry in walkdir::WalkDir::new(&path) {
        let entry = entry.unwrap();
        if entry.file_type().is_dir() {
            continue;
        }
        let full_path = entry.path();
        let path_in_zip = full_path.strip_prefix(&path).unwrap();
        let zip_entry = ZipEntryBuilder::new(
            String::from(path_in_zip.to_str().unwrap()),
            Compression::Deflate,
        );
        let f = tokio::fs::File::open(full_path).await;
        if f.is_err() {
            return Err(f.err().unwrap().to_string());
        }
        let mut f = f.unwrap();
        let mut data: Vec<u8> = Vec::new();
        let read_res = f.read_to_end(&mut data).await;
        if read_res.is_err() {
            return Err(read_res.err().unwrap().to_string());
        }
        let write_res = writer.write_entry_whole(zip_entry, data.as_ref()).await;
        if write_res.is_err() {
            return Err(write_res.err().unwrap().to_string());
        }
    }
    let res = writer.close().await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    return Ok(String::from(tmp_path.to_str().unwrap()));
}

#[tauri::command]
async fn check_unpark<R: Runtime>(
    window: Window<R>,
    fs_id: String,
    file_id: String,
) -> Result<bool, String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let cache_dir = crate::get_cache_dir();
    if cache_dir.is_none() {
        return Err("no cache dir".into());
    }
    let mut cache_dir = std::path::PathBuf::from(cache_dir.unwrap());
    cache_dir.push(fs_id);
    cache_dir.push(file_id);
    cache_dir.push("template");

    if cache_dir.is_dir() {
        return Ok(true);
    }
    return Ok(false);
}

#[cfg(target_os = "windows")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("/", "\\");
}

#[cfg(target_os = "linux")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("\\", "/");
}

#[cfg(target_os = "macos")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("\\", "/");
}

#[tauri::command]
async fn unpack_template<R: Runtime>(
    window: Window<R>,
    fs_id: String,
    file_id: String,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let cache_dir = crate::get_cache_dir();
    if cache_dir.is_none() {
        return Err("no cache dir".into());
    }
    let mut cache_dir = std::path::PathBuf::from(cache_dir.unwrap());
    cache_dir.push(fs_id);
    cache_dir.push(file_id);
    let mut src_file = cache_dir.clone();
    src_file.push("template.zip");

    let mut out_path = cache_dir.clone();
    out_path.push("template");

    let src_file = File::open(&src_file).await;
    if src_file.is_err() {
        return Err(src_file.err().unwrap().to_string());
    }

    let mut src_file = src_file.unwrap();
    let reader = ZipFileReader::new(&mut src_file).await;
    if reader.is_err() {
        return Err(reader.err().unwrap().to_string());
    }
    let mut reader = reader.unwrap();
    let mut entry_list = Vec::new();
    for entry in reader.file().entries() {
        entry_list.push(entry.entry().clone());
    }

    for index in 0..entry_list.len() {
        let entry = entry_list.get(index).unwrap();
        let entry_filename = adjust_entry_path(String::from(entry.filename()));
        let dest_path = out_path.join(entry_filename);
        if entry.dir() {
            let res = tokio::fs::create_dir_all(&dest_path).await;
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
        } else {
            if let Some(parent) = dest_path.parent() {
                let res = tokio::fs::create_dir_all(&parent).await;
                if res.is_err() {
                    return Err(res.err().unwrap().to_string());
                }
            }

            let entry_reader = reader.entry(index).await;
            if entry_reader.is_err() {
                return Err(entry_reader.err().unwrap().to_string());
            }
            let mut entry_reader = entry_reader.unwrap();
            let writer = tokio::fs::OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(&dest_path)
                .await;
            if writer.is_err() {
                return Err(writer.err().unwrap().to_string());
            }
            let mut writer = writer.unwrap();
            let res = tokio::io::copy(&mut entry_reader, &mut writer).await;
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
        }
    }
    return Ok(());
}

pub struct DockerTemplateApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DockerTemplateApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_cate,
                list_app_with_template,
                get_app_with_template,
                add_comment,
                remove_comment,
                list_comment,
                pack_template,
                check_unpark,
                unpack_template,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DockerTemplateApiPlugin<R> {
    fn name(&self) -> &'static str {
        "docker_template_api"
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
