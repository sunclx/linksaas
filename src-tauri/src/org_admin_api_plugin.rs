use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::org_api::org_admin_api_client::OrgAdminApiClient;
use proto_gen_rust::org_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_depart_ment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminCreateDepartMentRequest,
) -> Result<AdminCreateDepartMentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.create_depart_ment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_create_depart_ment_response::Code::WrongSession as i32
                || inner_resp.code == admin_create_depart_ment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_depart_ment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_depart_ment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateDepartMentRequest,
) -> Result<AdminUpdateDepartMentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.update_depart_ment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_depart_ment_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_depart_ment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_depart_ment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_depart_ment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListDepartMentRequest,
) -> Result<AdminListDepartMentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.list_depart_ment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_depart_ment_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_depart_ment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_depart_ment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn move_depart_ment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminMoveDepartMentRequest,
) -> Result<AdminMoveDepartMentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.move_depart_ment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_move_depart_ment_response::Code::WrongSession as i32
                || inner_resp.code == admin_move_depart_ment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("move_depart_ment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_depart_ment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveDepartMentRequest,
) -> Result<AdminRemoveDepartMentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.remove_depart_ment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_depart_ment_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_depart_ment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_depart_ment".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_depart_ment_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddDepartMentUserRequest,
) -> Result<AdminAddDepartMentUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.add_depart_ment_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_depart_ment_user_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_depart_ment_user_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_depart_ment_user".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_depart_ment_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveDepartMentUserRequest,
) -> Result<AdminRemoveDepartMentUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.remove_depart_ment_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_depart_ment_user_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_depart_ment_user_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_depart_ment_user".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_depart_ment_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListDepartMentUserRequest,
) -> Result<AdminListDepartMentUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = OrgAdminApiClient::new(chan.unwrap());
    match client.list_depart_ment_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_depart_ment_user_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_depart_ment_user_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_depart_ment_user".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct OrgAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> OrgAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_depart_ment,
                update_depart_ment,
                list_depart_ment,
                move_depart_ment,
                remove_depart_ment,
                add_depart_ment_user,
                remove_depart_ment_user,
                list_depart_ment_user,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for OrgAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "org_admin_api"
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