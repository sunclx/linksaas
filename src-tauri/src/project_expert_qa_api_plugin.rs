use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_expert_qa_api::project_expert_qa_api_client::ProjectExpertQaApiClient;
use proto_gen_rust::project_expert_qa_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn upsert_expert<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpsertExpertRequest,
) -> Result<UpsertExpertResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.upsert_expert(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == upsert_expert_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("upsert_expert".into()))
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
async fn list_expert<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListExpertRequest,
) -> Result<ListExpertResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.list_expert(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_expert_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_expert".into()))
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
async fn remove_expert<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveExpertRequest,
) -> Result<RemoveExpertResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.remove_expert(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_expert_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_expert".into()))
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
async fn create_question<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateQuestionRequest,
) -> Result<CreateQuestionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.create_question(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_question_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_question".into()))
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
async fn update_question<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateQuestionRequest,
) -> Result<UpdateQuestionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.update_question(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_question_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_question".into()))
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
async fn list_question_key<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListQuestionKeyRequest,
) -> Result<ListQuestionKeyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.list_question_key(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_question_key_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_question_key".into()),
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
async fn get_question<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetQuestionRequest,
) -> Result<GetQuestionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.get_question(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_question_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_question".into()))
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
async fn remove_question<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveQuestionRequest,
) -> Result<RemoveQuestionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.remove_question(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_question_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_question".into()))
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
async fn create_reply<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateReplyRequest,
) -> Result<CreateReplyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.create_reply(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_reply_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_reply".into()))
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
async fn update_reply<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateReplyRequest,
) -> Result<UpdateReplyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.update_reply(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_reply_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_reply".into()))
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
async fn list_reply<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListReplyRequest,
) -> Result<ListReplyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.list_reply(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_reply_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_reply".into()))
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
async fn remove_reply<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveReplyRequest,
) -> Result<RemoveReplyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.remove_reply(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_reply_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_reply".into()))
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
async fn get_my_status<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetMyStatusRequest,
) -> Result<GetMyStatusResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.get_my_status(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_my_status_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_my_status".into()))
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
async fn clear_need_answer_count<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ClearNeedAnswerCountRequest,
) -> Result<ClearNeedAnswerCountResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectExpertQaApiClient::new(chan.unwrap());
    match client.clear_need_answer_count(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == clear_need_answer_count_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("clear_need_answer_count".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectExpertQaApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectExpertQaApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                upsert_expert,
                list_expert,
                remove_expert,
                create_question,
                update_question,
                list_question_key,
                get_question,
                remove_question,
                create_reply,
                update_reply,
                list_reply,
                remove_reply,
                get_my_status,
                clear_need_answer_count,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectExpertQaApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_expert_qa"
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
