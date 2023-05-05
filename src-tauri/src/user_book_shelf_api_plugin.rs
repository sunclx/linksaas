use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::user_book_shelf_api::user_book_shelf_api_client::UserBookShelfApiClient;
use proto_gen_rust::user_book_shelf_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

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
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
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
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.update_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_book_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_book".into()))
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
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.list_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_book_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_book".into()))
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
async fn query_by_file_id<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: QueryByFileIdRequest,
) -> Result<QueryByFileIdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.query_by_file_id(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == query_by_file_id_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("query_by_file_id".into()))
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
async fn get_book<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetBookRequest,
) -> Result<GetBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.get_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_book_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_book".into()))
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
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.remove_book(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_book_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_book".into()))
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
async fn add_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddMarkRequest,
) -> Result<AddMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.add_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("add_mark".into()))
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
async fn list_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMarkRequest,
) -> Result<ListMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.list_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_mark".into()))
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
async fn get_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMarkRequest,
) -> Result<GetMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.get_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_mark".into()))
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
async fn remove_mark<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveMarkRequest,
) -> Result<RemoveMarkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.remove_mark(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_mark_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_mark".into()))
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
async fn set_read_loc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetReadLocRequest,
) -> Result<SetReadLocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.set_read_loc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_read_loc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_read_loc".into()))
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
async fn get_read_loc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetReadLocRequest,
) -> Result<GetReadLocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserBookShelfApiClient::new(chan.unwrap());
    match client.get_read_loc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_read_loc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_read_loc".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


pub struct UserBookShelfApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> UserBookShelfApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_book,
                update_book,
                list_book,
                query_by_file_id,
                get_book,
                remove_book,
                add_mark,
                list_mark,
                get_mark,
                remove_mark,
                set_read_loc,
                get_read_loc,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for UserBookShelfApiPlugin<R> {
    fn name(&self) -> &'static str {
        "user_book_shelf_api"
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
