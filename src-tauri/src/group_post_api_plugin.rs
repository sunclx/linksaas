use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::group_post_api::group_post_api_client::GroupPostApiClient;
use proto_gen_rust::group_post_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn add_post<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddPostRequest,
) -> Result<AddPostResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.add_post(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_post_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_post".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_post_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePostContentRequest,
) -> Result<UpdatePostContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.update_post_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_post_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_post_content".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_post_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePostTagRequest,
) -> Result<UpdatePostTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.update_post_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_post_tag_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_post_tag".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_post_essence<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePostEssenceRequest,
) -> Result<UpdatePostEssenceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.update_post_essence(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_post_essence_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_post_essence".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_post<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemovePostRequest,
) -> Result<RemovePostResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.remove_post(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_post_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_post".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_post_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListPostKeyRequest,
) -> Result<ListPostKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.list_post_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_post_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_post_key".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_post_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetPostKeyRequest,
) -> Result<GetPostKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.get_post_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_post_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_post_key".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


#[tauri::command]
async fn get_post_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetPostContentRequest,
) -> Result<GetPostContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.get_post_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_post_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_post_content".into())) {
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
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.add_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_comment".into())) {
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
    window: Window<R>,
    request: ListCommentRequest,
) -> Result<ListCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.list_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_comment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetCommentRequest,
) -> Result<GetCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.get_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_comment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateCommentRequest,
) -> Result<UpdateCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.update_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_comment".into())) {
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
    let mut client = GroupPostApiClient::new(chan.unwrap());
    match client.remove_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_comment_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_comment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct GroupPostApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> GroupPostApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_post,
                update_post_content,
                update_post_tag,
                update_post_essence,
                remove_post,
                list_post_key,
                get_post_key,
                get_post_content,
                add_comment,
                list_comment,
                get_comment,
                update_comment,
                remove_comment,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for GroupPostApiPlugin<R> {
    fn name(&self) -> &'static str {
        "group_post_api"
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