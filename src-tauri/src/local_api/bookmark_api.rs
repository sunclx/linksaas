use crate::user_api_plugin::get_session_inner;
use proto_gen_rust::project_bookmark_api::project_book_mark_api_client::ProjectBookMarkApiClient;
use proto_gen_rust::project_bookmark_api::*;
use tauri::AppHandle;

pub async fn create_book_mark(
    app: &AppHandle,
    project_id: &String,
    title: &String,
    url: &String,
    content: &String,
) -> Result<CreateBookMarkResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectBookMarkApiClient::new(chan.unwrap());
    let res = client.create_book_mark(CreateBookMarkRequest {
        session_id: get_session_inner(app).await,
        project_id: project_id.clone(),
        title: title.clone(),
        url: url.clone(),
        content: content.clone(),
        cate_id: "".into(),
    }).await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}
