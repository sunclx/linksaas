use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::bookstore_api::bookstore_api_client::BookstoreApiClient;
use proto_gen_rust::bookstore_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListCateRequest,
) -> Result<ListCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_book<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListBookRequest,
) -> Result<ListBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreApiClient::new(chan.unwrap());
    match client.list_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_book_extra<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetBookExtraRequest,
) -> Result<GetBookExtraResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreApiClient::new(chan.unwrap());
    match client.get_book_extra(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_install_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetInstallInfoRequest,
) -> Result<GetInstallInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreApiClient::new(chan.unwrap());
    match client.get_install_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_install_info_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_install_info".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
pub struct BookstoreApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> BookstoreApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_cate,
                list_book,
                get_book_extra,
                get_install_info,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for BookstoreApiPlugin<R> {
    fn name(&self) -> &'static str {
        "bookstore_api"
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
