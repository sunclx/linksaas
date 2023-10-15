use proto_gen_rust::cicd_runner_api::ci_cd_runner_api_client::CiCdRunnerApiClient;
use proto_gen_rust::cicd_runner_api::*;
use std::time::Duration;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,Manager
};
use tokio::fs;
use tokio_stream::StreamExt;
use tonic::transport::{Channel, Endpoint};
use tokio::io::AsyncWriteExt;
use tauri::async_runtime::Mutex;


#[derive(Default)]
pub struct DownloadCount(pub Mutex<u64>);

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct DownloadResult {
    pub exist_in_local: bool,
    pub local_path: String,
    pub local_dir: String,
}

async fn conn_runner(addr: String) -> Result<Channel, String> {
    let mut u = url::Url::parse(&addr);
    if u.is_err() {
        let new_addr = format!("http://{}", addr);
        u = url::Url::parse(&new_addr);
        if u.is_err() {
            return Err(u.err().unwrap().to_string());
        }
    }
    let mut u = u.unwrap();
    if let Err(_) = u.set_scheme("http") {
        return Err("set schema failed".into());
    }
    if u.port().is_none() {
        return Err("miss port".into());
    }
    let end_point = Endpoint::from_shared(String::from(u));
    if end_point.is_err() {
        return Err(end_point.err().unwrap().to_string());
    }
    let end_point = end_point.unwrap();
    let chan = end_point
        .tcp_keepalive(Some(Duration::new(300, 0)))
        .connect()
        .await;
    if chan.is_err() {
        return Err(chan.err().unwrap().to_string());
    }
    return Ok(chan.unwrap());
}

#[tauri::command]
async fn start_exec(
    serv_addr: String,
    request: StartExecRequest,
) -> Result<StartExecResponse, String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.start_exec(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn stop_exec(
    serv_addr: String,
    request: StopExecRequest,
) -> Result<StopExecResponse, String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.stop_exec(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_exec_state(
    serv_addr: String,
    request: GetExecStateRequest,
) -> Result<GetExecStateResponse, String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.get_exec_state(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_job_log<R: Runtime>(
    window: Window<R>,
    serv_addr: String,
    trace_id: String,
    request: GetJobLogRequest,
) -> Result<(), String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.get_job_log(request).await {
        Ok(response) => {
            let mut log_stream = response.into_inner();
            while let Some(item) = log_stream.next().await {
                match item {
                    Ok(item) => {
                        if let Err(err) = window.emit(&trace_id, item) {
                            println!("{:?}", err);
                        }
                    }
                    Err(err) => {
                        return Err(err.to_string());
                    }
                }
            }
            return Ok(());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_result_fs(
    serv_addr: String,
    request: ListResultFsRequest,
) -> Result<ListResultFsResponse, String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.list_result_fs(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn stat_result_file(
    serv_addr: String,
    request: StatResultFileRequest,
) -> Result<StatResultFileResponse, String> {
    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.stat_result_file(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_result_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    serv_addr: String,
    trace_id: String,
    request: GetResultFileRequest,
) -> Result<DownloadResult, String> {
    let mut download_count = app_handle.state::<DownloadCount>().inner().0.lock().await;
    *download_count += 1;

    let cache_file = format!(
        "{}/{}/{}{}",
        crate::get_cache_dir().unwrap(),
        &request.pipe_line_id,
        &request.exec_id,
        &request.full_path
    );
    let dir = std::path::PathBuf::from(&cache_file);
    let dir = dir.parent();
    if dir.is_none() {
        return Err("miss dir".into());
    }
    let cache_dir = dir.unwrap().to_string_lossy().to_string();
    if let Ok(cache_file_stat) = fs::metadata(cache_file.as_str()).await {
        if cache_file_stat.is_file() {
            return Ok(DownloadResult {
                exist_in_local: true,
                local_path: cache_file,
                local_dir: cache_dir,
            });
        }
    }

    let chan = conn_runner(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = CiCdRunnerApiClient::new(chan.unwrap());
    match client.get_result_file(request).await {
        Ok(response) => {
            if let Err(err) = fs::create_dir_all(&cache_dir).await {
                println!("{:?}", err)
            }
            let tmp_file_path = format!("{}/.tmp", &cache_dir);
            let tmp_file = fs::OpenOptions::new()
                .append(true)
                .create(true)
                .open(&tmp_file_path)
                .await;
            if tmp_file.is_err() {
                return Err("open tmp file failed".into());
            }
            let mut tmp_file = tmp_file.unwrap();
            let mut total_write_size: usize = 0;
            let mut log_stream = response.into_inner();
            while let Some(item) = log_stream.next().await {
                match item {
                    Ok(item) => {
                        if item.code != (get_result_file_response::Code::Ok as i32) {
                            return Err(item.err_msg);
                        }
                        if let Err(err) = tmp_file.write_all(&item.file_data).await {
                            return Err(err.to_string());
                        }
                        total_write_size += item.file_data.len();
                        if let Err(err) = window.emit(&trace_id, total_write_size) {
                            println!("{:?}", err);
                        }
                    }
                    Err(err) => {
                        return Err(err.to_string());
                    }
                }
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
        }
        Err(status) => Err(status.message().into()),
    }
}



pub struct CiCdRunnerApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> CiCdRunnerApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                start_exec,
                stop_exec,
                get_exec_state,
                get_job_log,
                list_result_fs,
                stat_result_file,
                get_result_file,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for CiCdRunnerApiPlugin<R> {
    fn name(&self) -> &'static str {
        "cicd_runner_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(DownloadCount(Default::default()));
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
