use crate::user_api_plugin::get_session_inner;
use proto_gen_rust::project_api::project_api_client::ProjectApiClient;
use proto_gen_rust::project_api::*;
use tauri::AppHandle;

pub async fn get_project(app: &AppHandle, project_id: &String) -> Result<GetResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    let res = client
        .get(GetRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn gen_ai_token(
    app: &AppHandle,
    project_id: &String,
) -> Result<GenAiTokenResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    let res = client
        .gen_ai_token(GenAiTokenRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}
