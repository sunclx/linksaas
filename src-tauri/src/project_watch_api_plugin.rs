use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_watch_api::project_watch_api_client::ProjectWatchApiClient;
use proto_gen_rust::project_watch_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

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
    let mut client = ProjectWatchApiClient::new(chan.unwrap());
    match client.watch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == watch_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("watch".into())) {
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
    let mut client = ProjectWatchApiClient::new(chan.unwrap());
    match client.unwatch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unwatch_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("unwatch".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_my_watch<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMyWatchRequest,
) -> Result<ListMyWatchResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectWatchApiClient::new(chan.unwrap());
    match client.list_my_watch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_my_watch_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_my_watch".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct ProjectWatchApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectWatchApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                watch,
                unwatch,
                list_my_watch,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectWatchApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_watch_api"
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
