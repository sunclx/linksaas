use crate::helper::http::start_http_serv;
use crate::min_app_store_plugin::{close_store, start_store};
use async_zip::read::seek::ZipFileReader;
use async_zip::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use proto_gen_rust::appstore_api::AppPerm;
use regex::Regex;
use std::collections::HashMap;
use std::time::Duration;
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tauri::{
    api::process::{Command, CommandChild, CommandEvent},
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window, WindowBuilder, WindowUrl,
};
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use tokio::time::sleep;

const INIT_SCRIPT: &str = r#"
Object.defineProperty(window, "minApp", {
    value: {
        projectId: "__PROJECT_ID__",
        projectName: "__PROJECT_NAME__",
        memberUserId: "__MEMBER_USER_ID__",
        memberDisplayName: "__MEMBER_DISPLAY_NAME__",
        tokenUrl: "__TOKEN_URL__",
        crossHttp: __CROSS_HTTP__,
        redisProxyToken: "__REDIS_PROXY_TOKEN__",
        redisProxyAddr: "__REDIS_PROXY_ADDR__",
        mongoProxyToken: "__MONGO_PROXY_TOKEN__",
        mongoProxyAddr: "__MONGO_PROXY_ADDR__",
        mysqlProxyToken: "__MYSQL_PROXY_TOKEN__",
        mysqlProxyAddr: "__MYSQL_PROXY_ADDR__",
        postGresProxyToken: "__POST_GRES_PROXY_TOKEN__",
        postGresProxyAddr: "__POST_GRES_PROXY_ADDR__",
        sshProxyToken: "__SSH_PROXY_TOKEN__",
        sshProxyAddr: "__SSH_PROXY_ADDR__",
        netUtilToken: "__NET_UTIL_TOKEN__",
        netUtilAddr: "__NET_UTIL_ADDR__",
    }
});
"#;

#[derive(Default)]
pub struct HttpServerMap(pub Mutex<HashMap<String, tokio::sync::oneshot::Sender<()>>>);

#[derive(Default)]
pub struct RedisProxyMap(pub Mutex<HashMap<String, CommandChild>>);

#[derive(Default)]
pub struct MongoProxyMap(pub Mutex<HashMap<String, CommandChild>>);

#[derive(Default)]
pub struct SqlProxyMap(pub Mutex<HashMap<String, CommandChild>>);

#[derive(Default)]
pub struct SshProxyMap(pub Mutex<HashMap<String, CommandChild>>);

#[derive(Default)]
pub struct NetUtilMap(pub Mutex<HashMap<String, CommandChild>>);

#[derive(Default)]
pub struct AppPermMap(pub Mutex<HashMap<String, AppPerm>>);

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct StartRequest {
    pub project_id: String,
    pub project_name: String,
    pub member_user_id: String,
    pub member_display_name: String,
    pub token_url: String,
    pub label: String,
    pub title: String,
    pub path: String,
}

// linksaas://comment/T4REDwNFdxcdiw3yFCti3
pub async fn clear_by_close<R: Runtime>(app_handle: AppHandle<R>, label: String) {
    println!("clear min app resource");
    {
        let app_perm_map = app_handle.state::<AppPermMap>().inner();
        let mut app_perm_map = app_perm_map.0.lock().await;
        app_perm_map.remove(&label);
    }
    {
        let serv_map = app_handle.state::<HttpServerMap>().inner();
        let mut serv_map_data = serv_map.0.lock().await;
        let tx = serv_map_data.remove(&label);
        if tx.is_some() {
            tx.unwrap().send(()).ok();
        }
    }
    {
        let proxy_map = app_handle.state::<RedisProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        let child = proxy_map_data.remove(&label);
        if child.is_some() {
            println!("kill redis proxy");
            if let Err(err) = child.unwrap().kill() {
                println!("{:?}", err);
            }
        }
    }
    {
        let proxy_map = app_handle.state::<MongoProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        let child = proxy_map_data.remove(&label);
        if child.is_some() {
            println!("kill mongo proxy");
            if let Err(err) = child.unwrap().kill() {
                println!("{:?}", err);
            }
        }
    }
    {
        let proxy_map = app_handle.state::<SqlProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        let child = proxy_map_data.remove(&label);
        if child.is_some() {
            println!("kill sql proxy");
            if let Err(err) = child.unwrap().kill() {
                println!("{:?}", err);
            }
        }
    }
    {
        let proxy_map = app_handle.state::<SshProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        let child = proxy_map_data.remove(&label);
        if child.is_some() {
            println!("kill ssh proxy");
            if let Err(err) = child.unwrap().kill() {
                println!("{:?}", err);
            }
        }
    }
    {
        let proxy_map = app_handle.state::<NetUtilMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        let child = proxy_map_data.remove(&label);
        if child.is_some() {
            println!("kill net util");
            if let Err(err) = child.unwrap().kill() {
                println!("{:?}", err);
            }
        }
    }
    close_store(app_handle.clone(), &label).await;
}

