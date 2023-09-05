use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::pub_search_api::pub_search_api_client::PubSearchApiClient;
use proto_gen_rust::pub_search_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_site_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListSiteCateRequest,
) -> Result<ListSiteCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.list_site_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_site<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListSiteRequest,
) -> Result<ListSiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.list_site(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_site<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetSiteRequest,
) -> Result<GetSiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.get_site(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_my_site<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMySiteRequest,
) -> Result<ListMySiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.list_my_site(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_my_site_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_my_site".into()),
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
async fn set_my_site<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetMySiteRequest,
) -> Result<SetMySiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.set_my_site(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_my_site_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_my_site".into()),
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
async fn add_search_history<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddSearchHistoryRequest,
) -> Result<AddSearchHistoryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.add_search_history(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_search_history_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("add_search_history".into()),
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
async fn get_search_history<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetSearchHistoryRequest,
) -> Result<GetSearchHistoryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = PubSearchApiClient::new(chan.unwrap());
    match client.get_search_history(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_search_history_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_search_history".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct PubSearchApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> PubSearchApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_site_cate,
                list_site,
                get_site,
                list_my_site,
                set_my_site,
                add_search_history,
                get_search_history,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for PubSearchApiPlugin<R> {
    fn name(&self) -> &'static str {
        "pub_search_api"
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