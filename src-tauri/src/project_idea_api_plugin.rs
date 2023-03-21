use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_idea_api::project_idea_api_client::ProjectIdeaApiClient;
use proto_gen_rust::project_idea_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateTagRequest,
) -> Result<CreateTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.create_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_tag".into()))
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
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
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
async fn remove_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveTagRequest,
) -> Result<RemoveTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.remove_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_tag".into()))
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
async fn get_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetTagRequest,
) -> Result<GetTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.get_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_tag".into()))
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
async fn list_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListTagRequest,
) -> Result<ListTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.list_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_tag".into()))
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
async fn create_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateIdeaRequest,
) -> Result<CreateIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.create_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_idea".into()))
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
async fn update_idea_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateIdeaContentRequest,
) -> Result<UpdateIdeaContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.update_idea_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_idea_content_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_idea_content".into()))
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
async fn update_idea_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateIdeaTagRequest,
) -> Result<UpdateIdeaTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.update_idea_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_idea_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_idea_tag".into()))
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
async fn update_idea_keyword<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateIdeaKeywordRequest,
) -> Result<UpdateIdeaKeywordResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.update_idea_keyword(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_idea_keyword_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_idea_keyword".into()))
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
async fn get_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetIdeaRequest,
) -> Result<GetIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.get_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_idea".into()))
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
async fn list_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListIdeaRequest,
) -> Result<ListIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.list_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_idea".into()))
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
async fn lock_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LockIdeaRequest,
) -> Result<LockIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.lock_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == lock_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("lock_idea".into()))
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
async fn unlock_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnlockIdeaRequest,
) -> Result<UnlockIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.unlock_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unlock_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("unlock_idea".into()))
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
async fn remove_idea<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveIdeaRequest,
) -> Result<RemoveIdeaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.remove_idea(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_idea_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_idea".into()))
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
async fn list_all_keyword<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAllKeywordRequest,
) -> Result<ListAllKeywordResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.list_all_keyword(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_all_keyword_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_all_keyword".into()))
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
async fn set_appraise<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetAppraiseRequest,
) -> Result<SetAppraiseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.set_appraise(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_appraise_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_appraise".into()))
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
async fn cancel_appraise<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelAppraiseRequest,
) -> Result<CancelAppraiseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.cancel_appraise(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_appraise_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("cancel_appraise".into()))
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
async fn list_appraise<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAppraiseRequest,
) -> Result<ListAppraiseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIdeaApiClient::new(chan.unwrap());
    match client.list_appraise(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_appraise_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_appraise".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct ProjectIdeaApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectIdeaApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_tag,
                update_tag,
                remove_tag,
                get_tag,
                list_tag,
                create_idea,
                update_idea_content,
                update_idea_tag,
                update_idea_keyword,
                get_idea,
                list_idea,
                lock_idea,
                unlock_idea,
                remove_idea,
                list_all_keyword,
                set_appraise,
                cancel_appraise,
                list_appraise,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectIdeaApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_idea_api"
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
