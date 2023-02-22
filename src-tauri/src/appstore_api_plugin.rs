use proto_gen_rust::appstore_api::appstore_api_client::AppstoreApiClient;
use proto_gen_rust::appstore_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_major_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListMajorCateRequest,
) -> Result<ListMajorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.list_major_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListMinorCateRequest,
) -> Result<ListMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.list_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_sub_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListSubMinorCateRequest,
) -> Result<ListSubMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.list_sub_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_app<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListAppRequest,
) -> Result<ListAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.list_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_app<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetAppRequest,
) -> Result<GetAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.get_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_cate_path<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetCatePathRequest,
) -> Result<GetCatePathResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.get_cate_path(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct AppstoreApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> AppstoreApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_major_cate,
                list_minor_cate,
                list_sub_minor_cate,
                list_app,
                get_app,
                get_cate_path,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for AppstoreApiPlugin<R> {
    fn name(&self) -> &'static str {
        "appstore_api"
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
