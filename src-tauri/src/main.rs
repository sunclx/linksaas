#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::async_runtime::Mutex;
use tonic::transport::{Channel, Endpoint};

mod client_cfg_api_plugin;
mod events_api_plugin;
mod events_subscribe_api_plugin;
mod events_decode;
mod external_events_api_plugin;
mod fs_api_plugin;
mod image_utils;
mod link_aux_api_plugin;
mod local_api;
mod notice_decode;
mod project_api_plugin;
mod project_admin_api_plugin;
mod project_app_api_plugin;
mod project_appraise_api_plugin;
mod project_award_api_plugin;
mod project_book_shelf_api_plugin;
mod project_channel_api_plugin;
mod project_doc_api_plugin;
mod project_expert_qa_api_plugin;
mod project_issue_api_plugin;
mod project_member_api_plugin;
mod project_member_admin_api_plugin;
mod project_sprit_api_plugin;
mod project_vc_api_plugin;
mod project_test_case_api_plugin;
mod restrict_api_plugin;
mod robot_api_plugin;
mod robot_earthly_api_plugin;
mod robot_metric_api_plugin;
mod robot_script_api_plugin;
mod search_api_plugin;
mod short_note_api_plugin;
mod user_api_plugin;
mod user_admin_api_plugin;
mod user_kb_api_plugin;
mod admin_auth_api_plugin;

use std::time::Duration;
use tauri::http::ResponseBuilder;
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, Window, WindowBuilder, WindowUrl,
};
use tokio::fs;

#[derive(Default)]
struct GrpcChan(Mutex<Option<Channel>>);

#[tauri::command]
async fn conn_grpc_server(app_handle: AppHandle, _window: Window, addr: String) -> bool {
    let mut u = url::Url::parse(&addr);
    if u.is_err() {
        let new_addr = format!("http://{}", addr);
        u = url::Url::parse(&new_addr);
        if u.is_err() {
            return false;
        }
    }
    let mut u = u.unwrap();
    if let Err(_) = u.set_scheme("http") {
        return false;
    }
    if u.port().is_none() {
        if let Err(_) = u.set_port(Some(5000)) {
            return false;
        }
    }
    if let Ok(endpoint) = Endpoint::from_shared(String::from(u)) {
        if let Ok(chan) = endpoint
            .tcp_keepalive(Some(Duration::new(300, 0)))
            .connect()
            .await
        {
            let grpc_chan = app_handle.state::<GrpcChan>().inner();
            *grpc_chan.0.lock().await = Some(chan);
            return true;
        }
    }
    false
}

#[tauri::command]
async fn is_conn_server(app_handle: AppHandle, _window: Window) -> bool {
    let grpc_chan = app_handle.state::<GrpcChan>().inner();
    let chan = grpc_chan.0.lock().await;
    return chan.is_some();
}

async fn get_grpc_chan<R: tauri::Runtime>(app_handle: &tauri::AppHandle<R>) -> Option<Channel> {
    let grpc_chan = app_handle.state::<GrpcChan>().inner();
    let chan = grpc_chan.0.lock().await;
    return chan.clone();
}

fn get_base_dir() -> Option<String> {
    if let Some(home_dir) = dirs::home_dir() {
        return Some(format!("{}/.linksaas", home_dir.to_str().unwrap()));
    }
    None
}

fn get_cache_dir() -> Option<String> {
    if let Some(home_dir) = dirs::home_dir() {
        return Some(format!("{}/.linksaas/cache", home_dir.to_str().unwrap()));
    }
    None
}

fn get_tmp_dir() -> Option<String> {
    if let Some(home_dir) = dirs::home_dir() {
        return Some(format!("{}/.linksaas/tmp", home_dir.to_str().unwrap()));
    }
    None
}

