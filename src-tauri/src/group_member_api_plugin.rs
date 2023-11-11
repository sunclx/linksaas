use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::group_member_api::group_member_api_client::GroupMemberApiClient;
use proto_gen_rust::group_member_api::*;
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
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.gen_invite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == gen_invite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("gen_invite".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_invite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListInviteRequest,
) -> Result<ListInviteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.list_invite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_invite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_invite".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_invite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveInviteRequest,
) -> Result<RemoveInviteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.remove_invite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_invite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_invite".into())) {
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
    let mut client = GroupMemberApiClient::new(chan.unwrap());
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
async fn join_pub<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: JoinPubRequest,
) -> Result<JoinPubResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.join_pub(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == join_pub_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("join_pub".into())) {
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
    let mut client = GroupMemberApiClient::new(chan.unwrap());
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
async fn remove_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveMemberRequest,
) -> Result<RemoveMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.remove_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_member".into())) {
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
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.list_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_member".into())) {
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
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.get_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_member".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMemberRequest,
) -> Result<UpdateMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupMemberApiClient::new(chan.unwrap());
    match client.update_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_member_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_member".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct GroupMemberApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> GroupMemberApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                gen_invite,
                list_invite,
                remove_invite,
                join,
                join_pub,
                leave,
                remove_member,
                list_member,
                get_member,
                update_member,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for GroupMemberApiPlugin<R> {
    fn name(&self) -> &'static str {
        "group_member_api"
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
