use crate::user_api_plugin::get_session_inner;
use proto_gen_rust::project_api::project_api_client::ProjectApiClient;
use proto_gen_rust::project_api::{GetLocalApiTokenRequest};
use tauri::AppHandle;

pub async fn check(app: &AppHandle, project_id: &String, token: &String) -> bool {
    if token == "" {
        return false;
    }
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return false;
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    let res = client.get_local_api_token(GetLocalApiTokenRequest {
        session_id: get_session_inner(app).await,
        project_id: project_id.clone(),
    }).await;
    if res.is_err() {
        return false;
    }else{
        return res.unwrap().into_inner().token.eq(token);
    }
}
