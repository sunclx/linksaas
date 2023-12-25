use proto_gen_rust::client_cfg_api::client_cfg_api_client::ClientCfgApiClient;
use proto_gen_rust::client_cfg_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tokio::fs;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;

const DEFAULT_GRPC_SERVER_ADDR: &str = "http://serv.linksaas.pro:5000";

#[derive(Default)]
pub struct GlobalServerAddr(pub Mutex<String>);

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct ServerInfo {
    pub name: String,
    pub system: bool,
    pub addr: String,
    pub default_server: bool,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct ListServerResult {
    pub server_list: Vec<ServerInfo>,
}

#[tauri::command]
async fn get_cfg<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GetCfgRequest,
) -> Result<GetCfgResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ClientCfgApiClient::new(chan.unwrap());
    match client.get_cfg(request).await {
        Ok(response) => {
            let response = response.into_inner();
            if response.enable_admin {
                let admin_menu_item = &app_handle.tray_handle().get_item("admin");
                if let Err(err) = admin_menu_item.set_enabled(true) {
                    println!("{:?}", err);
                }
            }
            return Ok(response);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn add_server(addr: String) {
    let mut result = list_server(true).await;
    result.server_list.push(ServerInfo {
        name: addr.clone(),
        system: false,
        addr: addr,
        default_server: false,
    });

    if let Ok(json_str) = serde_json::to_string(&(result.server_list)) {
        if let Some(cfg_path) = get_server_cfg().await {
            if let Ok(mut f) = fs::File::create(cfg_path).await {
                if let Err(err) = f.write_all(json_str.as_bytes()).await {
                    println!("{}", err);
                }
            }
        }
    }
}

#[tauri::command]
async fn remove_server(addr: String) {
    let result = list_server(true).await;
    let mut server_list: Vec<ServerInfo> = Vec::new();

    for info in &(result.server_list) {
        if info.addr != addr {
            server_list.push(info.clone());
        }
    }

    if let Ok(json_str) = serde_json::to_string(&server_list) {
        if let Some(cfg_path) = get_server_cfg().await {
            if let Ok(mut f) = fs::File::create(cfg_path).await {
                if let Err(err) = f.write_all(json_str.as_bytes()).await {
                    println!("{}", err);
                }
            }
        }
    }
}

#[tauri::command]
async fn set_default_server(addr: String) {
    let result = list_server(true).await;
    let mut server_list: Vec<ServerInfo> = Vec::new();

    for info in &(result.server_list) {
        server_list.push(ServerInfo {
            name: info.name.clone(),
            system: false,
            addr: info.addr.clone(),
            default_server: info.addr == addr,
        });
    }

    if let Ok(json_str) = serde_json::to_string(&(server_list)) {
        if let Some(cfg_path) = get_server_cfg().await {
            if let Ok(mut f) = fs::File::create(cfg_path).await {
                if let Err(err) = f.write_all(json_str.as_bytes()).await {
                    println!("{}", err);
                }
            }
        }
    }
}

#[tauri::command]
async fn list_server(skip_system: bool) -> ListServerResult {
    let mut result = ListServerResult {
        server_list: Vec::new(),
    };
    if !skip_system {
        result.server_list.push(ServerInfo {
            name: "默认".into(),
            system: true,
            addr: "serv.linksaas.pro".into(),
            default_server: false,
        });
    }
    //读取配置文件
    if let Some(cfg_path) = get_server_cfg().await {
        if let Ok(mut f) = fs::File::open(cfg_path).await {
            let mut data: Vec<u8> = Vec::new();
            if let Ok(_) = f.read_to_end(&mut data).await {
                if let Ok(json_str) = String::from_utf8(data) {
                    let server_list: Result<Vec<ServerInfo>, serde_json::Error> =
                        serde_json::from_str(&json_str);
                    if server_list.is_ok() {
                        for info in server_list.unwrap() {
                            result.server_list.push(info);
                        }
                    }
                }
            }
        }
    }
    if !skip_system {
        let mut has_default = false;
        for info in &(result.server_list) {
            if info.default_server {
                has_default = true;
            }
        }
        if !has_default {
            result.server_list[0].default_server = true;
        }
    }
    return result;
}

async fn get_server_cfg() -> Option<String> {
    if let Some(base_dir) = crate::get_base_dir() {
        return Some(format!("{}/server.json", base_dir));
    }
    None
}

#[tauri::command]
pub async fn get_global_server_addr<R: Runtime>(app_handle: AppHandle<R>) -> String {
    let cur_value = app_handle.state::<GlobalServerAddr>().inner();
    let result = cur_value.0.lock().await;
    let result = result.clone() ;
    if &result == "" {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    return result;
}

async fn load_global_server_addr() -> String {
    let user_dir = crate::get_user_dir();
    if user_dir.is_none() {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    let mut file_path = std::path::PathBuf::from(user_dir.unwrap());
    file_path.push("global_server.json");
    if !file_path.exists() {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    let f = fs::File::open(file_path).await;
    if f.is_err() {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    let mut f = f.unwrap();
    let mut data = Vec::new();
    let result = f.read_to_end(&mut data).await;
    if result.is_err() {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    let result = String::from_utf8(data);
    if result.is_err() {
        return String::from(DEFAULT_GRPC_SERVER_ADDR);
    }
    return result.unwrap();
}

pub struct ClientCfgApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ClientCfgApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                get_cfg,
                add_server,
                remove_server,
                set_default_server,
                list_server,
                get_global_server_addr,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ClientCfgApiPlugin<R> {
    fn name(&self) -> &'static str {
        "client_cfg_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(GlobalServerAddr(Default::default()));
        tauri::async_runtime::block_on(async {
            let addr = load_global_server_addr().await;
            let global_addr = app.state::<GlobalServerAddr>().inner();
            *global_addr.0.lock().await = addr;
        });
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