async fn init_local_storage() -> Result<(), Box<dyn std::error::Error>> {
    if let Some(base_dir) = get_base_dir() {
        let meta = fs::metadata((&base_dir).as_str()).await;
        if meta.is_err() {
            if let Err(err) = fs::create_dir_all((&base_dir).as_str()).await {
                return Err(Box::new(err));
            }
        }
    }
    if let Some(cache_dir) = get_cache_dir() {
        let meta = fs::metadata((&cache_dir).as_str()).await;
        if meta.is_err() {
            if let Err(err) = fs::create_dir_all((&cache_dir).as_str()).await {
                return Err(Box::new(err));
            }
        }
    }
    if let Some(tmp_dir) = get_tmp_dir() {
        let meta = fs::metadata((&tmp_dir).as_str()).await;
        if meta.is_err() {
            if let Err(err) = fs::create_dir_all((&tmp_dir).as_str()).await {
                return Err(Box::new(err));
            }
        }
    }
    Ok(())
}

#[tauri::command]
async fn capture_screen(
    _app_handle: AppHandle,
    _window: Window,
    do_blur: bool,
    blur_sigma: f32,
) -> Result<Vec<Vec<u8>>, String> {
    match image_utils::capture_screen_data(do_blur, blur_sigma) {
        Err(err) => Err(err),
        Ok(img_list) => {
            let mut ret_list: Vec<Vec<u8>> = Vec::new();
            for img in img_list {
                match image_utils::encode_to_bmp(img) {
                    Err(err) => {
                        return Err(err);
                    }
                    Ok(data) => {
                        ret_list.push(data);
                    }
                }
            }
            return Ok(ret_list);
        }
    }
}

