use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::data_anno_task_api::data_anno_task_api_client::DataAnnoTaskApiClient;
use proto_gen_rust::data_anno_task_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;

#[tauri::command]
async fn add_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddMemberRequest,
) -> Result<AddMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.add_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_member".into()))
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
async fn list_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMemberRequest,
) -> Result<ListMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.list_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_member".into()))
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
async fn remove_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveMemberRequest,
) -> Result<RemoveMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.remove_member(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_member_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_member".into()))
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
async fn set_task_count<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetTaskCountRequest,
) -> Result<SetTaskCountResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.set_task_count(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_task_count_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_task_count".into()))
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
async fn list_task<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListTaskRequest,
) -> Result<ListTaskResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.list_task(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_task_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_task".into()))
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
async fn set_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetResultRequest,
) -> Result<SetResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.set_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_result".into()))
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
async fn set_result_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetResultStateRequest,
) -> Result<SetResultStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.set_result_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_result_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_result_state".into()),
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
async fn get_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetResultRequest,
) -> Result<GetResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = DataAnnoTaskApiClient::new(chan.unwrap());
    match client.get_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_result".into()))
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
async fn export_result(result: AnnoResult, dest_path: String) -> Result<(), String> {
    let mut path = std::path::PathBuf::from(dest_path);
    path.push("annotations");
    if !path.exists() {
        let res = fs::create_dir_all(&path).await;
        if res.is_err() {
            return Err(res.err().unwrap().to_string());
        }
    }
    path.push(format!(
        "{}_{}.json",
        &result.resource_id, &result.member_user_id
    ));
    let res = fs::write(&path, &result.result).await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    Ok(())
}

pub struct DataAnnoTaskApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> DataAnnoTaskApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_member,
                list_member,
                remove_member,
                set_task_count,
                list_task,
                set_result,
                set_result_state,
                get_result,
                export_result,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for DataAnnoTaskApiPlugin<R> {
    fn name(&self) -> &'static str {
        "data_anno_task_api"
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