#[tauri::command]
async fn start<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: StartRequest,
    perm: AppPerm,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    if &request.label == "main" {
        return Err("no permission".into());
    }
    //关闭之前的窗口
    let dest_win = app_handle.get_window(&request.label);
    if dest_win.is_some() {
        if let Err(err) = dest_win.unwrap().close() {
            return Err(err.to_string());
        }
        sleep(Duration::from_millis(500)).await;
    }

    //保存权限
    {
        let app_perm_map = app_handle.state::<AppPermMap>().inner();
        let mut app_perm_map = app_perm_map.0.lock().await;
        app_perm_map.insert(request.label.clone(), perm.clone());
    }

    let mut dest_url = String::from("");
    if request.path.starts_with("http://") {
        dest_url.clone_from(&request.path);
    } else {
        let mut cross_origin_isolated = false;
        if let Some(extra_perm) = perm.extra_perm {
            cross_origin_isolated = extra_perm.cross_origin_isolated;
        }
        let serv = start_http_serv(request.path, cross_origin_isolated).await;
        if serv.is_err() {
            return Err(serv.err().unwrap());
        }
        let serv = serv.unwrap();
        {
            let serv_map = app_handle.state::<HttpServerMap>().inner();
            let mut serv_map_data = serv_map.0.lock().await;
            serv_map_data.insert(request.label.clone(), serv.1);
        }
        let tmp_url = format!("http://localhost:{}/index.html", serv.0);
        dest_url.clone_from(&tmp_url);
    }
    let open_url = url::Url::parse(dest_url.as_str());
    if open_url.is_err() {
        clear_by_close(app_handle.clone(), request.label.clone()).await;
        return Err(open_url.err().unwrap().to_string());
    }

    let mut script = INIT_SCRIPT
        .replace("__PROJECT_ID__", &request.project_id)
        .replace(
            "__PROJECT_NAME__",
            &html_escape::encode_script_quoted_text(&request.project_name),
        )
        .replace("__MEMBER_USER_ID__", &request.member_user_id)
        .replace(
            "__MEMBER_DISPLAY_NAME__",
            &html_escape::encode_script_quoted_text(&request.member_display_name),
        )
        .replace(
            "__TOKEN_URL__",
            &html_escape::encode_script_quoted_text(&request.token_url),
        );
    if let Some(net_perm) = perm.net_perm {
        if net_perm.cross_domain_http {
            script = script.replace("__CROSS_HTTP__", "true");
        } else {
            script = script.replace("__CROSS_HTTP__", "false");
        }
        // 处理redis proxy
        if net_perm.proxy_redis {
            let res = start_sidecar_proxy(
                app_handle.clone(),
                request.label.clone(),
                "redis",
                Vec::new(),
            )
            .await;
            if res.is_err() {
                clear_by_close(app_handle.clone(), request.label.clone()).await;
                return Err(res.err().unwrap());
            }
            let (addr, token) = res.unwrap();
            script = script.replace("__REDIS_PROXY_TOKEN__", &token);
            script = script.replace("__REDIS_PROXY_ADDR__", &addr);
        } else {
            script = script.replace("__REDIS_PROXY_TOKEN__", "");
            script = script.replace("__REDIS_PROXY_ADDR__", "");
        }
        // 处理mongo proxy
        if net_perm.proxy_mongo {
            let res = start_sidecar_proxy(
                app_handle.clone(),
                request.label.clone(),
                "mongo",
                Vec::new(),
            )
            .await;
            if res.is_err() {
                clear_by_close(app_handle.clone(), request.label.clone()).await;
                return Err(res.err().unwrap());
            }
            let (addr, token) = res.unwrap();
            script = script.replace("__MONGO_PROXY_TOKEN__", &token);
            script = script.replace("__MONGO_PROXY_ADDR__", &addr);
        } else {
            script = script.replace("__MONGO_PROXY_TOKEN__", "");
            script = script.replace("__MONGO_PROXY_ADDR__", "");
        }
        // 处理sql proxy
        if net_perm.proxy_mysql || net_perm.proxy_post_gres {
            let mut args = Vec::new();
            if net_perm.proxy_mysql {
                args.push(String::from("mysql"))
            }
            if net_perm.proxy_post_gres {
                args.push(String::from("postgres"));
            }
            let res =
                start_sidecar_proxy(app_handle.clone(), request.label.clone(), "sql", args).await;
            if res.is_err() {
                clear_by_close(app_handle.clone(), request.label.clone()).await;
                return Err(res.err().unwrap());
            }
            let (addr, token) = res.unwrap();
            if net_perm.proxy_mysql {
                script = script.replace("__MYSQL_PROXY_TOKEN__", &token);
                script = script.replace("__MYSQL_PROXY_ADDR__", &addr);
            }
            if net_perm.proxy_post_gres {
                script = script.replace("__POST_GRES_PROXY_TOKEN__", &token);
                script = script.replace("__POST_GRES_PROXY_ADDR__", &addr);
            }
        }
        script = script.replace("__MYSQL_PROXY_TOKEN__", "");
        script = script.replace("__MYSQL_PROXY_ADDR__", "");
        script = script.replace("__POST_GRES_PROXY_TOKEN__", "");
        script = script.replace("__POST_GRES_PROXY_ADDR__", "");

        // 处理ssh proxy
        if net_perm.proxy_ssh {
            let res =
                start_sidecar_proxy(app_handle.clone(), request.label.clone(), "ssh", Vec::new())
                    .await;
            if res.is_err() {
                clear_by_close(app_handle.clone(), request.label.clone()).await;
                return Err(res.err().unwrap());
            }
            let (addr, token) = res.unwrap();
            script = script.replace("__SSH_PROXY_TOKEN__", &token);
            script = script.replace("__SSH_PROXY_ADDR__", &addr);
        } else {
            script = script.replace("__SSH_PROXY_TOKEN__", "");
            script = script.replace("__SSH_PROXY_ADDR__", "");
        }
        // 处理 net util
        if net_perm.net_util {
            let res = start_sidecar_proxy(
                app_handle.clone(),
                request.label.clone(),
                "netutil",
                Vec::new(),
            )
            .await;
            if res.is_err() {
                clear_by_close(app_handle.clone(), request.label.clone()).await;
                return Err(res.err().unwrap());
            }
            let (addr, token) = res.unwrap();
            script = script.replace("__NET_UTIL_TOKEN__", &token);
            script = script.replace("__NET_UTIL_ADDR__", &addr);
        } else {
            script = script.replace("__NET_UTIL_TOKEN__", "");
            script = script.replace("__NET_UTIL_ADDR__", "");
        }
    } else {
        script = script.replace("__CROSS_HTTP__", "false");
    }

    let res = start_store(app_handle.clone(), request.label.clone()).await;
    if res.is_err() {
        clear_by_close(app_handle.clone(), request.label.clone()).await;
        return Err(res.err().unwrap().to_string());
    }

    let pos = window.inner_position();
    if pos.is_err() {
        return Err(pos.err().unwrap().to_string());
    }
    let pos = pos.unwrap();

    let res = WindowBuilder::new(
        &app_handle,
        request.label.clone(),
        WindowUrl::External(open_url.unwrap()),
    )
    .title(request.title)
    .visible(true)
    .initialization_script(&script)
    .inner_size(800.0, 600.0)
    .position(pos.x as f64 + 100.0, pos.y as f64 + 100.0)
    .build();
    if res.is_err() {
        clear_by_close(app_handle.clone(), request.label.clone()).await;
        return Err(res.err().unwrap().to_string());
    }
    Ok(())
}

