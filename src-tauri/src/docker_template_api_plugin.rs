use proto_gen_rust::docker_template_api::docker_template_api_client::DockerTemplateApiClient;
use proto_gen_rust::docker_template_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn list_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListCateRequest,
) -> Result<ListCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_app_with_template<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListAppWithTemplateRequest,
) -> Result<ListAppWithTemplateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.list_app_with_template(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_app_with_template<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetAppWithTemplateRequest,
) -> Result<GetAppWithTemplateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DockerTemplateApiClient::new(chan.unwrap());
    match client.get_app_with_template(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct DockerTemplateApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DockerTemplateApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_cate,
                list_app_with_template,
                get_app_with_template,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DockerTemplateApiPlugin<R> {
    fn name(&self) -> &'static str {
        "docker_template_api"
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