use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_test_case_api::project_test_case_api_client::ProjectTestCaseApiClient;
use proto_gen_rust::{project_test_case_api as api};
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::CreateEntryRequest,
) -> Result<api::CreateEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.create_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::create_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::ListEntryRequest,
) -> Result<api::ListEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::list_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


#[tauri::command]
async fn get_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::GetEntryRequest,
) -> Result<api::GetEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.get_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::get_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_parent_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::SetParentEntryRequest,
) -> Result<api::SetParentEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.set_parent_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::set_parent_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_parent_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_entry_title<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::UpdateEntryTitleRequest,
) -> Result<api::UpdateEntryTitleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.update_entry_title(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::update_entry_title_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_entry_title".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_entry<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::RemoveEntryRequest,
) -> Result<api::RemoveEntryResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.remove_entry(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::remove_entry_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_entry".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_rule<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::AddRuleRequest,
) -> Result<api::AddRuleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.add_rule(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::add_rule_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_rule".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_rule<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::UpdateRuleRequest,
) -> Result<api::UpdateRuleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.update_rule(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::update_rule_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_rule".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_rule<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::RemoveRuleRequest,
) -> Result<api::RemoveRuleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.remove_rule(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::remove_rule_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_rule".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_rule<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::ListRuleRequest,
) -> Result<api::ListRuleResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_rule(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::list_rule_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_rule".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::AddMetricRequest,
) -> Result<api::AddMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.add_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::add_metric_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_metric".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::UpdateMetricRequest,
) -> Result<api::UpdateMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.update_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::update_metric_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_metric".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::RemoveMetricRequest,
) -> Result<api::RemoveMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.remove_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::remove_metric_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_metric".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_metric<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::ListMetricRequest,
) -> Result<api::ListMetricResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_metric(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::list_metric_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_metric".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_test_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::SetTestContentRequest,
) -> Result<api::SetTestContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.set_test_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::set_test_content_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("set_test_content".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_test_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::GetTestContentRequest,
) -> Result<api::GetTestContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.get_test_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::get_test_content_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_test_content".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}


#[tauri::command]
async fn add_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::AddResultRequest,
) -> Result<api::AddResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.add_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::add_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("add_result".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::RemoveResultRequest,
) -> Result<api::RemoveResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.remove_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::remove_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_result".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_result<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::ListResultRequest,
) -> Result<api::ListResultResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_result(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::list_result_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_result".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_lang<R: Runtime>(
    app_handle: AppHandle<R>,
    request: api::ListLangRequest,
) -> Result<api::ListLangResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_lang(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_frame_work<R: Runtime>(
    app_handle: AppHandle<R>,
    request: api::ListFrameWorkRequest,
) -> Result<api::ListFrameWorkResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.list_frame_work(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn gen_test_code<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: api::GenTestCodeRequest,
) -> Result<api::GenTestCodeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectTestCaseApiClient::new(chan.unwrap());
    match client.gen_test_code(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == api::gen_test_code_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("gen_test_code".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectTestCaseApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectTestCaseApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_entry,
                list_entry,
                get_entry,
                set_parent_entry,
                update_entry_title,
                remove_entry,
                add_rule,
                update_rule,
                remove_rule,
                list_rule,
                add_metric,
                update_metric,
                remove_metric,
                list_metric,
                set_test_content,
                get_test_content,
                add_result,
                remove_result,
                list_result,
                list_lang,
                list_frame_work,
                gen_test_code,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectTestCaseApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_test_case_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, _app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