async fn start_sidecar_proxy<R: Runtime>(
    app_handle: AppHandle<R>,
    label: String,
    sidecar: &str,
    args: Vec<String>,
) -> Result<(String, String), String> {
    if &label == "main" {
        return Err("not allow".into());
    }
    let res = Command::new_sidecar(sidecar);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let res = res.unwrap();
    let res = res.args(args);
    let res = res.spawn();
    if res.is_err() {
        println!("{:?}", &res);
        return Err(res.err().unwrap().to_string());
    }
    let mut res = res.unwrap();
    let re = Regex::new(r"^listen=(.*),token=(.*)$").unwrap();
    let mut addr: String = "".into();
    let mut token: String = "".into();
    while let Some(ev) = res.0.recv().await {
        if let CommandEvent::Stdout(line) = ev {
            let line = line.trim();
            let cap = re.captures(line);
            if cap.is_none() {
                return Err("can't find token".into());
            }
            let cap = cap.unwrap();
            addr = (&cap[1]).to_string();
            token = (&cap[2]).to_string();
            break;
        }
    }
    if sidecar == "redis" {
        let proxy_map = app_handle.state::<RedisProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        proxy_map_data.insert(label, res.1);
    } else if sidecar == "mongo" {
        let proxy_map = app_handle.state::<MongoProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        proxy_map_data.insert(label, res.1);
    } else if sidecar == "sql" {
        let proxy_map = app_handle.state::<SqlProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        proxy_map_data.insert(label, res.1);
    } else if sidecar == "ssh" {
        let proxy_map = app_handle.state::<SshProxyMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        proxy_map_data.insert(label, res.1);
    } else if sidecar == "netutil" {
        let proxy_map = app_handle.state::<NetUtilMap>().inner();
        let mut proxy_map_data = proxy_map.0.lock().await;
        proxy_map_data.insert(label, res.1);
    }

    return Ok((addr, token));
}

