use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_issue_api::project_issue_api_client::ProjectIssueApiClient;
use proto_gen_rust::project_issue_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRequest,
) -> Result<CreateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.create(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.get(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn assign_exec_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AssignExecUserRequest,
) -> Result<AssignExecUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.assign_exec_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == assign_exec_user_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("assign_exec_user".into()),
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
async fn assign_check_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AssignCheckUserRequest,
) -> Result<AssignCheckUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.assign_check_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == assign_check_user_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("assign_check_user".into()),
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
async fn change_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ChangeStateRequest,
) -> Result<ChangeStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.change_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == change_state_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("change_state".into()))
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
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_by_id<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListByIdRequest,
) -> Result<ListByIdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_by_id(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_by_id_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_by_id".into()))
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
async fn list_my_todo<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMyTodoRequest,
) -> Result<ListMyTodoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_my_todo(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_my_todo_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_my_todo".into()))
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
async fn list_attr_value<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAttrValueRequest,
) -> Result<ListAttrValueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_attr_value(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_attr_value_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_attr_value".into()))
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
async fn link_sprit<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LinkSpritRequest,
) -> Result<LinkSpritResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.link_sprit(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == link_sprit_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("link_sprit".into()))
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
async fn set_start_time<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetStartTimeRequest,
) -> Result<SetStartTimeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_start_time(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_start_time_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_start_time".into()))
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
async fn set_end_time<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetEndTimeRequest,
) -> Result<SetEndTimeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_end_time(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_end_time_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_end_time".into()))
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
async fn set_estimate_minutes<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetEstimateMinutesRequest,
) -> Result<SetEstimateMinutesResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_estimate_minutes(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_estimate_minutes_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_estimate_minutes".into()),
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
async fn set_remain_minutes<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetRemainMinutesRequest,
) -> Result<SetRemainMinutesResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_remain_minutes(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_remain_minutes_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_remain_minutes".into()),
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
async fn get_member_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMemberStateRequest,
) -> Result<GetMemberStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.get_member_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_member_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_member_state".into()),
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
async fn list_member_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMemberStateRequest,
) -> Result<ListMemberStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_member_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_member_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_member_state".into()),
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
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
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
async fn list_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListCommentRequest,
) -> Result<ListCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_comment_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_comment".into()))
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
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.remove_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_comment_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_comment".into()))
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
async fn create_sub_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateSubIssueRequest,
) -> Result<CreateSubIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.create_sub_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_sub_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_sub_issue".into()),
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
async fn update_sub_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSubIssueRequest,
) -> Result<UpdateSubIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update_sub_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_sub_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_sub_issue".into()),
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
async fn update_sub_issue_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSubIssueStateRequest,
) -> Result<UpdateSubIssueStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update_sub_issue_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_sub_issue_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_sub_issue_state".into()),
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
async fn list_sub_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSubIssueRequest,
) -> Result<ListSubIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_sub_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_sub_issue_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_sub_issue".into()))
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
async fn remove_sub_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveSubIssueRequest,
) -> Result<RemoveSubIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.remove_sub_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_sub_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_sub_issue".into()),
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
async fn add_dependence<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddDependenceRequest,
) -> Result<AddDependenceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.add_dependence(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_dependence_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_dependence".into()))
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
async fn remove_dependence<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveDependenceRequest,
) -> Result<RemoveDependenceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.remove_dependence(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_dependence_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_dependence".into()),
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
async fn list_my_depend<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMyDependRequest,
) -> Result<ListMyDependResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_my_depend(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_my_depend_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_my_depend".into()))
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
async fn list_depend_me<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListDependMeRequest,
) -> Result<ListDependMeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_depend_me(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_depend_me_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_depend_me".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectIssueApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectIssueApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                get,
                remove,
                update,
                assign_exec_user,
                assign_check_user,
                change_state,
                list,
                list_by_id,
                list_my_todo,
                list_attr_value,
                link_sprit,
                set_start_time,
                set_end_time,
                set_estimate_minutes,
                set_remain_minutes,
                get_member_state,
                list_member_state,
                add_comment,
                list_comment,
                remove_comment,
                create_sub_issue,
                update_sub_issue,
                update_sub_issue_state,
                list_sub_issue,
                remove_sub_issue,
                add_dependence,
                remove_dependence,
                list_my_depend,
                list_depend_me,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectIssueApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_issue_api"
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
