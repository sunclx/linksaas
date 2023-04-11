use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_bookmark_api::project_book_mark_api_client::ProjectBookMarkApiClient;
use proto_gen_rust::project_bookmark_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateCateRequest,
) -> Result<CreateCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.create_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_cate_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_cate".into()))
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
    request: UpdateCateRequest,
) -> Result<UpdateCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.update_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_cate_response::Code::WrongSession as i32 {
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
async fn list_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListCateRequest,
) -> Result<ListCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.list_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_cate_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_cate".into()))
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
    request: RemoveCateRequest,
) -> Result<RemoveCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.remove_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_cate_response::Code::WrongSession as i32 {
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
async fn create_book_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateBookMarkRequest,
) -> Result<CreateBookMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.create_book_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_book_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_book_mark".into()),
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
async fn list_book_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListBookMarkRequest,
) -> Result<ListBookMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.list_book_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_book_mark_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_book_mark".into()))
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
async fn get_book_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetBookMarkRequest,
) -> Result<GetBookMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.get_book_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_book_mark_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_book_mark".into()))
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
async fn remove_book_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveBookMarkRequest,
) -> Result<RemoveBookMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.remove_book_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_book_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_book_mark".into()),
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
async fn set_book_mark_cate<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetBookMarkCateRequest,
) -> Result<SetBookMarkCateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    match client.set_book_mark_cate(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_book_mark_cate_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_book_mark_cate".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectBookMarkApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectBookMarkApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_cate,
                update_cate,
                list_cate,
                remove_cate,
                create_book_mark,
                list_book_mark,
                get_book_mark,
                remove_book_mark,
                set_book_mark_cate,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectBookMarkApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_bookmark_api"
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