use proto_gen_rust::fs_api::fs_api_client::FsApiClient;
use proto_gen_rust::fs_api::*;

use crate::notice_decode::new_wrong_session_notice;
use futures_util::stream;
use std::io::Cursor;
use std::iter::Iterator;
use std::path::Path;
use tauri::http::{Response, ResponseBuilder};
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, Manager, PageLoadPayload, Runtime, Window,
};
use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;
use tokio_stream::StreamExt;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct DownloadResult {
    pub exist_in_local: bool,
    pub local_path: String,
    pub local_dir: String,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct FsProgressEvent {
    pub total_step: usize,
    pub cur_step: usize,
    pub file_id: String,
    pub file_size: usize,
}

#[tauri::command]
async fn get_cache_file<R: Runtime>(
    _app_handle: AppHandle<R>,
    _window: Window<R>,
    fs_id: String,
    file_id: String,
    file_name: String,
) -> Result<DownloadResult, String> {
    let cache_dir = format!(
        "{}/{}/{}",
        crate::get_cache_dir().unwrap(),
        (&fs_id).as_str(),
        (&file_id).as_str(),
    );
    let cache_file = format!("{}/{}", (&cache_dir).as_str(), (&file_name).as_str());
    if let Ok(cache_file_stat) = fs::metadata(cache_file.as_str()).await {
        if cache_file_stat.is_file() {
            return Ok(DownloadResult {
                exist_in_local: true,
                local_path: cache_file,
                local_dir: cache_dir,
            });
        }
    }
    return Ok(DownloadResult {
        exist_in_local: false,
        local_path: "".into(),
        local_dir: "".into(),
    });
}

#[tauri::command]
async fn download_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    track_id: String,
    session_id: String,
    fs_id: String,
    file_id: String,
) -> Result<DownloadResult, String> {
    let notice_name = format!("downloadFile_{}", track_id);
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = FsApiClient::new(chan.unwrap());
    let stat_resp = client
        .stat_file(StatFileRequest {
            session_id: session_id.clone(),
            fs_id: fs_id.clone(),
            file_id: file_id.clone(),
        })
        .await;
    if stat_resp.is_err() {
        return Err(stat_resp.err().unwrap().message().into());
    }
    
    let file_stat = stat_resp.unwrap().into_inner();
    if file_stat.code != 0 {
        return Err(file_stat.err_msg);
    }
    //检查本地文件
    let cache_dir = format!(
        "{}/{}/{}",
        crate::get_cache_dir().unwrap(),
        (&fs_id).as_str(),
        (&file_id).as_str(),
    );
    let cache_file = format!(
        "{}/{}",
        (&cache_dir).as_str(),
        (file_stat.clone().file_info.unwrap().file_name).as_str(),
    );
    let file_info = file_stat.file_info.unwrap();
    let file_size = (&file_info).file_size as u64;
    if let Ok(cache_file_stat) = fs::metadata(cache_file.as_str()).await {
        if cache_file_stat.is_file() && cache_file_stat.len() == file_size {
            return Ok(DownloadResult {
                exist_in_local: true,
                local_path: cache_file,
                local_dir: cache_dir,
            });
        }
    }

    //下载文件
    if let Err(err) = fs::create_dir_all(cache_dir.as_str()).await {
        println!("{:?}", err)
    }
    let tmp_file_path = format!("{}/.tmp", cache_dir.as_str());
    let tmp_file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open((&tmp_file_path).as_str())
        .await;
    if tmp_file.is_err() {
        return Err("open tmp file failed".into());
    }
    let mut tmp_file = tmp_file.unwrap();
    if let Ok(stream) = client
        .read_file(ReadFileRequest {
            session_id: session_id.clone(),
            fs_id: fs_id.clone(),
            file_id: file_id.clone(),
        })
        .await
    {
        let mut total_write_size: usize = 0;
        let mut msg_stream = stream.into_inner();
        while let Some(item) = msg_stream.next().await {
            match item {
                Ok(item) => {
                    if item.code != read_file_response::Code::Ok as i32 {
                        return Err(item.err_msg);
                    }
                    if let Err(err) = tmp_file.write_all(&item.data).await {
                        return Err(err.to_string());
                    }
                    total_write_size += item.data.len();
                    if let Err(err) = window.emit(
                        &notice_name,
                        FsProgressEvent {
                            total_step: (&file_info).file_size as usize,
                            cur_step: total_write_size,
                            file_id: file_id.clone(),
                            file_size: file_size as usize,
                        },
                    ) {
                        println!("{:?}", err);
                    }
                }
                Err(err) => {
                    return Err(err.to_string());
                }
            }
        }
        if let Err(err) = window.emit(
            &notice_name,
            FsProgressEvent {
                total_step: (&file_info).file_size as usize,
                cur_step: (&file_info).file_size as usize,
                file_id: file_id.clone(),
                file_size: file_size as usize,
            },
        ) {
            println!("{:?}", err);
        }
        match fs::rename(tmp_file_path.as_str(), cache_file.as_str()).await {
            Ok(_) => {
                return Ok(DownloadResult {
                    exist_in_local: true,
                    local_path: cache_file,
                    local_dir: cache_dir,
                });
            }
            Err(err) => {
                return Err(err.to_string());
            }
        }
    } else {
        return Err("read stream failed".into());
    }
}

