use proto_gen_rust::project_member_api::project_member_api_client::ProjectMemberApiClient;
use proto_gen_rust::project_member_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use crate::notice_decode::new_wrong_session_notice;


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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("gen_invite".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
        },
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
        Ok(response) =>{
            let inner_resp = response.into_inner();
            if inner_resp.code == leave_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("leave".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_role".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_role".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_role".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_role".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_member".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_member_role".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}


#[tauri::command]
async fn list_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMemberRequest,
) -> Result<ListMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.list_member(request.clone()).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_member".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_member".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_work_snap_shot<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetWorkSnapShotRequest,
) -> Result<SetWorkSnapShotResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.set_work_snap_shot(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_work_snap_shot_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_work_snap_shot".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
pub async fn get_work_snap_shot_status<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetWorkSnapShotStatusRequest,
) -> Result<GetWorkSnapShotStatusResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.get_work_snap_shot_status(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_work_snap_shot_status_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_work_snap_shot_status".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

pub async fn upload_work_snap_shot<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UploadWorkSnapShotRequest,
) -> Result<UploadWorkSnapShotResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    match client.upload_work_snap_shot(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == upload_work_snap_shot_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("upload_work_snap_shot".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
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
                set_work_snap_shot,
                get_work_snap_shot_status,
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
