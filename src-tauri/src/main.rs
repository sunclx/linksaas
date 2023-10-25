#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use min_app_plugin::clear_by_close;
use tauri::api::ipc::{format_callback, format_callback_result, CallbackFn};
use tauri::async_runtime::Mutex;
use tonic::transport::{Channel, Endpoint};

mod admin_auth_api_plugin;
mod appstore_admin_api_plugin;
mod appstore_api_plugin;
mod cicd_runner_api_plugin;
mod client_cfg_admin_api_plugin;
mod client_cfg_api_plugin;
mod data_anno_project_api_plugin;
mod data_anno_task_api_plugin;
mod events_admin_api_plugin;
mod events_api_plugin;
mod events_decode;
mod events_subscribe_api_plugin;
mod external_events_api_plugin;
mod fs_api_plugin;
mod image_utils;
mod link_aux_api_plugin;
mod local_api;
mod notice_decode;
mod org_admin_api_plugin;
mod project_admin_api_plugin;
mod project_alarm_api_plugin;
mod project_api_plugin;
mod project_appraise_api_plugin;
mod project_bulletin_api_plugin;
mod project_cicd_api_plugin;
mod project_code_api_plugin;
mod project_doc_api_plugin;
mod project_idea_api_plugin;
mod project_issue_api_plugin;
mod project_member_admin_api_plugin;
mod project_member_api_plugin;
mod project_requirement_api_plugin;
mod project_sprit_api_plugin;
mod project_tool_api_plugin;
mod short_note_api_plugin;
mod user_admin_api_plugin;
mod user_api_plugin;
mod user_app_api_plugin;
mod user_kb_api_plugin;
mod project_entry_api_plugin;
mod min_app_fs_plugin;
mod min_app_plugin;
mod min_app_shell_plugin;
mod min_app_store_plugin;
mod api_collection_api_plugin;
mod docker_template_admin_api_plugin;
mod docker_template_api_plugin;
mod http_custom_api_plugin;
mod rss_admin_api_plugin;
mod rss_api_plugin;
mod user_rss_api_plugin;
mod my_updater;
mod local_repo_plugin;
mod pub_search_admin_api_plugin;
mod pub_search_api_plugin;

use std::time::Duration;
use tauri::http::ResponseBuilder;
use tauri::{
    AppHandle, CustomMenuItem, InvokeResponse, Manager, Runtime, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, Window, WindowBuilder, WindowUrl,
};
use tokio::fs;

// linksaas://comment/xzx6nmp5WuyhT6lHgIwkZ
const INIT_SCRIPT: &str = r#"
Object.defineProperty(window, "__TAURI_POST_MESSAGE__", {
    value: (message) => {
      if (
        window.__TAURI_METADATA__ != undefined &&
        window.__TAURI_METADATA__.__currentWindow.label.startsWith("minApp:")
      ) {
        if (message.cmd == "tauri") {
          if (message.__tauriModule == "Http") {
            if (window.minApp !== undefined && window.minApp.crossHttp === true) {
              window.ipc.postMessage(JSON.stringify(message));
              return;
            } else {
              return;
            }
          } else if (message.__tauriModule == "Clipboard") {
            window.ipc.postMessage(JSON.stringify(message));
            return;
          } else {
            return;
          }
        } else if (message.cmd.startsWith("plugin:user_api|")) {
          return;
        } else if (message.cmd.startsWith("plugin:")) {
          window.ipc.postMessage(JSON.stringify(message));
          return;
        } else if (message.cmd.startsWith("_")) {
          window.ipc.postMessage(JSON.stringify(message));
          return;
        }
      } else {
        window.ipc.postMessage(JSON.stringify(message));
      }
    },
  });  
"#;

#[derive(Default)]
struct GrpcChan(Mutex<Option<Channel>>);

#[derive(Default)]
struct GrpcServerAddr(Mutex<String>);

