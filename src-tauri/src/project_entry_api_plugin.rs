use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_entry_api::project_entry_api_client::ProjectEntryApiClient;
use proto_gen_rust::project_entry_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

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
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
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
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
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
async fn list_sys<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSysRequest,
) -> Result<ListSysResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.list_sys(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_sys_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_sys".into())) {
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
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
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
async fn update_tag<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTagRequest,
) -> Result<UpdateTagResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_tag(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_tag_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_tag".into()))
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
async fn update_title<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateTitleRequest,
) -> Result<UpdateTitleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_title(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_title_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_title".into()))
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
async fn update_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdatePermRequest,
) -> Result<UpdatePermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_perm".into()))
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
async fn update_mark_remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMarkRemoveRequest,
) -> Result<UpdateMarkRemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_mark_remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_mark_remove_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_mark_remove".into()),
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
async fn update_mark_sys<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMarkSysRequest,
) -> Result<UpdateMarkSysResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_mark_sys(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_mark_sys_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_mark_sys".into()),
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
async fn update_extra_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateExtraInfoRequest,
) -> Result<UpdateExtraInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_extra_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_extra_info_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_extra_info".into()),
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
async fn remove_pages<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemovePagesRequest,
) -> Result<RemovePagesResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.remove_pages(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_pages_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_pages".into()),
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
async fn remove_file<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveFileRequest,
) -> Result<RemoveFileResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.remove_file(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_file_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_file".into()),
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
async fn create_folder<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateFolderRequest,
) -> Result<CreateFolderResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.create_folder(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_folder_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_folder".into()),
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
async fn update_folder_title<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateFolderTitleRequest,
) -> Result<UpdateFolderTitleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.update_folder_title(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_folder_title_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_folder_title".into()),
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
async fn set_parent_folder<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetParentFolderRequest,
) -> Result<SetParentFolderResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.set_parent_folder(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_parent_folder_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_parent_folder".into()),
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
async fn remove_folder<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveFolderRequest,
) -> Result<RemoveFolderResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.remove_folder(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_folder_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_folder".into()),
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
async fn list_sub_folder<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSubFolderRequest,
) -> Result<ListSubFolderResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.list_sub_folder(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_sub_folder_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_sub_folder".into()),
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
async fn list_sub_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSubEntryRequest,
) -> Result<ListSubEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.list_sub_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_sub_entry_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_sub_entry".into()),
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
async fn list_all_folder<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListAllFolderRequest,
) -> Result<ListAllFolderResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.list_all_folder(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_all_folder_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_all_folder".into()),
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
async fn get_folder_path<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetFolderPathRequest,
) -> Result<GetFolderPathResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    match client.get_folder_path(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_folder_path_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_folder_path".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectEntryApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectEntryApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                list,
                list_sys,
                get,
                update_tag,
                update_title,
                update_perm,
                update_mark_remove,
                update_extra_info,
                update_mark_sys,
                remove_pages,
                remove_file,
                create_folder,
                update_folder_title,
                set_parent_folder,
                remove_folder,
                list_sub_folder,
                list_sub_entry,
                list_all_folder,
                get_folder_path,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectEntryApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_entry_api"
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
