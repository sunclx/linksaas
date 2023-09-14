use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::http_custom_api::http_custom_api_client::HttpCustomApiClient;
use proto_gen_rust::http_custom_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_custom<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateCustomRequest,
) -> Result<CreateCustomResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.create_custom(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_custom_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_custom".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_custom<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetCustomRequest,
) -> Result<GetCustomResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.get_custom(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_custom_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_custom".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_custom<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateCustomRequest,
) -> Result<UpdateCustomResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.update_custom(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_custom_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_custom".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateGroupRequest,
) -> Result<CreateGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.create_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_group_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_group".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateGroupRequest,
) -> Result<UpdateGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.update_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_group_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_group".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListGroupRequest,
) -> Result<ListGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.list_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_group_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_group".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveGroupRequest,
) -> Result<RemoveGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.remove_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_group_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_group".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_api_item<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateApiItemRequest,
) -> Result<CreateApiItemResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.create_api_item(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_api_item_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_api_item".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_api_item<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateApiItemRequest,
) -> Result<UpdateApiItemResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.update_api_item(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_api_item_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_api_item".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_api_item<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListApiItemRequest,
) -> Result<ListApiItemResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.list_api_item(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_api_item_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_api_item".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_api_item<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetApiItemRequest,
) -> Result<GetApiItemResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.get_api_item(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_api_item_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_api_item".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_api_item<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveApiItemRequest,
) -> Result<RemoveApiItemResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = HttpCustomApiClient::new(chan.unwrap());
    match client.remove_api_item(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_api_item_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_api_item".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct HttpCustomApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> HttpCustomApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_custom,
                get_custom,
                update_custom,
                create_group,
                update_group,
                list_group,
                remove_group,
                create_api_item,
                update_api_item,
                list_api_item,
                get_api_item,
                remove_api_item,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for HttpCustomApiPlugin<R> {
    fn name(&self) -> &'static str {
        "http_custom_api"
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