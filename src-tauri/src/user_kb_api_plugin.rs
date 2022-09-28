use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::user_kb_api::user_kb_api_client::UserKbApiClient;
use proto_gen_rust::user_kb_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateSpaceRequest,
) -> Result<CreateSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.create_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_space_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_space".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSpaceRequest,
) -> Result<UpdateSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.update_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_space_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_space".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSpaceRequest,
) -> Result<ListSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.list_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_space_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_space".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn get_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetSpaceRequest,
) -> Result<GetSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.get_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_space_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_space".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn remove_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveSpaceRequest,
) -> Result<RemoveSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.remove_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_space_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_space".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateDocRequest,
) -> Result<CreateDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.create_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_doc".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateDocRequest,
) -> Result<UpdateDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.update_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_doc".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_doc_index<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListDocIndexRequest,
) -> Result<ListDocIndexResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.list_doc_index(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_doc_index_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_doc_index".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetDocRequest,
) -> Result<GetDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.get_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_doc".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn remove_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveDocRequest,
) -> Result<RemoveDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.remove_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_doc".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct UserKbApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> UserKbApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_space,
                update_space,
                list_space,
                get_space,
                remove_space,
                create_doc,
                update_doc,
                list_doc_index,
                get_doc,
                remove_doc,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for UserKbApiPlugin<R> {
    fn name(&self) -> &'static str {
        "user_kb_api"
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
