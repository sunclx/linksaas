use proto_gen_rust::trace_proxy_api::trace_proxy_api_client::TraceProxyApiClient;
use proto_gen_rust::trace_proxy_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use crate::conn_extern_server;


#[tauri::command]
async fn list_service_name(
    serv_addr: String,
    request: ListServiceNameRequest,
) -> Result<ListServiceNameResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = TraceProxyApiClient::new(chan.unwrap());
    match client.list_service_name(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_root_span_name(
    serv_addr: String,
    request: ListRootSpanNameRequest,
) -> Result<ListRootSpanNameResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = TraceProxyApiClient::new(chan.unwrap());
    match client.list_root_span_name(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_trace(
    serv_addr: String,
    request: ListTraceRequest,
) -> Result<ListTraceResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = TraceProxyApiClient::new(chan.unwrap());
    match client.list_trace(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_trace(
    serv_addr: String,
    request: GetTraceRequest,
) -> Result<GetTraceResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = TraceProxyApiClient::new(chan.unwrap());
    match client.get_trace(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_span(
    serv_addr: String,
    request: ListSpanRequest,
) -> Result<ListSpanResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = TraceProxyApiClient::new(chan.unwrap());
    match client.list_span(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct TraceProxyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> TraceProxyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_service_name,
                list_root_span_name,
                list_trace,
                get_trace,
                list_span,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for TraceProxyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "trace_proxy_api"
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
