use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_cicd_api::project_ci_cd_api_client::ProjectCiCdApiClient;
use proto_gen_rust::project_cicd_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use async_zip::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};

#[tauri::command]
async fn get_runner_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRunnerTokenRequest,
) -> Result<GetRunnerTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.get_runner_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_runner_token_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_runner_token".into()))
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
async fn renew_runner_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RenewRunnerTokenRequest,
) -> Result<RenewRunnerTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.renew_runner_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == renew_runner_token_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("renew_runner_token".into()))
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
async fn list_runner<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRunnerRequest,
) -> Result<ListRunnerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.list_runner(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_runner_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_runner".into()))
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
async fn create_credential<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateCredentialRequest,
) -> Result<CreateCredentialResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.create_credential(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_credential_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_credential".into()))
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
async fn list_credential<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListCredentialRequest,
) -> Result<ListCredentialResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.list_credential(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_credential_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_credential".into()))
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
async fn remove_credential<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveCredentialRequest,
) -> Result<RemoveCredentialResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.remove_credential(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_credential_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_credential".into()))
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
async fn create_pipe_line<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreatePipeLineRequest,
) -> Result<CreatePipeLineResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.create_pipe_line(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_pipe_line_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_pipe_line".into()))
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
async fn update_pipe_line_job<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePipeLineJobRequest,
) -> Result<UpdatePipeLineJobResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.update_pipe_line_job(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_pipe_line_job_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_pipe_line_job".into()))
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
async fn update_pipe_line_name<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePipeLineNameRequest,
) -> Result<UpdatePipeLineNameResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.update_pipe_line_name(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_pipe_line_name_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_pipe_line_name".into()))
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
async fn update_pipe_line_plat_form<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePipeLinePlatFormRequest,
) -> Result<UpdatePipeLinePlatFormResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.update_pipe_line_plat_form(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_pipe_line_plat_form_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_pipe_line_plat_form".into()))
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
async fn update_pipe_line_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePipeLinePermRequest,
) -> Result<UpdatePipeLinePermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.update_pipe_line_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_pipe_line_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_pipe_line_perm".into()))
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
async fn list_pipe_line<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListPipeLineRequest,
) -> Result<ListPipeLineResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.list_pipe_line(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_pipe_line_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_pipe_line".into()))
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
async fn get_pipe_line<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetPipeLineRequest,
) -> Result<GetPipeLineResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.get_pipe_line(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_pipe_line_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_pipe_line".into()))
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
async fn remove_pipe_line<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemovePipeLineRequest,
) -> Result<RemovePipeLineResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.remove_pipe_line(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_pipe_line_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_pipe_line".into()))
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
async fn list_exec_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListExecResultRequest,
) -> Result<ListExecResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.list_exec_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_exec_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_exec_result".into()))
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
async fn calc_req_sign<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CalcReqSignRequest,
) -> Result<CalcReqSignResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.calc_req_sign(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == calc_req_sign_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("calc_req_sign".into()))
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
async fn pack_docker_compose<R: Runtime>(
    window: Window<R>,
    trace: String,
    path: String,
) -> Result<String, String> {
    if !window.label().starts_with("pipeLine:") {
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
    tmp_path.push("compose.zip");
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
        if &trace != "" {
            let res = window.emit(&trace, String::from(path_in_zip.to_str().unwrap()));
            if res.is_err() {
                println!("{}", res.err().unwrap());
            }
        }
    }
    let res = writer.close().await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    return Ok(String::from(tmp_path.to_str().unwrap()));
}

pub struct ProjectCiCdApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectCiCdApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                get_runner_token,
                renew_runner_token,
                list_runner,
                create_credential,
                list_credential,
                remove_credential,
                create_pipe_line,
                update_pipe_line_job,
                update_pipe_line_name,
                update_pipe_line_plat_form,
                update_pipe_line_perm,
                list_pipe_line,
                get_pipe_line,
                remove_pipe_line,
                list_exec_result,
                calc_req_sign,
                pack_docker_compose,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectCiCdApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_cicd_api"
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
