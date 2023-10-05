use crate::notice_decode::new_wrong_session_notice;
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
async fn query_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: QueryPermRequest,
) -> Result<QueryPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.query_perm(request).await {
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

#[tauri::command]
async fn agree_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AgreeAppRequest,
) -> Result<AgreeAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.agree_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == agree_app_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("agree_app".into()))
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
async fn cancel_agree_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelAgreeAppRequest,
) -> Result<CancelAgreeAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.cancel_agree_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_agree_app_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("cancel_agree_app".into()),
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
async fn add_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddCommentRequest,
) -> Result<AddCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.add_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_comment_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_comment".into()))
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
async fn remove_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveCommentRequest,
) -> Result<RemoveCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.remove_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("xx".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListCommentRequest,
) -> Result<ListCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreApiClient::new(chan.unwrap());
    match client.list_comment(request).await {
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
                query_perm,
                get_cate_path,
                agree_app,
                cancel_agree_app,
                add_comment,
                remove_comment,
                list_comment,
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
