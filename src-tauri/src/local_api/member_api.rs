use crate::user_api_plugin::get_session_inner;
use local_api_rust::models;
use proto_gen_rust::project_member_api::project_member_api_client::ProjectMemberApiClient;
use proto_gen_rust::project_member_api::*;
use tauri::AppHandle;

pub async fn list_member(
    app: &AppHandle,
    project_id: &String,
) -> Result<ListMemberResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectMemberApiClient::new(chan.unwrap());
    let res = client
        .list_member(ListMemberRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            filter_by_member_user_id: false,
            member_user_id_list: Vec::new(),
        })
        .await;

    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_member_list(member_list: Vec<MemberInfo>) -> Vec<models::SimpleMemberInfo> {
    let mut ret_list = Vec::new();
    member_list.iter().for_each(|item| {
        ret_list.push(models::SimpleMemberInfo {
            member_user_id: Some(item.member_user_id.clone()),
            display_name: Some(item.display_name.clone()),
        })
    });
    return ret_list;
}
