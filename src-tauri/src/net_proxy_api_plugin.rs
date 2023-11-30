use proto_gen_rust::net_proxy_api::net_proxy_api_client::NetProxyApiClient;
use proto_gen_rust::net_proxy_api::*;
use std::time::Duration;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tonic::transport::{Channel, Endpoint};

async fn conn_server(addr: String) -> Result<Channel, String> {
    let mut u = url::Url::parse(&addr);
    if u.is_err() {
        let new_addr = format!("http://{}", addr);
        u = url::Url::parse(&new_addr);
        if u.is_err() {
            return Err(u.err().unwrap().to_string());
        }
    }
    let mut u = u.unwrap();
    if let Err(_) = u.set_scheme("http") {
        return Err("set schema failed".into());
    }
    if u.port().is_none() {
        return Err("miss port".into());
    }
    let end_point = Endpoint::from_shared(String::from(u));
    if end_point.is_err() {
        return Err(end_point.err().unwrap().to_string());
    }
    let end_point = end_point.unwrap();
    let chan = end_point
        .tcp_keepalive(Some(Duration::new(300, 0)))
        .connect()
        .await;
    if chan.is_err() {
        return Err(chan.err().unwrap().to_string());
    }
    return Ok(chan.unwrap());
}

#[tauri::command]
async fn list_end_point(
    serv_addr: String,
    request: ListEndPointRequest,
) -> Result<ListEndPointResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = NetProxyApiClient::new(chan.unwrap());
    match client.list_end_point(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_tunnel(
    serv_addr: String,
    request: CreateTunnelRequest,
) -> Result<CreateTunnelResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = NetProxyApiClient::new(chan.unwrap());
    match client.create_tunnel(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct NetProxyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> NetProxyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![list_end_point, create_tunnel,]),
        }
    }
}

impl<R: Runtime> Plugin<R> for NetProxyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "net_proxy_api"
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
