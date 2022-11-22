use crate::user_api_plugin::get_session_inner;
use local_api_rust::models;
use proto_gen_rust::project_channel_api::project_channel_api_client::ProjectChannelApiClient;
use proto_gen_rust::project_channel_api::*;
use tauri::AppHandle;

pub async fn list(
    app: &AppHandle, 
    project_id: &String,
) -> Result<ListResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    let res = client
        .list(ListRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            filter_by_closed: false,
            closed: false,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_by_admin(
    app: &AppHandle,
    project_id: &String,
    scope: ListChanScope,
) -> Result<ListByAdminResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    let res = client
        .list_by_admin(ListByAdminRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            filter_by_closed: false,
            closed: false,
            filter_by_scope: true,
            scope_list: vec![scope as i32],
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_msg(
    app: &AppHandle,
    project_id: &String,
    channel_id: &String,
    ref_msg_id: &String,
    limit: i32,
) -> Result<ListMsgResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectChannelApiClient::new(chan.unwrap());
    let res = client
        .list_msg(ListMsgRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            channel_id: channel_id.clone(),
            refer_msg_id: ref_msg_id.clone(),
            list_msg_type: ListMsgType::Before as i32,
            limit: limit as u32,
            include_ref_msg: false,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_msg_list(msg_list: Vec<Msg>) -> Vec<models::MsgInfo> {
    let mut ret_list = Vec::new();
    msg_list.iter().for_each(|msg| {
        let basic_msg = msg.basic_msg.clone().unwrap_or_else(|| {
            return BasicMsg {
                msg_data: "".into(),
                ref_msg_id: "".into(),
                remind_info: None,
                link_type: 0,
                link_dest_id: "".into(),
            };
        });
        let mut sender_type = "";
        if msg.sender_type == SenderType::Member as i32 {
            sender_type = "member";
        } else if msg.sender_type == SenderType::Robot as i32 {
            sender_type = "robot";
        }
        ret_list.push(models::MsgInfo {
            msg_id: Some(msg.msg_id.clone()),
            channel_id: Some(msg.channel_id.clone()),
            content: Some(basic_msg.msg_data.clone()),
            sender_user_id: Some(msg.sender_user_id.clone()),
            sender_display_name: Some(msg.sender_display_name.clone()),
            sender_type: Some(sender_type.into()),
            send_time: Some(msg.send_time),
            has_update_time: Some(msg.has_update_time),
            update_time: Some(msg.update_time),
        });
    });
    return ret_list;
}

pub fn convert_channel_list(channel_list: Vec<ChannelInfo>) -> Vec<models::ChannelInfo> {
    let mut ret_list = Vec::new();
    channel_list.iter().for_each(|channel| {
        let basic_info = channel.basic_info.clone().unwrap_or_else(|| {
            return BasicChannelInfo {
                channel_name: "".into(),
                pub_channel: false,
            };
        });
        ret_list.push(models::ChannelInfo {
            channel_id: Some(channel.channel_id.clone()),
            name: Some(basic_info.channel_name.clone()),
            pub_channel: Some(basic_info.pub_channel),
            system_channel: Some(channel.system_channel),
            readonly: Some(channel.readonly),
            closed: Some(channel.closed),
            owner_user_id: Some(channel.owner_user_id.clone()),
            create_time: Some(channel.create_time),
            update_time: Some(channel.update_time),
        });
    });
    return ret_list;
}
