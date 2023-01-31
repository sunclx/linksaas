use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::client_cfg_api::client_cfg_admin_api_client::ClientCfgAdminApiClient;
use proto_gen_rust::client_cfg_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};


#[tauri::command]
async fn list_extra_menu<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListExtraMenuRequest,
) -> Result<AdminListExtraMenuResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.list_extra_menu(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_extra_menu_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_extra_menu_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_extra_menu".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_extra_menu_weight<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminSetExtraMenuWeightRequest,
) -> Result<AdminSetExtraMenuWeightResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.set_extra_menu_weight(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_set_extra_menu_weight_response::Code::WrongSession as i32
                || inner_resp.code == admin_set_extra_menu_weight_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_extra_menu_weight".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_extra_menu<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddExtraMenuRequest,
) -> Result<AdminAddExtraMenuResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.add_extra_menu(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_extra_menu_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_extra_menu_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_extra_menu".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_extra_menu<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveExtraMenuRequest,
) -> Result<AdminRemoveExtraMenuResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.remove_extra_menu(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_extra_menu_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_extra_menu_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_extra_menu".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_ad<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListAdRequest,
) -> Result<AdminListAdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.list_ad(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_ad_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_ad_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_ad".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_ad_weight<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminSetAdWeightRequest,
) -> Result<AdminSetAdWeightResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.set_ad_weight(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_set_ad_weight_response::Code::WrongSession as i32
                || inner_resp.code == admin_set_ad_weight_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_ad_weight".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_ad<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddAdRequest,
) -> Result<AdminAddAdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.add_ad(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_ad_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_ad_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_ad".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_ad<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveAdRequest,
) -> Result<AdminRemoveAdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgAdminApiClient::new(chan.unwrap());
    match client.remove_ad(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_ad_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_ad_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_ad".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ClientCfgAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ClientCfgAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_extra_menu,
                set_extra_menu_weight,
                add_extra_menu,
                remove_extra_menu,
                list_ad,
                set_ad_weight,
                add_ad,
                remove_ad,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ClientCfgAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "client_cfg_admin_api"
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