#[tauri::command]
async fn pack_min_app<R: Runtime>(
    window: Window<R>,
    trace: String,
    path: String,
) -> Result<String, String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let app_tmp_dir = crate::get_tmp_dir();
    if app_tmp_dir.is_none() {
        return Err("no tmp dir".into());
    }
    let tmp_dir = mktemp::Temp::new_dir_in(app_tmp_dir.unwrap());
    if tmp_dir.is_err() {
        return Err(tmp_dir.err().unwrap().to_string());
    }
    let tmp_dir = tmp_dir.unwrap();
    let mut tmp_path = tmp_dir.release();
    tmp_path.push("content.zip");
    let tmp_file = File::create(&tmp_path).await;
    if tmp_file.is_err() {
        return Err(tmp_file.err().unwrap().to_string());
    }
    let mut tmp_file = tmp_file.unwrap();
    let mut writer = ZipFileWriter::new(&mut tmp_file);

    for entry in walkdir::WalkDir::new(&path) {
        let entry = entry.unwrap();
        if entry.file_type().is_dir() {
            continue;
        }
        let full_path = entry.path();
        let path_in_zip = full_path.strip_prefix(&path).unwrap();
        let zip_entry = ZipEntryBuilder::new(
            String::from(path_in_zip.to_str().unwrap()),
            Compression::Deflate,
        );
        let f = tokio::fs::File::open(full_path).await;
        if f.is_err() {
            return Err(f.err().unwrap().to_string());
        }
        let mut f = f.unwrap();
        let mut data: Vec<u8> = Vec::new();
        let read_res = f.read_to_end(&mut data).await;
        if read_res.is_err() {
            return Err(read_res.err().unwrap().to_string());
        }
        let write_res = writer.write_entry_whole(zip_entry, data.as_ref()).await;
        if write_res.is_err() {
            return Err(write_res.err().unwrap().to_string());
        }
        if &trace != "" {
            let res = window.emit(&trace, String::from(path_in_zip.to_str().unwrap()));
            if res.is_err() {
                println!("{}", res.err().unwrap());
            }
        }
    }
    let res = writer.close().await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    return Ok(String::from(tmp_path.to_str().unwrap()));
}

#[tauri::command]
async fn check_unpark<R: Runtime>(
    window: Window<R>,
    fs_id: String,
    file_id: String,
) -> Result<bool, String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let cache_dir = crate::get_cache_dir();
    if cache_dir.is_none() {
        return Err("no cache dir".into());
    }
    let mut cache_dir = std::path::PathBuf::from(cache_dir.unwrap());
    cache_dir.push(fs_id);
    cache_dir.push(file_id);
    cache_dir.push("content");

    if cache_dir.is_dir() {
        return Ok(true);
    }
    return Ok(false);
}

