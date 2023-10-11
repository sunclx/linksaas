use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_cicd_api::project_ci_cd_api_client::ProjectCiCdApiClient;
use proto_gen_rust::project_cicd_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn get_agent_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetAgentTokenRequest,
) -> Result<GetAgentTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.get_agent_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_agent_token_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_agent_token".into()))
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
async fn renew_agent_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RenewAgentTokenRequest,
) -> Result<RenewAgentTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.renew_agent_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == renew_agent_token_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("renew_agent_token".into()))
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
async fn list_agent<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAgentRequest,
) -> Result<ListAgentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.list_agent(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_agent_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_agent".into()))
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
async fn update_pipe_line<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePipeLineRequest,
) -> Result<UpdatePipeLineResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectCiCdApiClient::new(chan.unwrap());
    match client.update_pipe_line(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_pipe_line_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_pipe_line".into()))
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


pub struct ProjectCiCdApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectCiCdApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                get_agent_token,
                renew_agent_token,
                list_agent,
                create_credential,
                list_credential,
                remove_credential,
                create_pipe_line,
                update_pipe_line,
                update_pipe_line_perm,
                list_pipe_line,
                get_pipe_line,
                remove_pipe_line,
                list_exec_result,
                calc_req_sign,
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
