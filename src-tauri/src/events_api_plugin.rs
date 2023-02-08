use crate::{
    events_decode::{decode_event, EventMessage},
    min_app_plugin::get_min_app_perm, user_api_plugin::{get_user_id, get_session},
};
use proto_gen_rust::events_api::events_api_client::EventsApiClient;
use proto_gen_rust::events_api::*;
use std::vec;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

use crate::notice_decode::new_wrong_session_notice;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginEvent {
    pub event_id: String,
    pub user_id: String,
    pub user_display_name: String,
    pub project_id: String,
    pub project_name: String,
    pub event_type: i32,
    pub event_time: i64,
    pub ref_type: i32,
    pub ref_id: String,
    pub cur_user_display_name: String,
    pub cur_logo_uri: String,
    pub event_data: Option<EventMessage>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListUserEventResponse {
    pub code: i32,
    pub err_msg: String,
    pub total_count: u32,
    pub event_list: vec::Vec<PluginEvent>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListProjectEventResponse {
    pub code: i32,
    pub err_msg: String,
    pub total_count: u32,
    pub event_list: vec::Vec<PluginEvent>,
    pub day_addon_list: vec::Vec<DayAddonInfo>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListEventByRefResponse {
    pub code: i32,
    pub err_msg: String,
    pub event_list: vec::Vec<PluginEvent>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListEventByGetResponse {
    pub code: i32,
    pub err_msg: String,
    pub event: PluginEvent,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct PluginListEventByIdResponse {
    pub code: i32,
    pub err_msg: String,
    pub event_list: vec::Vec<PluginEvent>,
}

#[tauri::command]
async fn list_user_day_status<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListUserDayStatusRequest,
) -> Result<ListUserDayStatusResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_user_day_status(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_user_day_status_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_user_day_status".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_user_event<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListUserEventRequest,
) -> Result<PluginListUserEventResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_user_event(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_user_event_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_user_event".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(convert_list_user_event_response(inner_resp));
        }
        Err(status) => Err(status.message().into()),
    }
}

fn convert_list_user_event_response(
    src_resp: ListUserEventResponse,
) -> PluginListUserEventResponse {
    return PluginListUserEventResponse {
        code: src_resp.code,
        err_msg: src_resp.err_msg,
        total_count: src_resp.total_count,
        event_list: convert_event(src_resp.event_list),
    };
}

pub fn convert_event(ev_list: vec::Vec<Event>) -> vec::Vec<PluginEvent> {
    let mut ret_list = vec::Vec::new();
    for ev in &ev_list {
        let ev_decode = match &ev.event_data {
            None => None,
            Some(ev_inner) => decode_event(&ev_inner),
        };
        ret_list.push(PluginEvent {
            event_id: ev.event_id.clone(),
            user_id: ev.user_id.clone(),
            user_display_name: ev.user_display_name.clone(),
            project_id: ev.project_id.clone(),
            project_name: ev.project_name.clone(),
            event_type: ev.event_type,
            event_time: ev.event_time,
            ref_type: ev.ref_type,
            ref_id: ev.ref_id.clone(),
            event_data: ev_decode,
            cur_user_display_name: ev.cur_user_display_name.clone(),
            cur_logo_uri: ev.cur_logo_uri.clone(),
        });
    }
    return ret_list;
}

#[tauri::command]
async fn list_project_day_status<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListProjectDayStatusRequest,
) -> Result<ListProjectDayStatusResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_project_day_status(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_project_day_status_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_project_day_status".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_project_event<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListProjectEventRequest,
) -> Result<PluginListProjectEventResponse, String> {
    let mut new_request = request.clone();
    if let Some(min_app_perm) = get_min_app_perm(
        app_handle.clone(),
        window.clone(),
        new_request.project_id.clone(),
    )
    .await
    {
        let event_perm = min_app_perm.event_perm;
        if event_perm.is_none() {
            return Err("no permission".into());
        }
        let event_perm = event_perm.unwrap();

        let cur_user_id = get_user_id(app_handle.clone()).await;
        
        let mut valid = false;
        if event_perm.list_all_event {
            valid = true;
        } else if event_perm.list_my_event
            && request.filter_by_member_user_id
            && &request.member_user_id == &cur_user_id
        {
            valid = true;
        }
        if valid {
            new_request.session_id = get_session(app_handle.clone()).await;
        }
    }
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_project_event(new_request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_project_event_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_project_event".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(convert_list_project_event_response(inner_resp));
        }
        Err(status) => Err(status.message().into()),
    }
}

