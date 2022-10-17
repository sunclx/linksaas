use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::short_note_api::short_note_api_client::ShortNoteApiClient;
use proto_gen_rust::short_note_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn add<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddRequest,
) -> Result<AddResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ShortNoteApiClient::new(chan.unwrap());
    match client.add(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add".into())) {
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
    let mut client = ShortNoteApiClient::new(chan.unwrap());
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
async fn list_my<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMyRequest,
) -> Result<ListMyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ShortNoteApiClient::new(chan.unwrap());
    match client.list_my(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_my_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_my".into()))
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
async fn list_by_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListByMemberRequest,
) -> Result<ListByMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ShortNoteApiClient::new(chan.unwrap());
    match client.list_by_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_by_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_by_member".into()))
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
async fn list_by_project<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListByProjectRequest,
) -> Result<ListByProjectResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ShortNoteApiClient::new(chan.unwrap());
    match client.list_by_project(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_by_project_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_by_project".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ShortNoteApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ShortNoteApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add,
                remove,
                list_my,
                list_by_member,
                list_by_project,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ShortNoteApiPlugin<R> {
    fn name(&self) -> &'static str {
        "short_note_api"
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
