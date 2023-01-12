use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::robot_script_api::robot_script_api_client::RobotScriptApiClient;
use proto_gen_rust::robot_script_api::*;

use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_script_suite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateScriptSuiteRequest,
) -> Result<CreateScriptSuiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.create_script_suite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_script_suite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("create_script_suite".into()),
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
async fn list_script_suite_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListScriptSuiteKeyRequest,
) -> Result<ListScriptSuiteKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.list_script_suite_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_script_suite_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_script_suite_key".into()),
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
async fn get_script_suite_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetScriptSuiteKeyRequest,
) -> Result<GetScriptSuiteKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.get_script_suite_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_script_suite_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_script_suite_key".into()),
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
async fn get_script_suite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetScriptSuiteRequest,
) -> Result<GetScriptSuiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.get_script_suite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_script_suite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_script_suite".into()),
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
async fn remove_script_suite<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveScriptSuiteRequest,
) -> Result<RemoveScriptSuiteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.remove_script_suite(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_script_suite_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("remove_script_suite".into()),
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
async fn update_script_suite_name<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateScriptSuiteNameRequest,
) -> Result<UpdateScriptSuiteNameResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_script_suite_name(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_script_suite_name_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_script_suite_name".into()),
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
async fn update_env_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateEnvPermRequest,
) -> Result<UpdateEnvPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_env_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_env_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_env_perm".into()))
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
async fn update_sys_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSysPermRequest,
) -> Result<UpdateSysPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_sys_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_sys_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_sys_perm".into()))
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
async fn update_net_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateNetPermRequest,
) -> Result<UpdateNetPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_net_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_net_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_net_perm".into()))
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
async fn update_read_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateReadPermRequest,
) -> Result<UpdateReadPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_read_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_read_perm_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_read_perm".into()),
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
async fn update_write_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateWritePermRequest,
) -> Result<UpdateWritePermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_write_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_write_perm_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_write_perm".into()),
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
async fn update_run_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRunPermRequest,
) -> Result<UpdateRunPermResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_run_perm(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_run_perm_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_run_perm".into()))
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
async fn update_script<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateScriptRequest,
) -> Result<UpdateScriptResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_script(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_script_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_script".into()))
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
async fn update_exec_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateExecUserRequest,
) -> Result<UpdateExecUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_exec_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_exec_user_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_exec_user".into()),
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
async fn update_env_param_def<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateEnvParamDefRequest,
) -> Result<UpdateEnvParamDefResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_env_param_def(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_env_param_def_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_env_param_def".into()),
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
async fn update_arg_param_def<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateArgParamDefRequest,
) -> Result<UpdateArgParamDefResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.update_arg_param_def(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_arg_param_def_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("update_arg_param_def".into()),
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
async fn list_script_history_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListScriptHistoryKeyRequest,
) -> Result<ListScriptHistoryKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.list_script_history_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_script_history_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_script_history_key".into()),
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
async fn get_script_from_history<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetScriptFromHistoryRequest,
) -> Result<GetScriptFromHistoryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.get_script_from_history(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_script_from_history_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_script_from_history".into()),
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
async fn recover_script_from_history<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RecoverScriptFromHistoryRequest,
) -> Result<RecoverScriptFromHistoryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.recover_script_from_history(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == recover_script_from_history_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("recover_script_from_history".into()),
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
async fn exec_script_suit<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ExecScriptSuitRequest,
) -> Result<ExecScriptSuitResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.exec_script_suit(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == exec_script_suit_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("exec_script_suit".into()),
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
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.list_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_exec_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_exec".into()))
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
async fn get_exec<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetExecRequest,
) -> Result<GetExecResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.get_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_exec_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_exec".into()))
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
async fn watch_exec<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: WatchExecRequest,
) -> Result<WatchExecResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.watch_exec(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == watch_exec_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("watch_exec".into()))
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
async fn get_last_exec_param<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetLastExecParamRequest,
) -> Result<GetLastExecParamResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.get_last_exec_param(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_last_exec_param_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_last_exec_param".into()))
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
async fn list_exec_data<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListExecDataRequest,
) -> Result<ListExecDataResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = RobotScriptApiClient::new(chan.unwrap());
    match client.list_exec_data(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_exec_data_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_exec_data".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct RobotScriptApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> RobotScriptApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_script_suite,
                list_script_suite_key,
                get_script_suite_key,
                get_script_suite,
                remove_script_suite,
                update_script_suite_name,
                update_env_perm,
                update_sys_perm,
                update_net_perm,
                update_read_perm,
                update_write_perm,
                update_run_perm,
                update_script,
                update_exec_user,
                update_env_param_def,
                update_arg_param_def,
                list_script_history_key,
                get_script_from_history,
                recover_script_from_history,
                exec_script_suit,
                list_exec,
                get_exec,
                watch_exec,
                get_last_exec_param,
                list_exec_data,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for RobotScriptApiPlugin<R> {
    fn name(&self) -> &'static str {
        "robot_script_api"
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
