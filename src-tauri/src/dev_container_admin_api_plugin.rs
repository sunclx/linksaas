use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::dev_container_api::dev_container_admin_api_client::DevContainerAdminApiClient;
use proto_gen_rust::dev_container_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn add_package<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddPackageRequest,
) -> Result<AdminAddPackageResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerAdminApiClient::new(chan.unwrap());
    match client.add_package(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_package_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_package_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_package".into()))
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
async fn remove_package<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemovePackageRequest,
) -> Result<AdminRemovePackageResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerAdminApiClient::new(chan.unwrap());
    match client.remove_package(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_package_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_package_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_package".into()))
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
async fn add_package_version<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddPackageVersionRequest,
) -> Result<AdminAddPackageVersionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerAdminApiClient::new(chan.unwrap());
    match client.add_package_version(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_package_version_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_package_version_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("add_package_version".into()),
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
async fn remove_package_version<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemovePackageVersionRequest,
) -> Result<AdminRemovePackageVersionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DevContainerAdminApiClient::new(chan.unwrap());
    match client.remove_package_version(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_package_version_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_package_version_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_package_version".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct DevContainerAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DevContainerAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_package,
                remove_package,
                add_package_version,
                remove_package_version,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DevContainerAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "dev_container_admin_api"
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
