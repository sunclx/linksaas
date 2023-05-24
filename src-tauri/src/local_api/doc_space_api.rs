use crate::user_api_plugin::get_session_inner;
use local_api_rust::models;
use proto_gen_rust::project_doc_api::project_doc_api_client::ProjectDocApiClient;
use proto_gen_rust::project_doc_api::*;
use tauri::AppHandle;

pub async fn list_doc_space(
    app: &AppHandle,
    project_id: &String,
) -> Result<ListDocSpaceResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectDocApiClient::new(chan.unwrap());
    let res = client
        .list_doc_space(ListDocSpaceRequest {
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

pub async fn list_doc_key(
    app: &AppHandle,
    project_id: &String,
    doc_space_id: &String,
    offset: u32,
    limit: u32,
) -> Result<ListDocKeyResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectDocApiClient::new(chan.unwrap());
    let res = client
        .list_doc_key(ListDocKeyRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            filter_by_doc_space_id: true,
            doc_space_id: doc_space_id.clone(),
            list_param: Some(ListDocParam {
                filter_by_watch: false,
                watch: false,
                filter_by_tag_id: false,
                tag_id_list: Vec::new(),
            }),
            offset: offset,
            limit: limit,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_doc_list(doc_key_list: Vec<DocKey>) -> Vec<models::DocInfo> {
    let mut ret_list = Vec::new();
    doc_key_list.iter().for_each(|item| {
        ret_list.push(models::DocInfo {
            doc_id: Some(item.doc_id.clone()),
            doc_space_id: Some(item.doc_space_id.clone()),
            title: Some(item.title.clone()),
            create_user_id: Some(item.create_user_id.clone()),
            create_display_name: Some(item.create_display_name.clone()),
            create_time: Some(item.create_time),
            update_user_id: Some(item.update_user_id.clone()),
            update_display_name: Some(item.update_display_name.clone()),
            update_time: Some(item.update_time),
        });
    });
    return ret_list;
}
