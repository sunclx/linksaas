use proto_gen_rust::project_book_store_api::project_book_store_api_client::ProjectBookStoreApiClient;
use proto_gen_rust::project_book_store_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;
use tokio_stream::StreamExt;

#[tauri::command]
async fn list_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListTagRequest,
) -> Result<ListTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookStoreApiClient::new(chan.unwrap());
    match client.list_tag(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_book<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ListBookRequest,
) -> Result<ListBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookStoreApiClient::new(chan.unwrap());
    match client.list_book(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_book<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetBookRequest,
) -> Result<GetBookResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookStoreApiClient::new(chan.unwrap());
    match client.get_book(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_book_file<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetBookFileRequest,
) -> Result<GetBookFileResponse, String> {
    //检查本地文件
    let local_dir = format!(
        "{}/books/{}",
        crate::get_cache_dir().unwrap(),
        &request.book_id
    );
    let local_path = format!("{}/book.epub", &local_dir);
    let local_stat = fs::metadata(local_path.as_str()).await;
    if local_stat.is_ok() && local_stat.unwrap().is_file() {
        return match fs::File::open(local_path).await {
            Err(_) => Err("open file failed".into()),
            Ok(mut f) => {
                let mut data: Vec<u8> = Vec::new();
                match f.read_to_end(&mut data).await {
                    Err(_) => Err("read file failed".into()),
                    Ok(_) => Ok(GetBookFileResponse {
                        code: 0,
                        err_msg: "".into(),
                        book_data: data,
                    }),
                }
            }
        };
    }
    //从服务端下载文件
    if let Err(err) = fs::create_dir_all(local_dir.as_str()).await {
        println!("{:?}", err)
    }
    let tmp_file_path = format!("{}/.tmp", local_dir.as_str());
    let tmp_file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open((&tmp_file_path).as_str())
        .await;
    if tmp_file.is_err() {
        return Err("open tmp file failed".into());
    }
    let mut tmp_file = tmp_file.unwrap();

    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBookStoreApiClient::new(chan.unwrap());
    let resp = client.get_book_file(request).await;
    if resp.is_err() {
        return Err(resp.err().unwrap().message().into());
    }
    let mut msg_stream = resp.unwrap().into_inner();
    while let Some(item) = msg_stream.next().await {
        match item {
            Ok(item) => {
                if item.code != get_book_file_response::Code::Ok as i32 {
                    return Err(item.err_msg);
                }
                if let Err(err) = tmp_file.write_all(&item.book_data).await {
                    return Err(err.to_string());
                }
            }
            Err(err) => {
                return Err(err.to_string());
            }
        }
    }
    //临时文件改名
    if let Err(err) = fs::rename(tmp_file_path.as_str(), local_path.as_str()).await {
        return Err(err.to_string());
    }
    //读取本地文件数据
    return match fs::File::open(local_path).await {
        Err(_) => Err("open file failed".into()),
        Ok(mut f) => {
            let mut data: Vec<u8> = Vec::new();
            match f.read_to_end(&mut data).await {
                Err(_) => Err("read file failed".into()),
                Ok(_) => Ok(GetBookFileResponse {
                    code: 0,
                    err_msg: "".into(),
                    book_data: data,
                }),
            }
        }
    };
}

pub struct ProjectBookStoreApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectBookStoreApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_tag,
                list_book,
                get_book,
                get_book_file,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectBookStoreApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_book_store_api"
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
