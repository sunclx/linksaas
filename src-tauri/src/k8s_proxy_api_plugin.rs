use proto_gen_rust::k8s_proxy_api::k8s_proxy_api_client::K8sProxyApiClient;
use proto_gen_rust::k8s_proxy_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use crate::conn_extern_server;


#[tauri::command]
async fn get_resource(
    serv_addr: String,
    request: GetResourceRequest,
) -> Result<GetResourceResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.get_resource(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_resource(
    serv_addr: String,
    request: ListResourceRequest,
) -> Result<ListResourceResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.list_resource(request).await {
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.update_scale(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_resource_perm(
    serv_addr: String,
    request: ListResourcePermRequest,
) -> Result<ListResourcePermResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.list_resource_perm(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_resource_perm(
    serv_addr: String,
    request: SetResourcePermRequest,
) -> Result<SetResourcePermResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.set_resource_perm(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn open_log(serv_addr: String, request: OpenLogRequest) -> Result<OpenLogResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.open_log(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn read_log(serv_addr: String, request: ReadLogRequest) -> Result<ReadLogResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
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
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = K8sProxyApiClient::new(chan.unwrap());
    match client.set_term_size(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct K8sProxyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> K8sProxyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                get_resource,
                list_resource,
                update_image,
                update_scale,
                list_resource_perm,
                set_resource_perm,
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

impl<R: Runtime> Plugin<R> for K8sProxyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "k8s_proxy_api"
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
