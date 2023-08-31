use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::rss_api::rss_api_client::RssApiClient;
use proto_gen_rust::rss_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListCateRequest,
) -> Result<ListCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_cate_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_cate".into()))
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
async fn list_feed<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListFeedRequest,
) -> Result<ListFeedResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssApiClient::new(chan.unwrap());
    match client.list_feed(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_feed_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_feed".into()))
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
async fn list_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListEntryRequest,
) -> Result<ListEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssApiClient::new(chan.unwrap());
    match client.list_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RssApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RssApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_cate,
                list_feed,
                list_entry,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RssApiPlugin<R> {
    fn name(&self) -> &'static str {
        "rss_api"
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