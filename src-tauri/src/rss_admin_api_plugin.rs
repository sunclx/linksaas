use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::rss_api::rss_admin_api_client::RssAdminApiClient;
use proto_gen_rust::rss_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn add_crawler<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddCrawlerRequest,
) -> Result<AdminAddCrawlerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssAdminApiClient::new(chan.unwrap());
    match client.add_crawler(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_crawler_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_crawler_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_crawler".into()))
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
async fn renew_crawler_token<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRenewCrawlerTokenRequest,
) -> Result<AdminRenewCrawlerTokenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssAdminApiClient::new(chan.unwrap());
    match client.renew_crawler_token(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_renew_crawler_token_response::Code::WrongSession as i32
                || inner_resp.code == admin_renew_crawler_token_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("renew_crawler_token".into()))
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
async fn set_crawler_run_time<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminSetCrawlerRunTimeRequest,
) -> Result<AdminSetCrawlerRunTimeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssAdminApiClient::new(chan.unwrap());
    match client.set_crawler_run_time(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_set_crawler_run_time_response::Code::WrongSession as i32
                || inner_resp.code == admin_set_crawler_run_time_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_crawler_run_time".into()))
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
async fn list_crawler<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminListCrawlerRequest,
) -> Result<AdminListCrawlerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssAdminApiClient::new(chan.unwrap());
    match client.list_crawler(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_list_crawler_response::Code::WrongSession as i32
                || inner_resp.code == admin_list_crawler_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_crawler".into()))
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
async fn remove_crawler<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveCrawlerRequest,
) -> Result<AdminRemoveCrawlerResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RssAdminApiClient::new(chan.unwrap());
    match client.remove_crawler(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_crawler_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_crawler_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_crawler".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RssAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RssAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_crawler,
                renew_crawler_token,
                set_crawler_run_time,
                list_crawler,
                remove_crawler,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RssAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "rss_admin_api"
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