pub async fn http_download_file(
    app_handle: &AppHandle,
    url_path: &str,
    session_id: &str,
) -> Result<Response, Box<(dyn std::error::Error + 'static)>> {
    let url_parts: Vec<&str> = url_path.split("/").collect();
    if url_parts.len() < 3 {
        return ResponseBuilder::new()
            .header("Access-Control-Allow-Origin", "*")
            .status(404)
            .body("wrong url".into());
    }
    let download_result = download_file(
        app_handle.clone(),
        app_handle.get_window("main").unwrap(),
        "".into(),
        session_id.into(),
        url_parts[1].into(),
        url_parts[2].into(),
    )
    .await;
    match download_result {
        Err(err) => {
            println!("{:?}", err.clone());
            ResponseBuilder::new()
                .header("Access-Control-Allow-Origin", "*")
                .status(403)
                .body(err.into())
        }
        Ok(resp) => {
            if resp.exist_in_local {
                match fs::File::open(resp.local_path).await {
                    Err(_) => ResponseBuilder::new().status(404).body("no file".into()),
                    Ok(mut f) => {
                        let mut data: Vec<u8> = Vec::new();
                        match f.read_to_end(&mut data).await {
                            Err(_) => ResponseBuilder::new()
                                .header("Access-Control-Allow-Origin", "*")
                                .status(500)
                                .body("server error".into()),
                            Ok(_) => ResponseBuilder::new()
                                .header("Access-Control-Allow-Origin", "*")
                                .status(200)
                                .body(data.into()),
                        }
                    }
                }
            } else {
                ResponseBuilder::new()
                    .header("Access-Control-Allow-Origin", "*")
                    .status(500)
                    .body("server error".into())
            }
        }
    }
}

struct WriteRequestIter<R: Runtime> {
    window: Window<R>,
    track_id: String,
    req_list: Vec<WriteFileRequest>,
    index: usize,
    file_size: usize,
}

impl<R: Runtime> Iterator for WriteRequestIter<R> {
    type Item = WriteFileRequest;
    fn next(&mut self) -> Option<Self::Item> {
        let notice_name = format!("uploadFile_{}", &self.track_id);
        if self.index < self.req_list.len() {
            let item = self.req_list.get(self.index).unwrap();
            self.index += 1;
            if let Err(err) = self.window.emit(
                &notice_name,
                FsProgressEvent {
                    total_step: self.req_list.len(),
                    cur_step: self.index,
                    file_id: "".into(),
                    file_size: self.file_size,
                },
            ) {
                println!("{:?}", err);
            }
            Some(item.clone())
        } else {
            if let Err(err) = self.window.emit(
                &notice_name,
                FsProgressEvent {
                    total_step: self.req_list.len(),
                    cur_step: self.index,
                    file_id: "".into(),
                    file_size: self.file_size,
                },
            ) {
                println!("{:?}", err);
            }
            None
        }
    }
}

#[tauri::command]
async fn write_file_base64<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    track_id: String,
    session_id: String,
    fs_id: String,
    file_name: String,
    data: String,
) -> Result<WriteFileResponse, String> {
    let bytes = base64::decode(data);
    if bytes.is_err() {
        return Err(bytes.err().unwrap().to_string());
    }
    return write_file_data(
        app_handle,
        window,
        track_id,
        session_id,
        fs_id,
        file_name,
        bytes.unwrap(),
    )
    .await;
}

