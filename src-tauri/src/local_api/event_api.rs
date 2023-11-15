use crate::user_api_plugin::get_session_inner;
use local_api_rust::models;
use proto_gen_rust::events_api::events_api_client::EventsApiClient;
use proto_gen_rust::events_api::*;
use serde_json::json;
use tauri::AppHandle;

pub async fn add_custom_event(
    app: &AppHandle,
    project_id: &String,
    ev_type: &String,
    ev_content: &String,
) -> Result<(), String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    let res = client
        .add_custom_event(AddCustomEventRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            event_type: ev_type.clone(),
            event_content: ev_content.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        let res = res.unwrap().into_inner();
        if res.code != 0 {
            return Err(res.err_msg);
        }
        return Ok(());
    }
}

pub async fn list_project_event(
    app: &AppHandle,
    project_id: &String,
    member_user_id: &String,
    from_time: i64,
    to_time: i64,
    offset: u32,
    limit: u32,
) -> Result<ListProjectEventResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    let res = client
        .list_project_event(ListProjectEventRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            filter_by_member_user_id: member_user_id.eq("") == false,
            member_user_id: member_user_id.clone(),
            from_time: from_time,
            to_time: to_time,
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

pub async fn list_event_by_ref(
    app: &AppHandle,
    project_id: &String,
    event_type: EventType,
    ref_type: EventRefType,
    ref_id: &String,
) -> Result<ListEventByRefResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    let res = client
        .list_event_by_ref(ListEventByRefRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            event_type: event_type as i32,
            ref_type: ref_type as i32,
            ref_id: ref_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_event_list(event_list: Vec<Event>) -> Vec<models::EventInfo> {
    let mut ret_list = Vec::new();
    event_list.iter().for_each(|item| {
        let mut event_type = "";
        if item.event_type == EventType::User as i32 {
            event_type = "user";
        } else if item.event_type == EventType::Project as i32 {
            event_type = "project";
        } else if item.event_type == EventType::Task as i32 {
            event_type = "task";
        } else if item.event_type == EventType::Bug as i32 {
            event_type = "bug";
        } else if item.event_type == EventType::Sprit as i32 {
            event_type = "sprit";
        } else if item.event_type == EventType::Doc as i32 {
            event_type = "doc";
        } else if item.event_type == EventType::Disk as i32 {
            event_type = "disk";
        } else if item.event_type == EventType::Gitlab as i32 {
            event_type = "gitlab";
        } else if item.event_type == EventType::Github as i32 {
            event_type = "github";
        } else if item.event_type == EventType::Gitea as i32 {
            event_type = "gitea";
        } else if item.event_type == EventType::Gitee as i32 {
            event_type = "gitee";
        } else if item.event_type == EventType::Gogs as i32 {
            event_type = "gogs";
        } else if item.event_type == EventType::Jira as i32 {
            event_type = "jira";
        } else if item.event_type == EventType::Confluence as i32 {
            event_type = "confluence";
        } else if item.event_type == EventType::Jenkins as i32 {
            event_type = "jenkins";
        }

        let mut ref_type = "";
        if item.ref_type == EventRefType::None as i32 {
            ref_type = "none";
        } else if item.ref_type == EventRefType::User as i32 {
            ref_type = "user";
        } else if item.ref_type == EventRefType::Project as i32 {
            ref_type = "project";
        } else if item.ref_type == EventRefType::Sprit as i32 {
            ref_type = "sprit";
        } else if item.ref_type == EventRefType::Task as i32 {
            ref_type = "task";
        } else if item.ref_type == EventRefType::Bug as i32 {
            ref_type = "bug";
        } else if item.ref_type == EventRefType::Doc as i32 {
            ref_type = "doc";
        } 

        let mut event_data = json!({});
        if let Some(data) = &item.event_data {
            let ev = crate::events_decode::decode_event(data);
            if let Some(ev) = ev {
                if let Ok(value) = serde_json::to_value(ev) {
                    event_data = value;
                }
            }
        }

        ret_list.push(models::EventInfo {
            event_id: Some(item.event_id.clone()),
            user_id: Some(item.user_id.clone()),
            user_display_name: Some(item.user_display_name.clone()),
            event_type: Some(event_type.into()),
            event_time: Some(item.event_time),
            ref_type: Some(ref_type.into()),
            ref_id: Some(item.ref_id.clone()),
            event_data: Some(event_data),
        });
    });
    return ret_list;
}
