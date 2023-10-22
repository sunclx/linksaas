use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_entry_api::project_entry_api_client::ProjectEntryApiClient;
use proto_gen_rust::project_entry_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

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
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list".into()))
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
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.get(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get".into()))
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
async fn watch<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: WatchRequest,
) -> Result<WatchResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.watch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == watch_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("watch".into()))
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
async fn unwatch<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnwatchRequest,
) -> Result<UnwatchResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.unwatch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unwatch_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("unwatch".into()))
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
async fn update_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTagRequest,
) -> Result<UpdateTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_tag".into()))
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
async fn update_title<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTitleRequest,
) -> Result<UpdateTitleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_title(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_title_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_title".into()))
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
async fn update_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePermRequest,
) -> Result<UpdatePermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_perm".into()))
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
async fn update_mark_remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMarkRemoveRequest,
) -> Result<UpdateMarkRemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_mark_remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_mark_remove_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_mark_remove".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct ProjectEntryApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectEntryApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list,
                get,
                watch,
                unwatch,
                update_tag,
                update_title,
                update_perm,
                update_mark_remove,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectEntryApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_entry_api"
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
