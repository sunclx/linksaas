use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::appstore_api::appstore_admin_api_client::AppstoreAdminApiClient;
use proto_gen_rust::appstore_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_major_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminCreateMajorCateRequest,
) -> Result<AdminCreateMajorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.create_major_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_create_major_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_create_major_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_major_cate".into()),
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
async fn update_major_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateMajorCateRequest,
) -> Result<AdminUpdateMajorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_major_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_major_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_major_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_major_cate".into()),
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
async fn remove_major_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveMajorCateRequest,
) -> Result<AdminRemoveMajorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.remove_major_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_major_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_major_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_major_cate".into()),
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
async fn create_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminCreateMinorCateRequest,
) -> Result<AdminCreateMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.create_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_create_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_create_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_minor_cate".into()),
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
async fn update_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateMinorCateRequest,
) -> Result<AdminUpdateMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_minor_cate".into()),
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
async fn remove_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveMinorCateRequest,
) -> Result<AdminRemoveMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.remove_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_minor_cate".into()),
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
async fn create_sub_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminCreateSubMinorCateRequest,
) -> Result<AdminCreateSubMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.create_sub_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_create_sub_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_create_sub_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_sub_minor_cate".into()),
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
async fn update_sub_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateSubMinorCateRequest,
) -> Result<AdminUpdateSubMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_sub_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_sub_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_sub_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_sub_minor_cate".into()),
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
async fn remove_sub_minor_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveSubMinorCateRequest,
) -> Result<AdminRemoveSubMinorCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.remove_sub_minor_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_sub_minor_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_sub_minor_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_sub_minor_cate".into()),
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
async fn add_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddAppRequest,
) -> Result<AdminAddAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.add_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_app_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_app_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_app".into()))
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
async fn update_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateAppRequest,
) -> Result<AdminUpdateAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_app_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_app_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_app".into()))
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
async fn update_app_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateAppFileRequest,
) -> Result<AdminUpdateAppFileResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_app_file(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_app_file_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_app_file_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_app_file".into()))
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
async fn remove_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveAppRequest,
) -> Result<AdminRemoveAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.remove_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_app_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_app_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_app".into()))
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
async fn move_app<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminMoveAppRequest,
) -> Result<AdminMoveAppResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.move_app(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_move_app_response::Code::WrongSession as i32
                || inner_resp.code == admin_move_app_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("move_app".into()))
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
async fn update_app_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateAppPermRequest,
) -> Result<AdminUpdateAppPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_app_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_app_perm_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_app_perm_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_app_perm".into()))
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
async fn update_app_os<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateAppOsRequest,
) -> Result<AdminUpdateAppOsResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_app_os(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_app_os_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_app_os_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_app_os".into()))
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
async fn update_app_scope<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateAppScopeRequest,
) -> Result<AdminUpdateAppScopeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.update_app_scope(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_app_scope_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_app_scope_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_app_scope".into()),
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
async fn remove_comment<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveCommentRequest,
) -> Result<AdminRemoveCommentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AppstoreAdminApiClient::new(chan.unwrap());
    match client.remove_comment(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_comment_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_comment_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_comment".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct AppstoreAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> AppstoreAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_major_cate,
                update_major_cate,
                remove_major_cate,
                create_minor_cate,
                update_minor_cate,
                remove_minor_cate,
                create_sub_minor_cate,
                update_sub_minor_cate,
                remove_sub_minor_cate,
                add_app,
                update_app,
                update_app_file,
                remove_app,
                move_app,
                update_app_perm,
                update_app_os,
                update_app_scope,
                remove_comment,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for AppstoreAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "appstore_admin_api"
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