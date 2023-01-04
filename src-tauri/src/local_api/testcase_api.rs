use crate::user_api_plugin::get_session_inner;
use local_api_rust::models::EntryInfo as ModelEntryInfo;
use proto_gen_rust::project_test_case_api::project_test_case_api_client::ProjectTestCaseApiClient;
use proto_gen_rust::project_test_case_api::{
    AddResultRequest, AddResultResponse, BasicResult, BasicResultImage, Entry, EntryType,
    GenTestCodeRequest, GenTestCodeResponse, ListEntryRequest, ListEntryResponse,
    ListFrameWorkRequest, ListFrameWorkResponse, ListLangRequest, ListLangResponse, ResultFrom,
};
use tauri::AppHandle;

pub async fn list_lang(app: &AppHandle) -> Result<ListLangResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    let res = client.list_lang(ListLangRequest {}).await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_frame_work(
    app: &AppHandle,
    lang: &String,
) -> Result<ListFrameWorkResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    let res = client
        .list_frame_work(ListFrameWorkRequest { lang: lang.clone() })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn gen_test_code(
    app: &AppHandle,
    project_id: &String,
    lang: &String,
    framework: &String,
    entry_id: &String,
) -> Result<GenTestCodeResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    let res = client
        .gen_test_code(GenTestCodeRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            entry_id: entry_id.clone(),
            lang: lang.clone(),
            frame_work: framework.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_entry(
    app: &AppHandle,
    project_id: &String,
    entry_id: &String,
) -> Result<ListEntryResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    let res = client
        .list_entry(ListEntryRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            entry_id: entry_id.clone(),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub fn convert_to_entry_list(entry_list: Vec<Entry>) -> Vec<ModelEntryInfo> {
    let mut ret_list = Vec::new();
    entry_list.iter().for_each(|entry| {
        let mut entry_type = "dir".into();
        if entry.entry_type == EntryType::Tc as i32 {
            entry_type = "testcase".into();
        }
        ret_list.push(ModelEntryInfo {
            entry_id: Some(entry.entry_id.clone()),
            entry_type: Some(entry_type),
            title: Some(entry.title.clone()),
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

pub async fn add_result(
    app: &AppHandle,
    project_id: &String,
    entry_id: &String,
    desc: &String,
    result_type: i32,
    image_list: Vec<BasicResultImage>,
    extra_file_id_list: Vec<String>,
) -> Result<AddResultResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    let res = client
        .add_result(AddResultRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            entry_id: entry_id.clone(),
            basic_result: Some(BasicResult {
                desc: desc.clone(),
                result_type: result_type,
                result_from: ResultFrom::LocalApi as i32,
                image_list: image_list,
                extra_file_id_list: extra_file_id_list,
            }),
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}
