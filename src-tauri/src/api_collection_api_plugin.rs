use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::api_collection_api::api_collection_api_client::ApiCollectionApiClient;
use proto_gen_rust::api_collection_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn update_name<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateNameRequest,
) -> Result<UpdateNameResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.update_name(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_name_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_name".into()))
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
async fn update_default_addr<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateDefaultAddrRequest,
) -> Result<UpdateDefaultAddrResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.update_default_addr(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_default_addr_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_default_addr".into()),
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
async fn update_edit_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateEditMemberRequest,
) -> Result<UpdateEditMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.update_edit_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_edit_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_edit_member".into()),
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
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
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
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
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
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
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
async fn create_rpc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRpcRequest,
) -> Result<CreateRpcResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.create_rpc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_rpc_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_rpc".into()))
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
async fn get_rpc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRpcRequest,
) -> Result<GetRpcResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.get_rpc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_rpc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_rpc".into()))
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
async fn update_rpc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRpcRequest,
) -> Result<UpdateRpcResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.update_rpc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_rpc_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_rpc".into()))
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
async fn create_open_api<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateOpenApiRequest,
) -> Result<CreateOpenApiResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.create_open_api(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_open_api_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_open_api".into()))
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
async fn get_open_api<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetOpenApiRequest,
) -> Result<GetOpenApiResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.get_open_api(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_open_api_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_open_api".into()))
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
async fn update_open_api<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateOpenApiRequest,
) -> Result<UpdateOpenApiResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ApiCollectionApiClient::new(chan.unwrap());
    match client.update_open_api(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_open_api_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_open_api".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ApiCollectionApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ApiCollectionApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                update_name,
                update_default_addr,
                update_edit_member,
                list,
                get,
                remove,
                create_rpc,
                get_rpc,
                update_rpc,
                create_open_api,
                get_open_api,
                update_open_api,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ApiCollectionApiPlugin<R> {
    fn name(&self) -> &'static str {
        "api_collection_api"
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
