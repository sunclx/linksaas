use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::group_post_api::group_post_admin_api_client::GroupPostAdminApiClient;
use proto_gen_rust::group_post_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_audit<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListAuditRequest,
) -> Result<AdminListAuditResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostAdminApiClient::new(chan.unwrap());
    match client.list_audit(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_audit_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_audit_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_audit".into()))
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
async fn agree_recommend<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAgreeRecommendRequest,
) -> Result<AdminAgreeRecommendResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostAdminApiClient::new(chan.unwrap());
    match client.agree_recommend(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_agree_recommend_response::Code::WrongSession as i32
                || inner_resp.code == admin_agree_recommend_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("agree_recommend".into()))
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
async fn refuse_recommend<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRefuseRecommendRequest,
) -> Result<AdminRefuseRecommendResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = GroupPostAdminApiClient::new(chan.unwrap());
    match client.refuse_recommend(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_refuse_recommend_response::Code::WrongSession as i32
                || inner_resp.code == admin_refuse_recommend_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("refuse_recommend".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct GroupPostAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> GroupPostAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_audit,
                agree_recommend,
                refuse_recommend
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for GroupPostAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "group_post_admin_api"
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
