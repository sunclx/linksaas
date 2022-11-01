use proto_gen_rust::link_aux_api::link_aux_api_client::LinkAuxApiClient;
use proto_gen_rust::link_aux_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

use crate::notice_decode::new_wrong_session_notice;
#[tauri::command]
async fn check_access_project<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessProjectRequest,
) -> Result<CheckAccessProjectResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_project(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_project_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_project".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn check_access_channel<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessChannelRequest,
) -> Result<CheckAccessChannelResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_channel(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_channel_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_channel".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn check_access_event<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessEventRequest,
) -> Result<CheckAccessEventResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_event(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_event_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_event".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn check_access_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessDocRequest,
) -> Result<CheckAccessDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_doc".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn check_access_issue<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessIssueRequest,
) -> Result<CheckAccessIssueResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_issue(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_issue_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_issue".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn check_access_appraise<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessAppraiseRequest,
) -> Result<CheckAccessAppraiseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_appraise(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_appraise_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_appraise".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn check_access_user_kb<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessUserKbRequest,
) -> Result<CheckAccessUserKbResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_user_kb(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_user_kb_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_user_kb".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


#[tauri::command]
async fn check_access_robot_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CheckAccessRobotMetricRequest,
) -> Result<CheckAccessRobotMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = LinkAuxApiClient::new(chan.unwrap());
    match client.check_access_robot_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == check_access_robot_metric_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("check_access_robot_metric".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct LinkAuxApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> LinkAuxApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                check_access_project,
                check_access_channel,
                check_access_event,
                check_access_doc,
                check_access_issue,
                check_access_appraise,
                check_access_user_kb,
                check_access_robot_metric,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for LinkAuxApiPlugin<R> {
    fn name(&self) -> &'static str {
        "link_aux_api"
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
