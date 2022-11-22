use crate::user_api_plugin::get_session_inner;
use local_api_rust::models;
use proto_gen_rust::project_vc_api::project_vc_api_client::ProjectVcApiClient;
use proto_gen_rust::project_vc_api::*;
use tauri::AppHandle;

pub async fn list_block_coll(
    app: &AppHandle,
    project_id: &String,
    offset: i32,
    limit: i32,
) -> Result<ListBlockCollResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    let res = client
        .list_block_coll(ListBlockCollRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
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

pub async fn list_block(
    app: &AppHandle,
    project_id: &String,
    block_coll_id: &String,
    offset: i32,
    limit: i32,
) -> Result<ListBlockResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    let res = client
        .list_block(ListBlockRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            block_coll_id: block_coll_id.clone(),
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

pub async fn get_block_content(
    app: &AppHandle,
    project_id: &String,
    block_coll_id: &String,
    block_id: &String,
) -> Result<GetBlockContentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectVcApiClient::new(chan.unwrap());
    let res = client
        .get_block_content(GetBlockContentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            block_coll_id: block_coll_id.clone(),
            block_id: block_id.clone(),
            max_history_count: 10,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_block_coll_list(block_coll_list: Vec<BlockColl>) -> Vec<models::BlockCollInfo> {
    let mut ret_list = Vec::new();
    block_coll_list.iter().for_each(|block_coll| {
        let base_info = block_coll.base_info.clone().unwrap_or_else(|| {
            return BaseBlockColl { title: "".into() };
        });
        ret_list.push(models::BlockCollInfo {
            block_coll_id: Some(block_coll.block_coll_id.clone()),
            title: Some(base_info.title.clone()),
            create_user_id: Some(block_coll.create_user_id.clone()),
            create_display_name: Some(block_coll.create_display_name.clone()),
            create_time: Some(block_coll.create_time),
            update_time: Some(block_coll.update_time),
        });
    });
    return ret_list;
}

pub fn convert_block_list(block_list: Vec<Block>) -> Vec<models::BlockInfo> {
    let mut ret_list = Vec::new();
    block_list.iter().for_each(|block| {
        let base_info = block.base_info.clone().unwrap_or_else(|| {
            return BaseBlock { title: "".into() };
        });
        ret_list.push(models::BlockInfo {
            block_id: Some(block.block_id.clone()),
            block_coll_id: Some(block.block_coll_id.clone()),
            title: Some(base_info.title.clone()),
            create_user_id: Some(block.create_user_id.clone()),
            create_display_name: Some(block.create_display_name.clone()),
            create_time: Some(block.create_time),
            update_time: Some(block.update_time),
        });
    });
    return ret_list;
}

pub fn convert_content_list(content_list: Vec<BlockContent>) -> Vec<models::BlockContentInfo> {
    let mut ret_list = Vec::new();
    content_list.iter().for_each(|content| {
        let mut content_type = "";
        if content.content_type == BlockContentType::BlockContentText as i32 {
            content_type = "text";
        }else if content.content_type == BlockContentType::BlockContentHtml as i32 {
            content_type = "html"
        }else if content.content_type == BlockContentType::BlockContentMarkdown as i32 {
            content_type = "markDown"
        }
        ret_list.push(models::BlockContentInfo {
            block_id: Some(content.block_id.clone()),
            content_type: Some(content_type.into()),
            content: Some(content.content.clone()),
            create_time: Some(content.time_stamp),
        });
    });
    return ret_list;
}