fn convert_list_project_event_response(
    src_resp: ListProjectEventResponse,
) -> PluginListProjectEventResponse {
    return PluginListProjectEventResponse {
        code: src_resp.code,
        err_msg: src_resp.err_msg,
        total_count: src_resp.total_count,
        event_list: convert_event(src_resp.event_list),
        day_addon_list: src_resp.day_addon_list,
    };
}

#[tauri::command]
async fn list_event_by_ref<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListEventByRefRequest,
) -> Result<PluginListEventByRefResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_event_by_ref(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_event_by_ref_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_event_by_ref".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(convert_list_event_by_ref_response(inner_resp));
        }
        Err(status) => Err(status.message().into()),
    }
}

fn convert_list_event_by_ref_response(
    src_resp: ListEventByRefResponse,
) -> PluginListEventByRefResponse {
    return PluginListEventByRefResponse {
        code: src_resp.code,
        err_msg: src_resp.err_msg,
        event_list: convert_event(src_resp.event_list),
    };
}

#[tauri::command]
async fn get_event<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetEventRequest,
) -> Result<PluginListEventByGetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.get_event(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_event_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_event".into()))
                {
                    println!("{:?}", err);
                }
            }
            return Ok(convert_list_event_by_get_response(inner_resp));
        }
        Err(status) => Err(status.message().into()),
    }
}

fn convert_list_event_by_get_response(src_resp: GetEventResponse) -> PluginListEventByGetResponse {
    if src_resp.event.is_none() {
        println!("get_event response {:?}", src_resp.clone());
        return PluginListEventByGetResponse {
            code: src_resp.code,
            err_msg: src_resp.err_msg,
            event: PluginEvent {
                event_id: "".into(),
                user_id: "".into(),
                user_display_name: "".into(),
                project_id: "".into(),
                project_name: "".into(),
                event_type: 0,
                event_time: 0,
                ref_type: 0,
                ref_id: "".into(),
                event_data: Some(EventMessage::NoopEvent()),
                cur_user_display_name: "".into(),
                cur_logo_uri: "".into(),
            },
        };
    }
    let ev = src_resp.event.unwrap();
    let ev_decode = decode_event(&ev.event_data.unwrap());
    return PluginListEventByGetResponse {
        code: src_resp.code,
        err_msg: src_resp.err_msg,
        event: PluginEvent {
            event_id: ev.event_id.clone(),
            user_id: ev.user_id.clone(),
            user_display_name: ev.user_display_name.clone(),
            project_id: ev.project_id.clone(),
            project_name: ev.project_name.clone(),
            event_type: ev.event_type,
            event_time: ev.event_time,
            ref_type: ev.ref_type,
            ref_id: ev.ref_id.clone(),
            event_data: ev_decode,
            cur_user_display_name: ev.cur_user_display_name,
            cur_logo_uri: ev.cur_logo_uri,
        },
    };
}

#[tauri::command]
async fn list_event_by_id<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListEventByIdRequest,
) -> Result<PluginListEventByIdResponse, String> {
    if request.event_id_list.len() == 0 {
        return Ok(PluginListEventByIdResponse {
            code: list_event_by_id_response::Code::Ok as i32,
            err_msg: "".into(),
            event_list: std::vec::Vec::new(),
        });
    }
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.list_event_by_id(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_event_by_id_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("list_event_by_id".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(convert_list_event_by_id_response(inner_resp));
        }
        Err(status) => Err(status.message().into()),
    }
}

fn convert_list_event_by_id_response(
    src_resp: ListEventByIdResponse,
) -> PluginListEventByIdResponse {
    return PluginListEventByIdResponse {
        code: src_resp.code,
        err_msg: src_resp.err_msg,
        event_list: convert_event(src_resp.event_list),
    };
}

#[tauri::command]
async fn set_day_addon_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetDayAddonInfoRequest,
) -> Result<SetDayAddonInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.set_day_addon_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_day_addon_info_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("set_day_addon_info".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_day_addon_info<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetDayAddonInfoRequest,
) -> Result<GetDayAddonInfoResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = EventsApiClient::new(chan.unwrap());
    match client.get_day_addon_info(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_day_addon_info_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit(
                    "notice",
                    new_wrong_session_notice("get_day_addon_info".into()),
                ) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct EventsApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> EventsApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_user_day_status,
                list_user_event,
                list_project_day_status,
                list_project_event,
                list_event_by_ref,
                get_event,
                list_event_by_id,
                set_day_addon_info,
                get_day_addon_info,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for EventsApiPlugin<R> {
    fn name(&self) -> &'static str {
        "events_api"
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