#[tauri::command]
async fn conn_grpc_server(app_handle: AppHandle, _window: Window, addr: String) -> bool {
    let mut u = url::Url::parse(&addr);
    if u.is_err() {
        let new_addr = format!("http://{}", &addr);
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
            let gprc_server_addr = app_handle.state::<GrpcServerAddr>().inner();
            *gprc_server_addr.0.lock().await = addr;
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

#[tauri::command]
async fn get_conn_server_addr(app_handle: AppHandle) -> String {
    let grpc_server_addr = app_handle.state::<GrpcServerAddr>().inner();
    let addr = grpc_server_addr.0.lock().await;
    return addr.clone();
}

async fn get_grpc_chan<R: tauri::Runtime>(app_handle: &tauri::AppHandle<R>) -> Option<Channel> {
    let grpc_chan = app_handle.state::<GrpcChan>().inner();
    let chan = grpc_chan.0.lock().await;
    return chan.clone();
}

fn get_base_dir() -> Option<String> {
    if let Some(mut home_dir) = dirs::home_dir() {
        home_dir.push(".linksaas");
        return Some(home_dir.to_str().unwrap().into());
    }
    None
}

fn get_cache_dir() -> Option<String> {
    if let Some(mut home_dir) = dirs::home_dir() {
        home_dir.push(".linksaas");
        home_dir.push("cache");
        return Some(home_dir.to_str().unwrap().into());
    }
    None
}

fn get_user_dir() -> Option<String> {
    if let Some(mut home_dir) = dirs::home_dir() {
        home_dir.push(".linksaas");
        home_dir.push("user");
        return Some(home_dir.to_str().unwrap().into());
    }
    None
}

fn get_tmp_dir() -> Option<String> {
    if let Some(mut home_dir) = dirs::home_dir() {
        home_dir.push(".linksaas");
        home_dir.push("tmp");
        return Some(home_dir.to_str().unwrap().into());
    }
    None
}

fn get_minapp_dir() -> Option<String> {
    if let Some(mut home_dir) = dirs::home_dir() {
        home_dir.push(".linksaas");
        home_dir.push("minapp");
        return Some(home_dir.to_str().unwrap().into());
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
    if let Some(tmp_dir) = get_user_dir() {
        let meta = fs::metadata((&tmp_dir).as_str()).await;
        if meta.is_err() {
            if let Err(err) = fs::create_dir_all((&tmp_dir).as_str()).await {
                return Err(Box::new(err));
            }
        }
    }
    if let Some(tmp_dir) = get_minapp_dir() {
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
async fn check_update(app_handle: AppHandle) {
    my_updater::check_update_with_dialog(app_handle).await;
}

pub fn window_invoke_responder<R: Runtime>(
    window: Window<R>,
    response: InvokeResponse,
    success_callback: CallbackFn,
    error_callback: CallbackFn,
) {
    let callback_string =
        match format_callback_result(response.into_result(), success_callback, error_callback) {
            Ok(callback_string) => callback_string,
            Err(e) => format_callback(error_callback, &e.to_string())
                .expect("unable to serialize response string to json"),
        };

    let _ = window.eval(&callback_string);
}

fn main() {
    let mut cmd_post_hook = false;
    let args: Vec<String> = std::env::args().collect();
    if args.len() == 2 && args[1] == "postHook" {
        cmd_post_hook = true;
    }

    if local_api::is_instance_run() {
        if cmd_post_hook {
            local_api::call_git_post_hook();
        }
        return;
    }

    if cmd_post_hook {
        return;
    }
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("switch_user", "切换用户").disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("devtools", "调试"))
        .add_item(CustomMenuItem::new("show_app", "显示界面"))
        .add_item(CustomMenuItem::new("about", "关于"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("check_update", "检查更新"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("exit_app", "退出"));
    let app = tauri::Builder::default()
        .manage(GrpcChan(Default::default()))
        .manage(GrpcServerAddr(Default::default()))
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
            is_conn_server,
            get_conn_server_addr,
            check_update,
        ])
        .on_window_event(|ev| match ev.event() {
            tauri::WindowEvent::Destroyed => {
                let win = ev.window().clone();
                //清除微应用相关资源
                let app_handle = win.app_handle();
                let label = String::from(win.label());
                tauri::async_runtime::spawn(async move {
                    clear_by_close(app_handle, label).await;
                });
            }
            _ => {}
        })
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let all_windows = app.windows();
                for (_, win) in &all_windows {
                    win.show().unwrap();
                    win.unminimize().unwrap();
                    win.set_always_on_top(true).unwrap();
                    win.set_always_on_top(false).unwrap();
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
                        win.unminimize().unwrap();
                        win.set_always_on_top(true).unwrap();
                        win.set_always_on_top(false).unwrap();
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
                "check_update" => {
                    let handle = app.clone();
                    tauri::async_runtime::spawn(async move {
                        my_updater::check_update_with_dialog(handle).await;
                    });
                }
                _ => {}
            },
            _ => {}
        })
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .plugin(client_cfg_api_plugin::ClientCfgApiPlugin::new())
        .plugin(project_api_plugin::ProjectApiPlugin::new())
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
        .plugin(short_note_api_plugin::ShortNoteApiPlugin::new())
        .plugin(local_api::LocalApiPlugin::new())
        .plugin(events_subscribe_api_plugin::EventsSubscribeApiPlugin::new())
        .plugin(admin_auth_api_plugin::AdminAuthApiPlugin::new())
        .plugin(project_admin_api_plugin::ProjectAdminApiPlugin::new())
        .plugin(project_member_admin_api_plugin::ProjectMemberAdminApiPlugin::new())
        .plugin(user_admin_api_plugin::UserAdminApiPlugin::new())
        .plugin(org_admin_api_plugin::OrgAdminApiPlugin::new())
        .plugin(client_cfg_admin_api_plugin::ClientCfgAdminApiPlugin::new())
        .plugin(events_admin_api_plugin::EventsAdminApiPlugin::new())
        .plugin(min_app_plugin::MinAppPlugin::new())
        .plugin(min_app_fs_plugin::MinAppFsPlugin::new())
        .plugin(min_app_shell_plugin::MinAppShellPlugin::new())
        .plugin(min_app_store_plugin::MinAppStorePlugin::new())
        .plugin(project_requirement_api_plugin::ProjectRequirementApiPlugin::new())
        .plugin(appstore_api_plugin::AppstoreApiPlugin::new())
        .plugin(appstore_admin_api_plugin::AppstoreAdminApiPlugin::new())
        .plugin(user_app_api_plugin::UserAppApiPlugin::new())
        .plugin(project_code_api_plugin::ProjectCodeApiPlugin::new())
        .plugin(project_idea_api_plugin::ProjectIdeaApiPlugin::new())
        .plugin(project_tool_api_plugin::ProjectToolApiPlugin::new())
        .plugin(project_alarm_api_plugin::ProjectAlarmApiPlugin::new())
        .plugin(project_bulletin_api_plugin::ProjectBulletinApiPlugin::new())
        .plugin(local_repo_plugin::LocalRepoPlugin::new())
        .plugin(data_anno_project_api_plugin::DataAnnoProjectApiPlugin::new())
        .plugin(data_anno_task_api_plugin::DataAnnoTaskApiPlugin::new())
        .plugin(docker_template_api_plugin::DockerTemplateApiPlugin::new())
        .plugin(docker_template_admin_api_plugin::DockerTemplateAdminApiPlugin::new())
        .plugin(api_collection_api_plugin::ApiCollectionApiPlugin::new())
        .plugin(user_rss_api_plugin::UserRssApiPlugin::new())
        .plugin(rss_api_plugin::RssApiPlugin::new())
        .plugin(rss_admin_api_plugin::RssAdminApiPlugin::new())
        .plugin(pub_search_api_plugin::PubSearchApiPlugin::new())
        .plugin(pub_search_admin_api_plugin::PubSearchAdminApiPlugin::new())
        .plugin(http_custom_api_plugin::HttpCustomApiPlugin::new())
        .plugin(project_cicd_api_plugin::ProjectCiCdApiPlugin::new())
        .plugin(cicd_runner_api_plugin::CiCdRunnerApiPlugin::new())
        .plugin(project_entry_api_plugin::ProjectEntryApiPlugin::new())
        .invoke_system(String::from(INIT_SCRIPT), window_invoke_responder)
        .register_uri_scheme_protocol("fs", move |app_handle, request| {
            match url::Url::parse(request.uri()) {
                Err(_) => ResponseBuilder::new()
                    .header("Access-Control-Allow-Origin", "*")
                    .status(404)
                    .body("wrong url".into()),
                Ok(req_url) => {
                    let user_value = app_handle.state::<user_api_plugin::CurSession>().inner();
                    let admin_value = app_handle
                        .state::<admin_auth_api_plugin::CurAdminSession>()
                        .inner();
                    return tauri::async_runtime::block_on(async move {
                        let cur_session = user_value.0.lock().await;
                        if let Some(cur_session_id) = cur_session.clone() {
                            return fs_api_plugin::http_download_file(
                                app_handle,
                                String::from("main"),
                                req_url.path(),
                                cur_session_id.as_str(),
                            )
                            .await;
                        } else {
                            let cur_session = admin_value.0.lock().await;
                            if let Some(cur_session_id) = cur_session.clone() {
                                return fs_api_plugin::http_download_file(
                                    app_handle,
                                    String::from("main"),
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
                        }
                    });
                }
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building  tauri application");
    app.run(|app_handle, event| match event {
        tauri::RunEvent::Updater(updater_event) => {
            let win = app_handle.get_window("main");
            match updater_event {
                tauri::UpdaterEvent::DownloadProgress {
                    chunk_length,
                    content_length,
                } => {
                    if win.is_some() && content_length.is_some() {
                        let content_length: u64 = content_length.unwrap();
                        if content_length > 0 {
                            if let Err(err) = win.unwrap().emit(
                                "updateProgress",
                                (chunk_length as f32) / (content_length as f32),
                            ) {
                                println!("{}", err);
                            }
                        }
                    }
                }
                tauri::UpdaterEvent::Error(_) => {
                    if win.is_some() {
                        if let Err(err) = win.unwrap().emit("updateProgress", -1) {
                            println!("{}", err);
                        }
                    }
                }
                _ => {}
            }
        }
        _ => {}
    });
}
