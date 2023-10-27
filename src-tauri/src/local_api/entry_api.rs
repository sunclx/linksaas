use crate::user_api_plugin::get_session_inner;
use local_api_rust::models::DocInfo;
use proto_gen_rust::project_entry_api::project_entry_api_client::ProjectEntryApiClient;
use proto_gen_rust::project_entry_api::*;
use tauri::AppHandle;

pub async fn list(
    app: &AppHandle,
    project_id: &String,
    entry_type: EntryType,
    offset: i32,
    limit: i32,
) -> Result<ListResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectEntryApiClient::new(chan.unwrap());
    let mut entry_type_list = Vec::new();
    entry_type_list.push(entry_type as i32);
    let res = client
        .list(ListRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            list_param: Some(ListParam {
                filter_by_watch: false,
                filter_by_tag_id: false,
                tag_id_list: Vec::new(),
                filter_by_keyword: false,
                keyword: "".into(),
                filter_by_mark_remove: true,
                mark_remove: false,
                filter_by_entry_type: true,
                entry_type_list: entry_type_list,
            }),
            offset: offset as u32,
            limit: limit as u32,
        })
        .await;

    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_to_doc_list(entry_list: Vec<EntryInfo>) -> Vec<DocInfo> {
    let mut ret_list = Vec::new();
    entry_list.iter().for_each(|entry| {
        ret_list.push(DocInfo {
            doc_id: Some(entry.entry_id.clone()),
            title: Some(entry.entry_title.clone()),
            create_user_id: Some(entry.create_user_id.clone()),
            create_display_name: Some(entry.create_display_name.clone()),
            create_time: Some(entry.create_time),
            update_user_id: Some(entry.update_user_id.clone()),
            update_display_name: Some(entry.update_display_name.clone()),
            update_time: Some(entry.update_time),
        });
    });
    return ret_list;
}
