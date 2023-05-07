use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::bookstore_api::bookstore_admin_api_client::BookstoreAdminApiClient;
use proto_gen_rust::bookstore_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn add_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddCateRequest,
) -> Result<AdminAddCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.add_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_cate".into()))
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
async fn update_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateCateRequest,
) -> Result<AdminUpdateCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.update_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_cate".into()))
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
async fn remove_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveCateRequest,
) -> Result<AdminRemoveCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.remove_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_cate_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_cate_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_cate".into()))
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
async fn add_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminAddBookRequest,
) -> Result<AdminAddBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.add_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_add_book_response::Code::WrongSession as i32
                || inner_resp.code == admin_add_book_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_book".into()))
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
async fn update_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminUpdateBookRequest,
) -> Result<AdminUpdateBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.update_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_update_book_response::Code::WrongSession as i32
                || inner_resp.code == admin_update_book_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_book".into()))
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
async fn set_book_extra<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminSetBookExtraRequest,
) -> Result<AdminSetBookExtraResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.set_book_extra(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_set_book_extra_response::Code::WrongSession as i32
                || inner_resp.code == admin_set_book_extra_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_book_extra".into()))
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
async fn remove_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AdminRemoveBookRequest,
) -> Result<AdminRemoveBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = BookstoreAdminApiClient::new(chan.unwrap());
    match client.remove_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == admin_remove_book_response::Code::WrongSession as i32
                || inner_resp.code == admin_remove_book_response::Code::NotAuth as i32
            {
                crate::admin_auth_api_plugin::logout(app_handle).await;
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_book".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct BookstoreAdminApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> BookstoreAdminApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_cate,
                update_cate,
                remove_cate,
                add_book,
                update_book,
                set_book_extra,
                remove_book,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for BookstoreAdminApiPlugin<R> {
    fn name(&self) -> &'static str {
        "bookstore_admin_api"
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
