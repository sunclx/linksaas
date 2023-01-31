use crate::events_api_plugin::{convert_event, PluginEvent};
use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::events_api::events_admin_api_client::EventsAdminApiClient;
use proto_gen_rust::events_api::*;
use std::vec;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListEvResponse {
    pub code: i32,
    pub err_msg: String,
    pub total_count: u32,
    pub event_list: vec::Vec<PluginEvent>,
}

#[tauri::command]
async fn list_user_ev<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListUserEvRequest,
) -> Result<PluginListEvResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsAdminApiClient::new(chan.unwrap());
    match client.list_user_ev(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_user_ev_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_user_ev_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_user_ev".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(PluginListEvResponse {
                code: inner_resp.code,
                err_msg: inner_resp.err_msg,
                total_count: inner_resp.total_count,
                event_list: convert_event(inner_resp.event_list),
            });
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_project_ev<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListProjectEvRequest,
) -> Result<PluginListEvResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsAdminApiClient::new(chan.unwrap());
    match client.list_project_ev(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_project_ev_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_project_ev_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_project_ev".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(PluginListEvResponse {
                code: inner_resp.code,
                err_msg: inner_resp.err_msg,
                total_count: inner_resp.total_count,
                event_list: convert_event(inner_resp.event_list),
            });
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct EventsAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> EventsAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_user_ev,
                list_project_ev,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for EventsAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "events_admin_api"
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