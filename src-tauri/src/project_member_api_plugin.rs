use crate::{min_app_plugin::get_min_app_perm, notice_decode::new_wrong_session_notice, user_api_plugin::get_session};
use proto_gen_rust::project_member_api::project_member_api_client::ProjectMemberApiClient;
use proto_gen_rust::project_member_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn gen_invite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GenInviteRequest,
) -> Result<GenInviteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.gen_invite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == gen_invite_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("gen_invite".into()))
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
async fn join<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: JoinRequest,
) -> Result<JoinResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.join(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == join_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("join".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn leave<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LeaveRequest,
) -> Result<LeaveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.leave(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == leave_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("leave".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn create_role<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRoleRequest,
) -> Result<CreateRoleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.create_role(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_role_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_role".into()))
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
async fn update_role<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRoleRequest,
) -> Result<UpdateRoleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.update_role(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_role_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_role".into()))
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
async fn remove_role<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRoleRequest,
) -> Result<RemoveRoleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.remove_role(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_role_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_role".into()))
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
async fn list_role<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRoleRequest,
) -> Result<ListRoleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.list_role(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_role_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_role".into()))
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
async fn remove_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveMemberRequest,
) -> Result<RemoveMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.remove_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_member".into()))
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
async fn set_member_role<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetMemberRoleRequest,
) -> Result<SetMemberRoleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.set_member_role(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_member_role_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_member_role".into()))
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
async fn list_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMemberRequest,
) -> Result<ListMemberResponse, String> {
    let mut new_request = request.clone();
    if let Some(min_app_perm) = get_min_app_perm(
        app_handle.clone(),
        window.clone(),
        new_request.project_id.clone(),
    )
    .await
    {
        let member_perm = min_app_perm.member_perm;
        if member_perm.is_none() {
            return Err("no permission".into());
        }
        if member_perm.unwrap().list_member == false {
            return Err("no permission".into());
        }
        new_request.session_id = get_session(app_handle.clone()).await;
    }

    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.list_member(new_request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_member".into()))
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
async fn get_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMemberRequest,
) -> Result<GetMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.get_member(request.clone()).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_member".into()))
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
pub async fn create_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateGoalRequest,
) -> Result<CreateGoalResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.create_goal(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_goal".into()))
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
pub async fn update_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateGoalRequest,
) -> Result<UpdateGoalResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.update_goal(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_goal".into()))
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
pub async fn list_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListGoalRequest,
) -> Result<ListGoalResponse, String> {
    let mut new_request = request.clone();
    if let Some(min_app_perm) = get_min_app_perm(
        app_handle.clone(),
        window.clone(),
        new_request.project_id.clone(),
    )
    .await{
        let member_perm = min_app_perm.member_perm;
        if member_perm.is_none() {
            return Err("no permission".into());
        }
        if member_perm.unwrap().list_goal_history == false {
            return Err("no permission".into());
        }
        new_request.session_id = get_session(app_handle.clone()).await;
    }

    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.list_goal(new_request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_goal".into()))
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
pub async fn remove_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveGoalRequest,
) -> Result<RemoveGoalResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.remove_goal(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_goal".into()))
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
pub async fn lock_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LockGoalRequest,
) -> Result<LockGoalResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.lock_goal(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == lock_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("lock_goal".into()))
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
pub async fn unlock_goal<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnlockGoalRequest,
) -> Result<UnlockGoalResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.unlock_goal(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unlock_goal_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("unlock_goal".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
pub struct ProjectMemberApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectMemberApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                gen_invite,
                join,
                leave,
                create_role,
                update_role,
                remove_role,
                list_role,
                remove_member,
                set_member_role,
                list_member,
                get_member,
                create_goal,
                update_goal,
                list_goal,
                remove_goal,
                lock_goal,
                unlock_goal,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectMemberApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_member_api"
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
