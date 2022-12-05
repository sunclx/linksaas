use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_appraise_api::project_appraise_api_client::ProjectAppraiseApiClient;
use proto_gen_rust::project_appraise_api::*;
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
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
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
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
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
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
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
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
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
async fn list_by_vote_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListByVoteStateRequest,
) -> Result<ListByVoteStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.list_by_vote_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_by_vote_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_by_vote_state".into()),
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
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
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
async fn set_vote_draft<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetVoteDraftRequest,
) -> Result<SetVoteDraftResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.set_vote_draft(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_vote_draft_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_vote_draft".into()))
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
async fn get_vote_draft<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetVoteDraftRequest,
) -> Result<GetVoteDraftResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.get_vote_draft(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_vote_draft_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_vote_draft".into()))
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
async fn vote<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: VoteRequest,
) -> Result<VoteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.vote(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == vote_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("vote".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn revoke_vote<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RevokeVoteRequest,
) -> Result<RevokeVoteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.revoke_vote(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == revoke_vote_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("revoke_vote".into()))
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
async fn get_my_vote<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMyVoteRequest,
) -> Result<GetMyVoteResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.get_my_vote(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_my_vote_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_my_vote".into()))
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
async fn list_score<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListScoreRequest,
) -> Result<ListScoreResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.list_score(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_score_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_score".into()))
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
async fn get_member_state<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMemberStateRequest,
) -> Result<GetMemberStateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectAppraiseApiClient::new(chan.unwrap());
    match client.get_member_state(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_member_state_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_member_state".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectAppraiseApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectAppraiseApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create,
                update,
                get,
                list,
                list_by_vote_state,
                remove,
                set_vote_draft,
                get_vote_draft,
                vote,
                revoke_vote,
                get_my_vote,
                list_score,
                get_member_state,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectAppraiseApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_appraise_api"
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