pub async fn write_file_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    track_id: String,
    session_id: String,
    fs_id: String,
    file_name: String,
    data: Vec<u8>,
) -> Result<WriteFileResponse, String> {
    let file_size = data.len();
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = FsApiClient::new(chan.unwrap());
    let mut req_list: Vec<WriteFileRequest> = Vec::new();
    let mut cursor = Cursor::new(data.clone());
    let mut total_write: usize = 0;
    loop {
        let mut buf: [u8; 1024 * 100] = [0; 1024 * 100];
        match std::io::Read::read(&mut cursor, &mut buf) {
            Ok(n) => {
                if n == 0 {
                    continue;
                }
                total_write += n;
                req_list.push(WriteFileRequest {
                    session_id: session_id.clone(),
                    fs_id: fs_id.clone(),
                    file_name: file_name.clone(),
                    data: Vec::from(&buf[0..n]),
                });
                if total_write >= data.len() {
                    break;
                }
            }
            Err(err) => {
                if err.kind() == std::io::ErrorKind::Interrupted {
                    continue;
                }
                return Err(err.to_string());
            }
        }
    }
    let req_len = req_list.len();
    match client
        .write_file(stream::iter(WriteRequestIter {
            window: window.clone(),
            track_id: track_id.clone(),
            req_list: req_list,
            index: 0,
            file_size: file_size,
        }))
        .await
    {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == write_file_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("write_file".into()))
                {
                    println!("{:?}", err);
                }
            }
            let notice_name = format!("uploadFile_{}", track_id);
            if let Err(err) = window.emit(
                &notice_name,
                FsProgressEvent {
                    total_step: req_len,
                    cur_step: req_len,
                    file_id: inner_resp.clone().file_id,
                    file_size: file_size,
                },
            ) {
                println!("{:?}", err);
            }
            return Ok(inner_resp);
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
async fn write_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    track_id: String,
    session_id: String,
    fs_id: String,
    file_name: String,
) -> Result<WriteFileResponse, String> {
    match fs::File::open(&file_name).await {
        Ok(mut f) => {
            let file_name = Path::new(file_name.as_str())
                .file_name()
                .unwrap()
                .to_str()
                .unwrap();
            let mut data: Vec<u8> = Vec::new();
            if let Ok(_) = f.read_to_end(&mut data).await {
                return write_file_data(
                    app_handle,
                    window,
                    track_id,
                    session_id,
                    fs_id,
                    file_name.to_string(),
                    data,
                )
                .await;
            } else {
                return Err("read file failed".into());
            }
        }
        Err(err) => {
            return Err(err.to_string());
        }
    }
}

#[tauri::command]
async fn write_thumb_image_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    track_id: String,
    session_id: String,
    fs_id: String,
    file_path: String,
    width: u32,
    height: u32,
) -> Result<WriteFileResponse, String> {
    //生成缩略图
    let img_res = crate::image_utils::read_image(file_path.clone());
    if img_res.is_err() {
        return Err(img_res.err().unwrap());
    }
    let thumb_img = crate::image_utils::resize_image(img_res.unwrap(), width, height);
    let png_res = crate::image_utils::encode_to_png(thumb_img);
    if png_res.is_err() {
        return Err(png_res.err().unwrap());
    }
    let file_name = Path::new(file_path.as_str())
        .file_name()
        .unwrap()
        .to_str()
        .unwrap();
    return write_file_data(
        app_handle,
        window,
        track_id,
        session_id,
        fs_id,
        file_name.into(),
        png_res.unwrap(),
    )
    .await;
}

#[tauri::command]
pub async fn set_file_owner<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: SetFileOwnerRequest,
) -> Result<SetFileOwnerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = FsApiClient::new(chan.unwrap());
    match client.set_file_owner(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn copy_file<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: CopyFileRequest,
) -> Result<CopyFileResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = FsApiClient::new(chan.unwrap());
    match client.copy_file(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_fs_status<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetFsStatusRequest,
) -> Result<GetFsStatusResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = FsApiClient::new(chan.unwrap());
    match client.get_fs_status(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

pub struct FsApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> FsApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                get_cache_file,
                download_file,
                write_file_base64,
                write_file,
                write_thumb_image_file,
                set_file_owner,
                copy_file,
                get_fs_status,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for FsApiPlugin<R> {
    fn name(&self) -> &'static str {
        "fs_api"
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
