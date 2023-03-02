use crate::user_api_plugin::get_session_inner;
use local_api_rust::models::CodeCommentInfo;
use proto_gen_rust::project_code_api::project_code_api_client::ProjectCodeApiClient;
use proto_gen_rust::project_code_api::*;
use tauri::AppHandle;

pub async fn add_comment(
    app: &AppHandle,
    project_id: &String,
    thread_id: &String,
    content_type: ContentType,
    content: &String,
) -> Result<AddCommentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectCodeApiClient::new(chan.unwrap());
    let res = client
        .add_comment(AddCommentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            thread_id: thread_id.clone(),
            content_type: content_type as i32,
            content: content.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn update_comment(
    app: &AppHandle,
    project_id: &String,
    comment_id: &String,
    content_type: ContentType,
    content: &String,
) -> Result<UpdateCommentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectCodeApiClient::new(chan.unwrap());
    let res = client
        .update_comment(UpdateCommentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            comment_id: comment_id.clone(),
            content_type: content_type as i32,
            content: content.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_comment(
    app: &AppHandle,
    project_id: &String,
    thread_id: &String,
) -> Result<ListCommentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectCodeApiClient::new(chan.unwrap());

    let res = client
        .list_comment(ListCommentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            thread_id: thread_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn get_comment(
    app: &AppHandle,
    project_id: &String,
    comment_id: &String,
) -> Result<GetCommentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectCodeApiClient::new(chan.unwrap());

    let res = client
        .get_comment(GetCommentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            comment_id: comment_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn remove_comment(
    app: &AppHandle,
    project_id: &String,
    comment_id: &String,
) -> Result<RemoveCommentResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectCodeApiClient::new(chan.unwrap());

    let res = client
        .remove_comment(RemoveCommentRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            comment_id: comment_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_to_comment(comment: &Comment) -> CodeCommentInfo {
    let mut content_type = "text";
    if comment.content_type == ContentType::Markdown as i32 {
        content_type = "markdown";
    }
    return CodeCommentInfo {
        comment_id: Some(comment.comment_id.clone()),
        thread_id: Some(comment.thread_id.clone()),
        content_type: Some(content_type.into()),
        content: Some(comment.content.clone()),
        user_id: Some(comment.user_id.clone()),
        user_display_name: Some(comment.user_display_name.clone()),
        create_time: Some(comment.create_time),
        update_time: Some(comment.update_time),
    };
}

pub fn convert_to_comment_list(comment_list: &Vec<Comment>) -> Vec<CodeCommentInfo> {
    let mut ret_list = Vec::new();
    comment_list.iter().for_each(|comment| {
        ret_list.push(convert_to_comment(comment));
    });
    return ret_list;
}