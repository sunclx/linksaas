use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_alarm_api::project_alarm_api_client::ProjectAlarmApiClient;
use proto_gen_rust::project_alarm_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn set_config<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetConfigRequest,
) -> Result<SetConfigResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAlarmApiClient::new(chan.unwrap());
    match client.set_config(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_config_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_config".into()))
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
async fn get_config<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetConfigRequest,
) -> Result<GetConfigResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAlarmApiClient::new(chan.unwrap());
    match client.get_config(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_config_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_config".into()))
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
async fn get_alarm_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetAlarmStateRequest,
) -> Result<GetAlarmStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAlarmApiClient::new(chan.unwrap());
    match client.get_alarm_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_alarm_state_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_alarm_state".into()))
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
async fn list_alarm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAlarmRequest,
) -> Result<ListAlarmResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAlarmApiClient::new(chan.unwrap());
    match client.list_alarm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_alarm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_alarm".into()))
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
async fn remove_alarm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveAlarmRequest,
) -> Result<RemoveAlarmResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAlarmApiClient::new(chan.unwrap());
    match client.remove_alarm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_alarm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_alarm".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectAlarmApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectAlarmApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                set_config,
                get_config,
                get_alarm_state,
                list_alarm,
                remove_alarm,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectAlarmApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_alarm_api"
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
