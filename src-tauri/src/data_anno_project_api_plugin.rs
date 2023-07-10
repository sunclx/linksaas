use crate::{fs_api_plugin::download_file, notice_decode::new_wrong_session_notice};
use proto_gen_rust::data_anno_project_api::data_anno_project_api_client::DataAnnoProjectApiClient;
use proto_gen_rust::data_anno_project_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;

#[tauri::command]
async fn create<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRequest,
) -> Result<CreateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.create(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.update(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.get(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_resource<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddResourceRequest,
) -> Result<AddResourceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.add_resource(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_resource_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_resource".into()))
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
async fn remove_resource<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveResourceRequest,
) -> Result<RemoveResourceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.remove_resource(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_resource_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_resource".into()))
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
async fn list_resource<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListResourceRequest,
) -> Result<ListResourceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoProjectApiClient::new(chan.unwrap());
    match client.list_resource(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_resource_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_resource".into()))
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
async fn export_resource<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    session_id: String,
    resource :ResourceInfo,
    fs_id: String,
    dest_path: String,
) -> Result<(), String> {
    //创建目录
    let mut path = std::path::PathBuf::from(dest_path);
    path.push("resources");
    if !path.exists() {
        let res = fs::create_dir_all(&path).await;
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    }
    path.push(format!("{}.{}", &resource.resource_id, &resource.file_ext));
    if resource.store_as_file {
        let res = download_file(
            app_handle,
            window,
            "".into(),
            session_id,
            fs_id,
            resource.content,
            "".into(),
        )
        .await;
        if res.is_err() {
            return Err(res.err().unwrap());
        }
        let res = res.unwrap();
        let res = fs::copy(res.local_path, &path).await;
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    } else {
        let res = fs::write(&path, resource.content).await;
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    }
    Ok(())
}

pub struct DataAnnoProjectApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DataAnnoProjectApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                update,
                remove,
                list,
                get,
                add_resource,
                remove_resource,
                list_resource,
                export_resource,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DataAnnoProjectApiPlugin<R> {
    fn name(&self) -> &'static str {
        "data_anno_project_api"
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
