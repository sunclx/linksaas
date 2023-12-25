use proto_gen_rust::dev_container_api::dev_container_api_client::DevContainerApiClient;
use proto_gen_rust::dev_container_api::*;
use substring::Substring;
use tauri::{
    api::process::Command,
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FindResult {
    pub container_id: String,
    pub state: String,
    pub server_port: u16,
    pub dev_cfg: String,
    pub repo_path: String,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct ExecResult {
    pub success: bool,
    pub data: FindResult,
}

#[tauri::command]
async fn list_package(
    request: ListPackageRequest,
) -> Result<ListPackageResponse, String> {
    let chan = super::conn_extern_server(String::from(super::DEFAULT_GRPC_SERVER_ADD)).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = DevContainerApiClient::new(chan.unwrap());
    match client.list_package(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_package_version(
    request: ListPackageVersionRequest,
) -> Result<ListPackageVersionResponse, String> {
    let chan = super::conn_extern_server(String::from(super::DEFAULT_GRPC_SERVER_ADD)).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = DevContainerApiClient::new(chan.unwrap());
    match client.list_package_version(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

pub async fn clear_by_close(label: String) {
    if label.starts_with("devc:") == false {
        return;
    }
    let repo_id = label.substring(5, label.len());
    let cmd = Command::new_sidecar("devc");
    if cmd.is_err() {
        return;
    }
    let cmd = cmd.unwrap();
    let cmd = cmd.args(vec!["container", "find", repo_id]);
    let res = cmd.output();
    if res.is_err() {
        return;
    }
    let res = res.unwrap();
    let find_res: Result<ExecResult, serde_json::Error> = serde_json::from_str(&res.stdout);
    if find_res.is_err() {
        return;
    }
    let find_res = find_res.unwrap();
    if find_res.success == false {
        return;
    }
    let find_res = find_res.data;
    if &find_res.container_id == "" {
        return;
    }
    //停止容器
    let cmd = Command::new_sidecar("devc");
    if cmd.is_err() {
        return;
    }
    let cmd = cmd.unwrap();
    let cmd = cmd.args(vec!["container", "stop", &find_res.container_id]);
    let res = cmd.output();
    if res.is_err() {
        return;
    }
}

pub struct DevContainerApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DevContainerApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![list_package, list_package_version]),
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