fn main() {
    if local_api::is_instance_run() {
        return;
    }
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("switch_user", "切换用户").disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("devtools", "调试"))
        .add_item(CustomMenuItem::new("show_app", "显示界面"))
        .add_item(CustomMenuItem::new("about", "关于"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("exit_app", "退出"));
    tauri::Builder::default()
        .manage(GrpcChan(Default::default()))
        .setup(|_app| {
            return tauri::async_runtime::block_on(async {
                let init_res = init_local_storage().await;
                if init_res.is_err() {
                    return init_res;
                }
                Ok(())
            });
        })
        .invoke_handler(tauri::generate_handler![
            conn_grpc_server,
            capture_screen,
            is_conn_server
        ])
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let all_windows = app.windows();
                for (_, win) in &all_windows {
                    win.show().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "switch_user" => {
                    let win = app.get_window("main").unwrap();
                    if let Err(err) = win.emit("notice", notice_decode::new_switch_user_notice()) {
                        println!("{:?}", err);
                    }
                }
                "devtools" => {
                    let win = app.get_window("main").unwrap();
                    win.open_devtools();
                }
                "show_app" => {
                    let all_windows = app.windows();
                    for (_, win) in &all_windows {
                        win.show().unwrap();
                        if let Err(_) = win.set_always_on_top(true) {}
                        if let Err(_) = win.set_always_on_top(false) {}
                    }
                }
                "about" => {
                    let about_win = app.get_window("about");
                    if about_win.is_none() {
                        if let Ok(_) =
                            WindowBuilder::new(app, "about", WindowUrl::App("about.html".into()))
                                .inner_size(250.0, 180.0)
                                .resizable(false)
                                .skip_taskbar(true)
                                .title("关于")
                                .always_on_top(true)
                                .center()
                                .decorations(false)
                                .visible(true)
                                .build()
                        {}
                    }
                }
                "exit_app" => {
                    local_api::remove_info_file();
                    app.exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .plugin(client_cfg_api_plugin::ClientCfgApiPlugin::new())
        .plugin(project_api_plugin::ProjectApiPlugin::new())
        .plugin(project_channel_api_plugin::ProjectChannelApiPlugin::new())
        .plugin(project_member_api_plugin::ProjectMemberApiPlugin::new())
        .plugin(user_api_plugin::UserApiPlugin::new())
        .plugin(events_api_plugin::EventsApiPlugin::new())
        .plugin(external_events_api_plugin::ExternalEventsApiPlugin::new())
        .plugin(project_sprit_api_plugin::ProjectSpritApiPlugin::new())
        .plugin(project_doc_api_plugin::ProjectDocApiPlugin::new())
        .plugin(project_issue_api_plugin::ProjectIssueApiPlugin::new())
        .plugin(fs_api_plugin::FsApiPlugin::new())
        .plugin(project_appraise_api_plugin::ProjectAppraiseApiPlugin::new())
        .plugin(user_kb_api_plugin::UserKbApiPlugin::new())
        .plugin(link_aux_api_plugin::LinkAuxApiPlugin::new())
        .plugin(project_vc_api_plugin::ProjectVcApiPlugin::new())
        .plugin(project_expert_qa_api_plugin::ProjectExpertQaApiPlugin::new())
        .plugin(search_api_plugin::SearchApiPlugin::new())
        .plugin(restrict_api_plugin::RestrictApiPlugin::new())
        .plugin(project_app_api_plugin::ProjectAppApiPlugin::new())
        .plugin(project_book_shelf_api_plugin::ProjectBookShelfApiPlugin::new())
        .plugin(project_award_api_plugin::ProjectAwardApiPlugin::new())
        .plugin(short_note_api_plugin::ShortNoteApiPlugin::new())
        .plugin(robot_api_plugin::RobotApiPlugin::new())
        .plugin(robot_metric_api_plugin::RobotMetricApiPlugin::new())
        .plugin(robot_earthly_api_plugin::RobotEarthlyApiPlugin::new())
        .plugin(robot_script_api_plugin::RobotScriptApiPlugin::new())
        .plugin(local_api::LocalApiPlugin::new())
        .plugin(project_test_case_api_plugin::ProjectTestCaseApiPlugin::new())
        .plugin(events_subscribe_api_plugin::EventsSubscribeApiPlugin::new())
        .plugin(admin_auth_api_plugin::AdminAuthApiPlugin::new())
        .plugin(project_admin_api_plugin::ProjectAdminApiPlugin::new())
        .plugin(project_member_admin_api_plugin::ProjectMemberAdminApiPlugin::new())
        .plugin(user_admin_api_plugin::UserAdminApiPlugin::new())
        .register_uri_scheme_protocol("fs", move |app_handle, request| {
            match url::Url::parse(request.uri()) {
                Err(_) => ResponseBuilder::new()
                    .header("Access-Control-Allow-Origin", "*")
                    .status(404)
                    .body("wrong url".into()),
                Ok(req_url) => {
                    let cur_value = app_handle.state::<user_api_plugin::CurSession>().inner();
                    return tauri::async_runtime::block_on(async move {
                        let cur_session = cur_value.0.lock().await;
                        if let Some(cur_session_id) = cur_session.clone() {
                            return fs_api_plugin::http_download_file(
                                app_handle,
                                req_url.path(),
                                cur_session_id.as_str(),
                            )
                            .await;
                        } else {
                            return ResponseBuilder::new()
                                .header("Access-Control-Allow-Origin", "*")
                                .status(403)
                                .body("wrong session".into());
                        }
                    });
                }
            }
        })
        .register_uri_scheme_protocol("vc", move |app_handle, request| {
            match url::Url::parse(request.uri()) {
                Err(_) => ResponseBuilder::new()
                    .header("Access-Control-Allow-Origin", "*")
                    .status(404)
                    .body("wrong url".into()),
                Ok(req_url) => {
                    let cur_value = app_handle.state::<user_api_plugin::CurSession>().inner();
                    return tauri::async_runtime::block_on(async move {
                        let cur_session = cur_value.0.lock().await;
                        if let Some(cur_session_id) = cur_session.clone() {
                            return project_vc_api_plugin::http_read_content(
                                app_handle,
                                req_url.path(),
                                cur_session_id.as_str(),
                            )
                            .await;
                        } else {
                            return ResponseBuilder::new()
                                .header("Access-Control-Allow-Origin", "*")
                                .status(403)
                                .body("wrong session".into());
                        }
                    });
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
