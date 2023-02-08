use crate::{
    min_app_plugin::get_min_app_perm, notice_decode::new_wrong_session_notice,
    user_api_plugin::{get_user_id, get_session},
};
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
async fn update_title<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTitleRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update_title(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_title".into()))
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
async fn update_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateContentRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_content".into()))
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
async fn update_extra_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateExtraInfoRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.update_extra_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_extra_info".into()),
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
    let mut new_request = request.clone();
    if let Some(min_app_perm) = get_min_app_perm(
        app_handle.clone(),
        window.clone(),
        new_request.project_id.clone(),
    )
    .await
    {
        let issue_perm = min_app_perm.issue_perm;
        if issue_perm.is_none() {
            return Err("no permission".into());
        }
        let issue_perm = issue_perm.unwrap();
        let list_param = request.list_param;
        if list_param.is_none() {
            return Err("no permission".into());
        }
        let list_param = list_param.unwrap();

        let mut filter_user_list = Vec::new();

        if list_param.filter_by_assgin_user_id {
            for user_id in &list_param.assgin_user_id_list {
                if filter_user_list.contains(user_id) == false {
                    filter_user_list.push(user_id.clone());
                }
            }
        }
        if list_param.filter_by_create_user_id {
            for user_id in &list_param.create_user_id_list {
                if filter_user_list.contains(user_id) == false {
                    filter_user_list.push(user_id.clone());
                }
            }
        }
        let mut valid = true;
        let cur_user_id = get_user_id(app_handle.clone()).await;
        if list_param.filter_by_issue_type == false {
            if issue_perm.list_all_bug && issue_perm.list_all_task {
                valid = true;
            } else if issue_perm.list_my_bug
                && issue_perm.list_my_task
                && filter_user_list.len() == 1
                && filter_user_list.get(0).unwrap() == &cur_user_id
            {
                valid = true;
            }
        } else {
            if list_param.issue_type == IssueType::Task as i32 {
                if issue_perm.list_all_task {
                    valid = true;
                } else if issue_perm.list_my_task
                    && filter_user_list.len() == 1
                    && filter_user_list.get(0).unwrap() == &cur_user_id
                {
                    valid = true;
                }
            } else if list_param.issue_type == IssueType::Bug as i32 {
                if issue_perm.list_all_bug {
                    valid = true;
                } else if issue_perm.list_my_bug
                    && filter_user_list.len() == 1
                    && filter_user_list.get(0).unwrap() == &cur_user_id
                {
                    valid = true;
                }
            }
        }

        if valid {
            new_request.session_id = get_session(app_handle.clone()).await;
        }
    }
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list(new_request).await {
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
async fn list_id<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListIdRequest,
) -> Result<ListIdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.list_id(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_id_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_id".into()))
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
async fn cancel_link_sprit<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelLinkSpritRequest,
) -> Result<CancelLinkSpritResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.cancel_link_sprit(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_link_sprit_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("cancel_link_sprit".into()),
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
async fn cancel_start_time<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelStartTimeRequest,
) -> Result<CancelStartTimeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.cancel_start_time(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_start_time_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("cancel_start_time".into()),
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
async fn cancel_end_time<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelEndTimeRequest,
) -> Result<CancelEndTimeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.cancel_end_time(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_end_time_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("cancel_end_time".into()))
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
async fn cancel_estimate_minutes<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelEstimateMinutesRequest,
) -> Result<CancelEstimateMinutesResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.cancel_estimate_minutes(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_estimate_minutes_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("cancel_estimate_minutes".into()),
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
async fn cancel_remain_minutes<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CancelRemainMinutesRequest,
) -> Result<CancelRemainMinutesResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.cancel_remain_minutes(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == cancel_remain_minutes_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("cancel_remain_minutes".into()),
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

#[tauri::command]
async fn set_exec_award<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetExecAwardRequest,
) -> Result<SetExecAwardResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_exec_award(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_exec_award_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_exec_award".into()))
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
async fn set_check_award<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetCheckAwardRequest,
) -> Result<SetCheckAwardResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    match client.set_check_award(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_check_award_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_check_award".into()))
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
                update_title,
                update_content,
                update_extra_info,
                assign_exec_user,
                assign_check_user,
                change_state,
                list,
                list_id,
                list_by_id,
                list_my_todo,
                list_attr_value,
                link_sprit,
                cancel_link_sprit,
                set_start_time,
                set_end_time,
                set_estimate_minutes,
                set_remain_minutes,
                cancel_start_time,
                cancel_end_time,
                cancel_estimate_minutes,
                cancel_remain_minutes,
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
                set_exec_award,
                set_check_award,
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