#[tauri::command]
async fn get_min_app_path<R: Runtime>(
    window: Window<R>,
    fs_id: String,
    file_id: String,
) -> Result<String, String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let cache_dir = crate::get_cache_dir();
    if cache_dir.is_none() {
        return Err("no cache dir".into());
    }
    let mut cache_dir = std::path::PathBuf::from(cache_dir.unwrap());
    cache_dir.push(fs_id);
    cache_dir.push(file_id);
    cache_dir.push("content");
    return Ok(String::from(cache_dir.to_str().unwrap()));
}

#[cfg(target_os = "windows")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("/", "\\");
}

#[cfg(target_os = "linux")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("\\", "/");
}

#[cfg(target_os = "macos")]
fn adjust_entry_path(name: String) -> String {
    return name.replace("\\", "/");
}

#[tauri::command]
async fn unpack_min_app<R: Runtime>(
    window: Window<R>,
    fs_id: String,
    file_id: String,
    trace: String,
) -> Result<(), String> {
    if window.label() != "main" {
        return Err("no permission".into());
    }
    let cache_dir = crate::get_cache_dir();
    if cache_dir.is_none() {
        return Err("no cache dir".into());
    }
    let mut cache_dir = std::path::PathBuf::from(cache_dir.unwrap());
    cache_dir.push(fs_id);
    cache_dir.push(file_id);
    let mut src_file = cache_dir.clone();
    src_file.push("content.zip");

    let mut out_path = cache_dir.clone();
    out_path.push("content");

    let src_file = File::open(&src_file).await;
    if src_file.is_err() {
        return Err(src_file.err().unwrap().to_string());
    }

    let mut src_file = src_file.unwrap();
    let reader = ZipFileReader::new(&mut src_file).await;
    if reader.is_err() {
        return Err(reader.err().unwrap().to_string());
    }
    let mut reader = reader.unwrap();
    let mut entry_list = Vec::new();
    for entry in reader.file().entries() {
        entry_list.push(entry.entry().clone());
    }

    for index in 0..entry_list.len() {
        let entry = entry_list.get(index).unwrap();
        let entry_filename = adjust_entry_path(String::from(entry.filename()));
        let dest_path = out_path.join(entry_filename);
        if entry.dir() {
            let res = tokio::fs::create_dir_all(&dest_path).await;
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
        } else {
            if let Some(parent) = dest_path.parent() {
                let res = tokio::fs::create_dir_all(&parent).await;
                if res.is_err() {
                    return Err(res.err().unwrap().to_string());
                }
            }

            let entry_reader = reader.entry(index).await;
            if entry_reader.is_err() {
                return Err(entry_reader.err().unwrap().to_string());
            }
            let mut entry_reader = entry_reader.unwrap();
            let writer = tokio::fs::OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(&dest_path)
                .await;
            if writer.is_err() {
                return Err(writer.err().unwrap().to_string());
            }
            let mut writer = writer.unwrap();
            let res = tokio::io::copy(&mut entry_reader, &mut writer).await;
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
        }
        if &trace != "" {
            let res = window.emit(&trace, String::from(entry.filename()));
            if res.is_err() {
                println!("{}", res.err().unwrap());
            }
        }
    }
    return Ok(());
}

pub async fn get_min_app_perm<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
) -> Option<AppPerm> {
    let label = window.label();
    if label.starts_with("minApp:") == false {
        return None;
    }
    let app_perm_map = app_handle.state::<AppPermMap>().inner();
    let app_perm_map = app_perm_map.0.lock().await;
    let perm = app_perm_map.get(label).clone();
    if perm.is_none() {
        return None;
    }
    let perm = perm.unwrap().clone();
    return Some(perm);
}

pub struct MinAppPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> MinAppPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                start,
                pack_min_app,
                check_unpark,
                get_min_app_path,
                unpack_min_app
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for MinAppPlugin<R> {
    fn name(&self) -> &'static str {
        "min_app"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(AppPermMap(Default::default()));
        app.manage(HttpServerMap(Default::default()));
        app.manage(RedisProxyMap(Default::default()));
        app.manage(MongoProxyMap(Default::default()));
        app.manage(SqlProxyMap(Default::default()));
        app.manage(SshProxyMap(Default::default()));
        app.manage(NetUtilMap(Default::default()));
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
