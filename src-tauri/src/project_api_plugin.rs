use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_api::project_api_client::ProjectApiClient;
use proto_gen_rust::project_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRequest,
) -> Result<CreateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.create(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.update(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.get(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn open<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: OpenRequest,
) -> Result<OpenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.open(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == open_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("open".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn close<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CloseRequest,
) -> Result<CloseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.close(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == close_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("close".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn change_owner<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ChangeOwnerRequest,
) -> Result<ChangeOwnerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.change_owner(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == change_owner_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("change_owner".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_local_api_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetLocalApiPermRequest,
) -> Result<SetLocalApiPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.set_local_api_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_local_api_perm_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_local_api_perm".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_local_api_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetLocalApiPermRequest,
) -> Result<GetLocalApiPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.get_local_api_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_local_api_perm_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_local_api_perm".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_setting<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSettingRequest,
) -> Result<UpdateSettingResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.update_setting(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_setting_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_setting".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_ai_gateway<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetAiGatewayRequest,
) -> Result<SetAiGatewayResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.set_ai_gateway(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_ai_gateway_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_ai_gateway".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn gen_ai_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GenAiTokenRequest,
) -> Result<GenAiTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    match client.gen_ai_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == gen_ai_token_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("gen_ai_token".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                update,
                list,
                get,
                open,
                close,
                remove,
                change_owner,
                set_local_api_perm,
                get_local_api_perm,
                update_setting,
                set_ai_gateway,
                gen_ai_token,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_api"
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
