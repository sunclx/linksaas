use proto_gen_rust::swarm_proxy_api::swarm_proxy_api_client::SwarmProxyApiClient;
use proto_gen_rust::swarm_proxy_api::*;
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
async fn list_name_space(
    serv_addr: String,
    request: ListNameSpaceRequest,
) -> Result<ListNameSpaceResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.list_name_space(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_service(
    serv_addr: String,
    request: ListServiceRequest,
) -> Result<ListServiceResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.list_service(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_task(
    serv_addr: String,
    request: ListTaskRequest,
) -> Result<ListTaskResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.list_task(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_image(
    serv_addr: String,
    request: UpdateImageRequest,
) -> Result<UpdateImageResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.update_image(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_scale(
    serv_addr: String,
    request: UpdateScaleRequest,
) -> Result<UpdateScaleResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.update_scale(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_perm(
    serv_addr: String,
    request: GetPermRequest,
) -> Result<GetPermResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.get_perm(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_perm(
    serv_addr: String,
    request: SetPermRequest,
) -> Result<SetPermResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.set_perm(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn open_log(
    serv_addr: String,
    request: OpenLogRequest,
) -> Result<OpenLogResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.open_log(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn read_log(
    serv_addr: String,
    request: ReadLogRequest,
) -> Result<ReadLogResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.read_log(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn open_term(
    serv_addr: String,
    request: OpenTermRequest,
) -> Result<OpenTermResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.open_term(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn write_term(
    serv_addr: String,
    request: WriteTermRequest,
) -> Result<WriteTermResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.write_term(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn read_term(
    serv_addr: String,
    request: ReadTermRequest,
) -> Result<ReadTermResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.read_term(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_term_size(
    serv_addr: String,
    request: SetTermSizeRequest,
) -> Result<SetTermSizeResponse, String> {
    let chan = conn_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = SwarmProxyApiClient::new(chan.unwrap());
    match client.set_term_size(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct SwarmProxyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> SwarmProxyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_name_space,
                list_service,
                list_task,
                update_image,
                update_scale,
                get_perm,
                set_perm,
                open_log,
                read_log,
                open_term,
                write_term,
                read_term,
                set_term_size,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for SwarmProxyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "swarm_proxy_api"
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