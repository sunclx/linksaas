use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::search_api::search_api_client::SearchApiClient;
use proto_gen_rust::search_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn search_project_channel<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SearchProjectChannelRequest,
) -> Result<SearchProjectChannelResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = SearchApiClient::new(chan.unwrap());
    match client.search_project_channel(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == search_project_channel_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("search_project_channel".into()),
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
async fn search_project_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SearchProjectIssueRequest,
) -> Result<SearchProjectIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = SearchApiClient::new(chan.unwrap());
    match client.search_project_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == search_project_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("search_project_issue".into()),
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
async fn search_project_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SearchProjectDocRequest,
) -> Result<SearchProjectDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = SearchApiClient::new(chan.unwrap());
    match client.search_project_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == search_project_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("search_project_doc".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct SearchApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> SearchApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                search_project_channel,
                search_project_issue,
                search_project_doc,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for SearchApiPlugin<R> {
    fn name(&self) -> &'static str {
        "search_api"
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
