use crate::user_api_plugin::get_session_inner;
use proto_gen_rust::project_api::project_api_client::ProjectApiClient;
use proto_gen_rust::project_api::{
    get_local_api_perm_response, GetLocalApiPermRequest,
    GetLocalApiPermResponse, LocalApiPerm,
};
use tauri::AppHandle;

pub async fn get_perm(app: &AppHandle, project_id: &String) -> Result<LocalApiPerm, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectApiClient::new(chan.unwrap());
    let res = client
        .get_local_api_perm(GetLocalApiPermRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        let res: GetLocalApiPermResponse = res.unwrap().into_inner();
        if res.code != get_local_api_perm_response::Code::Ok as i32 {
            return Err(res.err_msg);
        }
        if let Some(perm) = res.perm {
            return Ok(perm);
        }
        return Ok(LocalApiPerm {
            access_channel: false,
        });
    }
}
