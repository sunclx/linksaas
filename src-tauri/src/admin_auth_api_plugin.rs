use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::admin_auth_api::admin_auth_api_client::AdminAuthApiClient;
use proto_gen_rust::admin_auth_api::*;
use signature::Signer;
use ssh_key::PrivateKey;
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;
use tokio::io::AsyncReadExt;

#[derive(Default)]
pub struct CurAdminSession(pub Mutex<Option<String>>);

#[derive(Default)]
pub struct CurAdminPermInfo(pub Mutex<Option<AdminPermInfo>>);

#[tauri::command]
async fn pre_auth<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: PreAuthRequest,
) -> Result<PreAuthResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = AdminAuthApiClient::new(chan.unwrap());
    match client.pre_auth(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn auth<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: AuthRequest,
) -> Result<AuthResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let admin_session_id = request.admin_session_id.clone();
    let mut client = AdminAuthApiClient::new(chan.unwrap());
    match client.auth(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == auth_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("auth".into())) {
                    println!("{:?}", err);
                }
            }
            let sess = app_handle.state::<CurAdminSession>().inner();
            *sess.0.lock().await = Some(admin_session_id);
            let ret_perm = inner_resp.admin_perm_info.clone();
            let perm = app_handle.state::<CurAdminPermInfo>().inner();
            *perm.0.lock().await = ret_perm;

            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub async fn logout<R: Runtime>(app_handle: AppHandle<R>) {
    let sess = app_handle.state::<CurAdminSession>().inner();
    *sess.0.lock().await = None;
    let perm = app_handle.state::<CurAdminPermInfo>().inner();
    *perm.0.lock().await = None;
}

#[tauri::command]
async fn get_admin_session<R: Runtime>(app_handle: AppHandle<R>) -> String {
    let cur_value = app_handle.state::<CurAdminSession>().inner();
    let cur_session = cur_value.0.lock().await;
    if let Some(cur_session) = cur_session.clone() {
        return cur_session;
    }
    return "".into();
}

#[tauri::command]
async fn get_admin_perm<R: Runtime>(app_handle: AppHandle<R>) -> Option<AdminPermInfo> {
    let cur_value = app_handle.state::<CurAdminPermInfo>().inner();
    let cur_perm = cur_value.0.lock().await;
    return cur_perm.clone();
}

#[tauri::command]
async fn sign(private_key_file: String, to_sign_str: String) -> Result<Signature, String> {
    let f = fs::File::open(private_key_file).await;
    if f.is_err() {
        return Err(f.err().unwrap().to_string());
    }
    let mut f = f.unwrap();
    let mut private_key_data = Vec::new();
    let res = f.read_to_end(&mut private_key_data).await;
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let private_key = PrivateKey::from_openssh(private_key_data);
    if private_key.is_err() {
        return Err(private_key.err().unwrap().to_string());
    }
    let private_key = private_key.unwrap();
    let sign_res = private_key.try_sign(to_sign_str.as_bytes());
    if sign_res.is_err() {
        return Err(sign_res.err().unwrap().to_string());
    }
    let sign_res = sign_res.unwrap();
    return Ok(Signature {
        format: sign_res.algorithm().to_string(),
        blob: Vec::from(sign_res.as_bytes()),
        rest: Vec::new(),
    });
}

pub struct AdminAuthApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> AdminAuthApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                pre_auth,
                auth,
                sign,
                get_admin_session,
                get_admin_perm,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for AdminAuthApiPlugin<R> {
    fn name(&self) -> &'static str {
        "admin_auth_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(CurAdminSession(Default::default()));
        app.manage(CurAdminPermInfo(Default::default()));
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}

#[cfg(test)]
mod tests {
    use signature::Signer;
    use ssh_key::PrivateKey;
    use std::fs;

    #[test]
    fn test_sign() {
        let home_dir = dirs::home_dir().unwrap();
        let key_path = format!("{}/.ssh/id_rsa", home_dir.to_str().unwrap());
        let key_content = fs::read(key_path).unwrap();
        let private_key = PrivateKey::from_openssh(key_content).unwrap();

        let msg = "hello world".as_bytes();
        let sign = private_key.try_sign(msg).unwrap();
        let blob = Vec::from(sign.as_bytes());
        println!("{} {:?}", sign.algorithm().to_string(), blob);
    }
}
