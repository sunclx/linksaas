use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_requirement_api::project_requirement_api_client::ProjectRequirementApiClient;
use proto_gen_rust::project_requirement_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_requirement".into()),
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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_requirement".into()),
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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_requirement_by_id".into()),
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
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_requirement".into()))
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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_requirement".into()),
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
async fn update_tag_id_list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTagIdListRequest,
) -> Result<UpdateTagIdListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.update_tag_id_list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_tag_id_list_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_tag_id_list".into()),
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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_requirement".into()),
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
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("link_issue".into()))
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
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("unlink_issue".into()))
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
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_issue_link".into()))
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
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_multi_issue_link".into()),
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
async fn close_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CloseRequirementRequest,
) -> Result<CloseRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.close_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == close_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("close_requirement".into()),
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
async fn open_requirement<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: OpenRequirementRequest,
) -> Result<OpenRequirementResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.open_requirement(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == open_requirement_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("open_requirement".into()),
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
async fn set_kano_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetKanoInfoRequest,
) -> Result<SetKanoInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.set_kano_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_kano_info_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_kano_info".into()))
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
async fn get_kano_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetKanoInfoRequest,
) -> Result<GetKanoInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.get_kano_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_kano_info_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_kano_info".into()))
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
async fn set_four_q_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetFourQInfoRequest,
) -> Result<SetFourQInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.set_four_q_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_four_q_info_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_four_q_info".into()))
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
async fn get_four_q_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetFourQInfoRequest,
) -> Result<GetFourQInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectRequirementApiClient::new(chan.unwrap());
    match client.get_four_q_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_four_q_info_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_four_q_info".into()))
                {
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
                create_requirement,
                list_requirement,
                list_requirement_by_id,
                get_requirement,
                update_requirement,
                update_tag_id_list,
                remove_requirement,
                link_issue,
                unlink_issue,
                list_issue_link,
                list_multi_issue_link,
                close_requirement,
                open_requirement,
                set_kano_info,
                get_kano_info,
                set_four_q_info,
                get_four_q_info,
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
