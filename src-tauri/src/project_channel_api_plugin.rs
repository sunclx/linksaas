use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_channel_api::project_channel_api_client::ProjectChannelApiClient;
use proto_gen_rust::project_channel_api::*;
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
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
async fn open<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: OpenRequest,
) -> Result<OpenResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.open(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == open_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("open".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn close<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CloseRequest,
) -> Result<CloseResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.close(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == close_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("close".into())) {
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
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
async fn add_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AddMemberRequest,
) -> Result<AddMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
async fn remove_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveMemberRequest,
) -> Result<RemoveMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
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
async fn list_member<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMemberRequest,
) -> Result<ListMemberResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.list_member(request.clone()).await {
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
async fn send_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SendMsgRequest,
) -> Result<SendMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.send_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == send_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("send_msg".into()))
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
async fn update_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateMsgRequest,
) -> Result<UpdateMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.update_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_msg_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_msg".into()))
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
async fn get_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMsgRequest,
) -> Result<GetMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.get_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_msg".into()))
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
async fn list_msg<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListMsgRequest,
) -> Result<ListMsgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.list_msg(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_msg_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_msg".into()))
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
async fn clear_un_read_count<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ClearUnReadCountRequest,
) -> Result<ClearUnReadCountResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.clear_un_read_count(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == clear_un_read_count_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("clear_un_read_count".into()),
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
async fn list_read_msg_stat<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListReadMsgStatRequest,
) -> Result<ListReadMsgStatResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.list_read_msg_stat(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_read_msg_stat_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_read_msg_stat".into()),
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
async fn leave<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LeaveRequest,
) -> Result<LeaveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.leave(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == leave_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("leave".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}
#[tauri::command]
async fn set_top<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetTopRequest,
) -> Result<SetTopResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.set_top(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_top_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_top".into()))
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
async fn unset_top<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnsetTopRequest,
) -> Result<UnsetTopResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.unset_top(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == unset_top_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("unset_top".into()))
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
async fn get_read_msg_stat<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetReadMsgStatRequest,
) -> Result<GetReadMsgStatResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.get_read_msg_stat(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_read_msg_stat_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_read_msg_stat".into()),
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
async fn list_by_admin<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListByAdminRequest,
) -> Result<ListByAdminResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.list_by_admin(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_by_admin_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_by_admin".into()))
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
async fn join_by_admin<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: JoinByAdminRequest,
) -> Result<JoinByAdminResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.join_by_admin(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == join_by_admin_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("join_by_admin".into()))
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
async fn remove_by_admin<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveByAdminRequest,
) -> Result<RemoveByAdminResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.remove_by_admin(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_by_admin_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_by_admin".into()))
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
async fn watch<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: WatchRequest,
) -> Result<WatchResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.watch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == watch_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("watch".into()))
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
async fn un_watch<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UnWatchRequest,
) -> Result<UnWatchResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    match client.un_watch(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == un_watch_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("un_watch".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectChannelApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectChannelApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                update,
                open,
                close,
                list,
                get,
                add_member,
                remove_member,
                list_member,
                send_msg,
                update_msg,
                get_msg,
                list_msg,
                clear_un_read_count,
                list_read_msg_stat,
                get_read_msg_stat,
                leave,
                set_top,
                unset_top,
                list_by_admin,
                join_by_admin,
                remove_by_admin,
                watch,
                un_watch,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectChannelApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_channel_api"
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
