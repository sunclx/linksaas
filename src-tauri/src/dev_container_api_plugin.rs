use proto_gen_rust::dev_container_api::dev_container_api_client::DevContainerApiClient;
use proto_gen_rust::dev_container_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_package<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListPackageRequest,
) -> Result<ListPackageResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerApiClient::new(chan.unwrap());
    match client.list_package(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_package_version<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListPackageVersionRequest,
) -> Result<ListPackageVersionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerApiClient::new(chan.unwrap());
    match client.list_package_version(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}


pub struct DevContainerApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DevContainerApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_package,
                list_package_version,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DevContainerApiPlugin<R> {
    fn name(&self) -> &'static str {
        "dev_container_api"
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
