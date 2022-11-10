use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::robot_earthly_api::robot_earthly_api_client::RobotEarthlyApiClient;
use proto_gen_rust::robot_earthly_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};


#[tauri::command]
async fn add_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddRepoRequest,
) -> Result<AddRepoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.add_repo(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == add_repo_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("add_repo".into()),
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
async fn list_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRepoRequest,
) -> Result<ListRepoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.list_repo(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_repo_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_repo".into()),
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
async fn get_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRepoRequest,
) -> Result<GetRepoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.get_repo(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_repo_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_repo".into()),
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
async fn remove_repo<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRepoRequest,
) -> Result<RemoveRepoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.remove_repo(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_repo_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_repo".into()),
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
async fn link_robot<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LinkRobotRequest,
) -> Result<LinkRobotResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.link_robot(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == link_robot_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("link_robot".into()),
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
async fn unlink_robot<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnlinkRobotRequest,
) -> Result<UnlinkRobotResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.unlink_robot(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unlink_robot_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("unlink_robot".into()),
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
async fn create_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateActionRequest,
) -> Result<CreateActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.create_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_action".into()),
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
async fn list_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListActionRequest,
) -> Result<ListActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.list_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_action".into()),
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
async fn get_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetActionRequest,
) -> Result<GetActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.get_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_action".into()),
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
async fn update_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateActionRequest,
) -> Result<UpdateActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.update_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_action".into()),
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
async fn remove_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveActionRequest,
) -> Result<RemoveActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.remove_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_action".into()),
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
async fn exec_action<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ExecActionRequest,
) -> Result<ExecActionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.exec_action(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == exec_action_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("exec_action".into()),
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
async fn list_exec<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListExecRequest,
) -> Result<ListExecResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.list_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_exec_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_exec".into()),
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
async fn get_exec<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetExecRequest,
) -> Result<GetExecResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.get_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_exec_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_exec".into()),
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
async fn watch_exec<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: WatchExecRequest,
) -> Result<WatchExecResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.watch_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == watch_exec_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("watch_exec".into()),
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
async fn list_exec_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListExecDataRequest,
) -> Result<ListExecDataResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotEarthlyApiClient::new(chan.unwrap());
    match client.list_exec_data(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_exec_data_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_exec_data".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RobotEarthlyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RobotEarthlyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                add_repo,
                list_repo,
                get_repo,
                remove_repo,
                link_robot,
                unlink_robot,
                create_action,
                list_action,
                get_action,
                update_action,
                remove_action,
                exec_action,
                list_exec,
                get_exec,
                watch_exec,
                list_exec_data,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RobotEarthlyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "robot_earthly_api"
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