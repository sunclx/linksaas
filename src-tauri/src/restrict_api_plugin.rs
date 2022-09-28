use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::restrict_api::restrict_api_client::RestrictApiClient;
use proto_gen_rust::restrict_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn get_project_restrict<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetProjectRestrictRequest,
) -> Result<GetProjectRestrictResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RestrictApiClient::new(chan.unwrap());
    match client.get_project_restrict(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_project_restrict_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_project_restrict".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RestrictApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RestrictApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![get_project_restrict]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RestrictApiPlugin<R> {
    fn name(&self) -> &'static str {
        "restrict_api"
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