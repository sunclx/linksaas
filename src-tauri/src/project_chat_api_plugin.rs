use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_chat_api::project_chat_api_client::ProjectChatApiClient;
use proto_gen_rust::project_chat_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateGroupRequest,
) -> Result<CreateGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.create_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_group".into()))
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
async fn update_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateGroupRequest,
) -> Result<UpdateGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.update_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_group".into()))
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
async fn remove_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveGroupRequest,
) -> Result<RemoveGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.remove_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_group".into()))
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
async fn get_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetGroupRequest,
) -> Result<GetGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.get_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_group".into()))
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
async fn list_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListGroupRequest,
) -> Result<ListGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.list_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_group".into()))
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
async fn update_group_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateGroupMemberRequest,
) -> Result<UpdateGroupMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.update_group_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_group_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_group_member".into()),
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
async fn leave_group<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LeaveGroupRequest,
) -> Result<LeaveGroupResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.leave_group(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == leave_group_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("leave_group".into()))
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
async fn change_group_owner<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ChangeGroupOwnerRequest,
) -> Result<ChangeGroupOwnerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.change_group_owner(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == change_group_owner_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("change_group_owner".into()),
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
async fn list_group_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListGroupMemberRequest,
) -> Result<ListGroupMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.list_group_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_group_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_group_member".into()),
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
async fn list_all_group_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAllGroupMemberRequest,
) -> Result<ListAllGroupMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.list_all_group_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_all_group_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_all_group_member".into()),
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
async fn send_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SendMsgRequest,
) -> Result<SendMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.send_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == send_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("send_msg".into()))
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
async fn update_msg_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMsgContentRequest,
) -> Result<UpdateMsgContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.update_msg_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_msg_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_msg_content".into()))
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
async fn list_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMsgRequest,
) -> Result<ListMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.list_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_msg".into()))
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
async fn list_all_last_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAllLastMsgRequest,
) -> Result<ListAllLastMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.list_all_last_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_all_last_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_all_last_msg".into()),
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
async fn get_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMsgRequest,
) -> Result<GetMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.get_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_msg".into()))
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
async fn get_last_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetLastMsgRequest,
) -> Result<GetLastMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.get_last_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_last_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_last_msg".into()))
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
async fn clear_unread<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ClearUnreadRequest,
) -> Result<ClearUnreadResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChatApiClient::new(chan.unwrap());
    match client.clear_unread(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == clear_unread_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("clear_unread".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectChatApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectChatApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_group,
                update_group,
                remove_group,
                get_group,
                list_group,
                update_group_member,
                leave_group,
                change_group_owner,
                list_group_member,
                list_all_group_member,
                send_msg,
                update_msg_content,
                list_msg,
                list_all_last_msg,
                get_msg,
                get_last_msg,
                clear_unread,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectChatApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_chat_api"
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
