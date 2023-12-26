use proto_gen_rust::net_proxy_api::net_proxy_api_client::NetProxyApiClient;
use proto_gen_rust::net_proxy_api::*;
use std::collections::HashMap;
use tauri::async_runtime::Mutex;
use tauri::{
    api::process::{Command, CommandChild, CommandEvent},
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, Manager, PageLoadPayload, Runtime, Window,
};
use crate::conn_extern_server;
use crate::notice_decode::new_local_proxy_stop_notice;

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub struct ProxyInfo {
    project_id: String,
    endpoint_name: String,
    port: u16,
}

pub struct ListenState {
    child: CommandChild,
    project_id: String,
    endpoint_name: String,
}

#[derive(Default)]
pub struct LocalPortMap(pub Mutex<HashMap<u16, ListenState>>);


#[tauri::command]
async fn list_end_point(
    serv_addr: String,
    request: ListEndPointRequest,
) -> Result<ListEndPointResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = NetProxyApiClient::new(chan.unwrap());
    match client.list_end_point(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_tunnel(
    serv_addr: String,
    request: CreateTunnelRequest,
) -> Result<CreateTunnelResponse, String> {
    let chan = conn_extern_server(serv_addr).await;
    if chan.is_err() {
        return Err(chan.err().unwrap());
    }
    let mut client = NetProxyApiClient::new(chan.unwrap());
    match client.create_tunnel(request).await {
        Ok(response) => {
            return Ok(response.into_inner());
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn start_listen<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    proxy_addr: String,
    tunnel_id: String,
    project_id: String,
    endpoint_name: String,
    port: u16,
) -> Result<(), String> {
    let port_str = format!("{}", port);
    let res = Command::new_sidecar("netproxy");
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let res = res.unwrap();
    println!("{} {} {}", &proxy_addr, &tunnel_id, &port_str);
    let res = res.args(vec![&proxy_addr, &tunnel_id, &port_str]);
    let res = res.spawn();
    if res.is_err() {
        println!("{:?}", &res);
        return Err(res.err().unwrap().to_string());
    }
    let (mut rcver, child) = res.unwrap();

    let new_app_handle = app_handle.clone();
    let local_map = app_handle.state::<LocalPortMap>().inner();
    let mut local_map_data = local_map.0.lock().await;
    if local_map_data.contains_key(&port) {
        if child.kill().is_err() {
            println!("kill proxy child error");
        }
        return Err("exist listen port".into());
    }
    local_map_data.insert(
        port,
        ListenState {
            child: child,
            project_id: project_id,
            endpoint_name: endpoint_name,
        },
    );
    tauri::async_runtime::spawn(async move {
        while let Some(ev) = rcver.recv().await {
            if let CommandEvent::Terminated(_) = ev {
                {
                    let local_map = new_app_handle.state::<LocalPortMap>().inner();
                    let mut local_map_data = local_map.0.lock().await;
                    local_map_data.remove(&port);
                }
                if let Err(err) = window.emit("notice", new_local_proxy_stop_notice()) {
                    println!("{:?}", err);
                }
                break;
            }
        }
    });
    Ok(())
}

#[tauri::command]
async fn stop_listen<R: Runtime>(app_handle: AppHandle<R>, port: u16) -> Result<(), String> {
    let local_map = app_handle.state::<LocalPortMap>().inner();
    let mut local_map_data = local_map.0.lock().await;
    let res = local_map_data.remove(&port);
    if res.is_some() {
        let _ = res.unwrap().child.kill(); //skip error
    }
    Ok(())
}

#[tauri::command]
async fn list_all_listen<R: Runtime>(app_handle: AppHandle<R>) -> Result<Vec<ProxyInfo>, String> {
    let local_map = app_handle.state::<LocalPortMap>().inner();
    let local_map_data = local_map.0.lock().await;
    let ports: Vec<&u16> = local_map_data.keys().collect();

    let mut ret_list = Vec::new();
    for port in ports {
        let res = local_map_data.get(port);
        if res.is_none() {
            continue;
        }
        let res = res.unwrap();
        ret_list.push(ProxyInfo {
            project_id: res.project_id.clone(),
            endpoint_name: res.endpoint_name.clone(),
            port: port.clone(),
        });
    }
    return Ok(ret_list);
}

pub async fn stop_all_listen<R: Runtime>(app_handle: AppHandle<R>) {
    let local_map = app_handle.state::<LocalPortMap>().inner();
    let mut local_map_data = local_map.0.lock().await;
    let ports: Vec<u16> = local_map_data.keys().copied().collect();
    for port in ports {
        let res = local_map_data.remove(&port);
        if res.is_some() {
            let _ = res.unwrap().child.kill(); //skip error
        }
    }
}

pub struct NetProxyApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> NetProxyApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                list_end_point,
                create_tunnel,
                start_listen,
                stop_listen,
                list_all_listen,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for NetProxyApiPlugin<R> {
    fn name(&self) -> &'static str {
        "net_proxy_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(LocalPortMap(Default::default()));

        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
