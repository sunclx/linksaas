use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_requirement_api::project_requirement_api_client::ProjectRequirementApiClient;
use proto_gen_rust::project_requirement_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};


#[tauri::command]
async fn create_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateCateRequest,
) -> Result<CreateCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.create_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_cate".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

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
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_cate".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateCateRequest,
) -> Result<UpdateCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.update_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_cate".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveCateRequest,
) -> Result<RemoveCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.remove_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_cate".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRequirementRequest,
) -> Result<CreateRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.create_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_requirement".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequirementRequest,
) -> Result<ListRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.list_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_requirement".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_requirement_by_id<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequirementByIdRequest,
) -> Result<ListRequirementByIdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.list_requirement_by_id(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_requirement_by_id_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_requirement_by_id".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequirementRequest,
) -> Result<GetRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.get_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_requirement".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRequirementRequest,
) -> Result<UpdateRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.update_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_requirement".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_requirement_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetRequirementCateRequest,
) -> Result<SetRequirementCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.set_requirement_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_requirement_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_requirement_cate".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequirementRequest,
) -> Result<RemoveRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.remove_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_requirement".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn link_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LinkIssueRequest,
) -> Result<LinkIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.link_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == link_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("link_issue".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn unlink_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnlinkIssueRequest,
) -> Result<UnlinkIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.unlink_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unlink_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("unlink_issue".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_issue_link<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListIssueLinkRequest,
) -> Result<ListIssueLinkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.list_issue_link(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_issue_link_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_issue_link".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_multi_issue_link<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMultiIssueLinkRequest,
) -> Result<ListMultiIssueLinkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.list_multi_issue_link(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_multi_issue_link_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_multi_issue_link".into())) {
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
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
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
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
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
async fn remove_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveCommentRequest,
) -> Result<RemoveCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
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

pub struct ProjectRequirementApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectRequirementApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_cate,
                list_cate,
                update_cate,
                remove_cate,
                create_requirement,
                list_requirement,
                list_requirement_by_id,
                get_requirement,
                update_requirement,
                set_requirement_cate,
                remove_requirement,
                link_issue,
                unlink_issue,
                list_issue_link,
                list_multi_issue_link,
                add_comment,
                list_comment,
                remove_comment,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectRequirementApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_requirement_api"
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