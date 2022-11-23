use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_book_shelf_api::project_book_shelf_api_client::ProjectBookShelfApiClient;
use proto_gen_rust::project_book_shelf_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

use epub::doc::EpubDoc;

#[tauri::command]
async fn add_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddBookRequest,
) -> Result<AddBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.add_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_book_response::Code::WrongSession as i32 {
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
    request: UpdateBookRequest,
) -> Result<UpdateBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.update_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_book_response::Code::WrongSession as i32 {
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
async fn list_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListBookRequest,
) -> Result<ListBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.list_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_book_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_book".into()))
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
    request: RemoveBookRequest,
) -> Result<RemoveBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.remove_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_book_response::Code::WrongSession as i32 {
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

#[tauri::command]
async fn add_anno<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddAnnoRequest,
) -> Result<AddAnnoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.add_anno(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_anno_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_anno".into()))
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
async fn list_anno<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAnnoRequest,
) -> Result<ListAnnoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.list_anno(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_anno_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_anno".into()))
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
async fn remove_anno<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveAnnoRequest,
) -> Result<RemoveAnnoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookShelfApiClient::new(chan.unwrap());
    match client.remove_anno(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_anno_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_anno".into()))
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
async fn parse_book_title(file_path: String) -> Result<String, String> {
    let book = EpubDoc::new(&file_path);
    if book.is_err() {
        return Err(book.err().unwrap().to_string());
    }
    let book = book.unwrap();
    if let Some(title) = book.mdata("title") {
        return Ok(title);
    }
    return Ok("未知书名".into());
}

pub struct ProjectBookShelfApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectBookShelfApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_book,
                update_book,
                list_book,
                remove_book,
                add_anno,
                list_anno,
                remove_anno,
                parse_book_title,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectBookShelfApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_book_shelf_api"
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
