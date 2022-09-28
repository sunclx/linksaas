use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_vc_api::project_vc_api_client::ProjectVcApiClient;
use proto_gen_rust::project_vc_api::*;
use tauri::http::{Response, ResponseBuilder};
use tauri::Manager;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_block_coll<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateBlockCollRequest,
) -> Result<CreateBlockCollResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.create_block_coll(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_block_coll_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_block_coll".into()),
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
async fn update_block_coll<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateBlockCollRequest,
) -> Result<UpdateBlockCollResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.update_block_coll(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_block_coll_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_block_coll".into()),
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
async fn renew_block_coll_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RenewBlockCollTokenRequest,
) -> Result<RenewBlockCollTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.renew_block_coll_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == renew_block_coll_token_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("renew_block_coll_token".into()),
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
async fn list_block_coll<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListBlockCollRequest,
) -> Result<ListBlockCollResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.list_block_coll(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_block_coll_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_block_coll".into()))
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
async fn remove_block_coll<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveBlockCollRequest,
) -> Result<RemoveBlockCollResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.remove_block_coll(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_block_coll_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_block_coll".into()),
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
async fn create_block<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateBlockRequest,
) -> Result<CreateBlockResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.create_block(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_block_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_block".into()))
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
async fn update_block<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateBlockRequest,
) -> Result<UpdateBlockResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.update_block(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_block_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_block".into()))
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
async fn list_block<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListBlockRequest,
) -> Result<ListBlockResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.list_block(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_block_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_block".into()))
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
async fn remove_block<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveBlockRequest,
) -> Result<RemoveBlockResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.remove_block(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_block_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_block".into()))
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
async fn update_block_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateBlockContentRequest,
) -> Result<UpdateBlockContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.update_block_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_block_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_block_content".into()),
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
async fn get_block_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetBlockContentRequest,
) -> Result<GetBlockContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.get_block_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_block_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_block_content".into()),
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
async fn list_all<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAllRequest,
) -> Result<ListAllResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    match client.list_all(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_all_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_all".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub async fn http_read_content(
    app_handle: &AppHandle,
    url_path: &str,
    session_id: &str,
) -> Result<Response, Box<(dyn std::error::Error + 'static)>> {
    println!("{} sess {}", url_path, session_id);
    let url_parts: Vec<&str> = url_path.split("/").collect();
    if url_parts.len() != 4 {
        return ResponseBuilder::new()
            .header("Access-Control-Allow-Origin", "*")
            .status(404)
            .body("wrong url".into());
    }
    let content_res = get_block_content(
        app_handle.clone(),
        app_handle.get_window("main").unwrap(),
        GetBlockContentRequest {
            session_id: session_id.into(),
            project_id: url_parts[1].into(),
            block_coll_id: url_parts[2].into(),
            block_id: url_parts[3].into(),
            max_history_count: 10,
        },
    )
    .await;
    match content_res {
        Err(err) => {
            println!("{:?}", err.clone());
            ResponseBuilder::new()
                .header("Access-Control-Allow-Origin", "*")
                .status(404)
                .body(err.into())
        }
        Ok(resp) => match serde_json::to_string(&resp) {
            Err(err) => {
                let err_str = err.to_string();
                println!("{:?}", err_str.clone());
                ResponseBuilder::new()
                    .header("Access-Control-Allow-Origin", "*")
                    .status(404)
                    .body(err_str.into())
            }
            Ok(res_data) => ResponseBuilder::new()
                .header("Access-Control-Allow-Origin", "*")
                .header("Content-Type", "application/json;charset=UTF-8")
                .status(200)
                .body(res_data.into()),
        },
    }
}

pub struct ProjectVcApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectVcApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_block_coll,
                update_block_coll,
                renew_block_coll_token,
                list_block_coll,
                remove_block_coll,
                create_block,
                update_block,
                list_block,
                remove_block,
                update_block_content,
                get_block_content,
                list_all,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectVcApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_vc_api"
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
