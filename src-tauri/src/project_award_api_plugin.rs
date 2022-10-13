use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_award_api::project_award_api_client::ProjectAwardApiClient;
use proto_gen_rust::project_award_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListStateRequest,
) -> Result<ListStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAwardApiClient::new(chan.unwrap());
    match client.list_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_state_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_state".into()))
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
async fn list_record<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRecordRequest,
) -> Result<ListRecordResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAwardApiClient::new(chan.unwrap());
    match client.list_record(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_record_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_record".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectAwardApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectAwardApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![list_state, list_record,]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectAwardApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_award_api"
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
