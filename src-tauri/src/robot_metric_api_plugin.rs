use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::robot_metric_api::robot_metric_api_client::RobotMetricApiClient;
use proto_gen_rust::robot_metric_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMetricRequest,
) -> Result<ListMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotMetricApiClient::new(chan.unwrap());
    match client.list_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_metric_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_metric".into()),
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
async fn req_metric_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ReqMetricDataRequest,
) -> Result<ReqMetricDataResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotMetricApiClient::new(chan.unwrap());
    match client.req_metric_data(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == req_metric_data_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("req_metric_data".into()),
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
async fn read_metric_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ReadMetricDataRequest,
) -> Result<ReadMetricDataResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotMetricApiClient::new(chan.unwrap());
    match client.read_metric_data(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == read_metric_data_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("read_metric_data".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RobotMetricApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RobotMetricApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_metric,
                req_metric_data,
                read_metric_data,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RobotMetricApiPlugin<R> {
    fn name(&self) -> &'static str {
        "robot_metric_api"
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