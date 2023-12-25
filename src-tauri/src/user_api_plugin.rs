use crate::net_proxy_api_plugin::stop_all_listen;
use crate::notice_decode::{decode_notice, new_wrong_session_notice};
use image::EncodableLayout;
use libaes::Cipher;
use prost::Message;
use proto_gen_rust::google::protobuf::Any;
use proto_gen_rust::user_api::user_api_client::UserApiClient;
use proto_gen_rust::user_api::*;
use rand::{thread_rng, Rng};
use rumqttc::AsyncClient as MqttClient;
use rumqttc::{MqttOptions, QoS};
use std::time::Duration;
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::time::sleep;
use url::Url;
use uuid::Uuid;

//不要修改这个常量
const UNLOGIN_USER_TOKEN: &'static str = "VAVPiHGWL6idGXkQ14p9ilvwCoqEQxHw";

#[derive(Default)]
pub struct CurSession(pub Mutex<Option<String>>);

#[derive(Default)]
pub struct CurUserId(pub Mutex<Option<String>>);

#[derive(Default)]
pub struct CurUserSecret(pub Mutex<Option<String>>);

#[derive(Default)]
struct CurNoticeClient(Mutex<Option<MqttClient>>);

#[tauri::command]
async fn gen_captcha<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: GenCaptchaRequest,
) -> Result<GenCaptchaResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.gen_captcha(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn pre_register<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: PreRegisterRequest,
) -> Result<PreRegisterResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.pre_register(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn register<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: RegisterRequest,
) -> Result<RegisterResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.register(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

async fn keep_alive<R: Runtime>(app_handle: &AppHandle<R>) {
    let handle = app_handle.clone();
    tauri::async_runtime::spawn(async move {
        loop {
            sleep(Duration::from_secs(30)).await;
            let mut session_id = String::from("");
            {
                let cur_value = handle.state::<CurSession>().inner();
                let cur_session = cur_value.0.lock().await;
                if let Some(cur_session_id) = cur_session.clone() {
                    session_id = cur_session_id;
                }
            }
            if session_id != "" {
                if let Some(chan) = super::get_grpc_chan(&handle).await {
                    let mut client = UserApiClient::new(chan);
                    let resp = client
                        .keep_alive(KeepAliveRequest {
                            session_id: session_id,
                        })
                        .await;
                    if let Err(err) = resp {
                        println!("err {}", err);
                    } else {
                        if resp.unwrap().into_inner().code != keep_alive_response::Code::Ok as i32 {
                            let window = (&handle).get_window("main").unwrap();
                            let res = window
                                .emit("notice", new_wrong_session_notice("keep_alive".into()));
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                    }
                }
            }
        }
    });
}

#[tauri::command]
async fn login<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: LoginRequest,
) -> Result<LoginResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    let app_for_float = app_handle.clone();
    match client.login(request).await {
        Ok(response) => {
            let ret = response.into_inner();
            let sess = app_handle.state::<CurSession>().inner();
            *sess.0.lock().await = Some(ret.session_id.clone());
            let user_info = ret.user_info.clone();
            if let Some(user_info) = user_info {
                let user_id = app_handle.state::<CurUserId>().inner();
                *user_id.0.lock().await = Some(user_info.user_id);
                let user_secret = app_handle.state::<CurUserSecret>().inner();
                *user_secret.0.lock().await = Some(ret.user_secret.clone());
            }

            let mq_client = (&app_handle).state::<CurNoticeClient>().inner();
            if let Some(c) = mq_client.0.lock().await.clone() {
                if let Err(err) = c.disconnect().await {
                    println!("{:?}", err);
                }
            }
            let notice_key = ret.notice_key.clone();
            if let Ok(url) = Url::parse(ret.notice_url.clone().as_str()) {
                tauri::async_runtime::spawn(async move {
                    let topic = format!(
                        "{notice_key}/{channel}/",
                        notice_key = notice_key.trim_matches('/'),
                        channel = (&url).path().trim_matches('/')
                    );
                    let id = Uuid::new_v4().to_string();
                    let option = MqttOptions::new(
                        id,
                        (&url).host().unwrap().to_string(),
                        (&url).port().unwrap(),
                    );
                    loop {
                        let (client, mut eventloop) = MqttClient::new(option.clone(), 10);
                        let sub_res = client.subscribe(topic.clone(), QoS::AtLeastOnce).await;
                        if sub_res.is_ok() {
                            println!("sub {} success", topic);
                            let notice_client = (&app_handle).state::<CurNoticeClient>().inner();
                            *notice_client.0.lock().await = Some(client);
                            loop {
                                let notice = eventloop.poll().await;
                                if notice.is_err() {
                                    println!("disconnect mqtt,error {:?}", notice.err().unwrap());
                                    break;
                                }
                                emit_notice(&window, notice.unwrap());
                            }
                        } else {
                            println!("{:?}", sub_res.err().unwrap());
                        }
                        let cur_value = (&app_handle).state::<CurSession>().inner();
                        let cur_session = cur_value.0.lock().await;
                        if cur_session.is_none() {
                            break;
                        }
                        sleep(Duration::from_secs(5)).await;
                    }
                });
            } else {
                println!("xxxxxxxxx");
            }
            //设置切换用户菜单
            let munu_item = app_for_float.tray_handle().get_item("switch_user");
            if let Err(err) = munu_item.set_enabled(true) {
                println!("{:?}", err);
            }
            Ok(ret)
        }
        Err(status) => Err(status.message().into()),
    }
}

fn emit_notice<R: Runtime>(window: &Window<R>, event: rumqttc::Event) {
    if let rumqttc::Event::Incoming(income_event) = event {
        if let rumqttc::Packet::Publish(pub_event) = income_event {
            if let Ok(any) = Any::decode(pub_event.payload) {
                if let Some(notice) = decode_notice(&any) {
                    let res = window.emit("notice", notice);
                    if res.is_err() {
                        println!("{:?}", res);
                    }
                }
            }
        }
    }
}

#[tauri::command]
async fn logout<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: LogoutRequest,
) -> Result<LogoutResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.logout(request).await {
        Ok(response) => {
            let sess = app_handle.state::<CurSession>().inner();
            *sess.0.lock().await = None;
            let user_id = app_handle.state::<CurUserId>().inner();
            *user_id.0.lock().await = None;
            let user_secret = app_handle.state::<CurUserSecret>().inner();
            *user_secret.0.lock().await = None;

            let mq_client = (&app_handle).state::<CurNoticeClient>().inner();
            if let Some(c) = mq_client.0.lock().await.clone() {
                c.disconnect().await.unwrap();
            }
            *mq_client.0.lock().await = None;
            //关闭main以外的所有窗口
            let win_map = app_handle.windows();
            for win in win_map.values() {
                if win.label() != "main" {
                    if let Err(err) = win.close() {
                        println!("{:?}", err);
                    }
                }
            }
            //设置切换用户菜单
            let switch_munu_item = &app_handle.tray_handle().get_item("switch_user");
            if let Err(err) = switch_munu_item.set_enabled(false) {
                println!("{:?}", err);
            }
            let admin_menu_item = &app_handle.tray_handle().get_item("admin");
            if let Err(err) = admin_menu_item.set_enabled(false) {
                println!("{:?}", err);
            }
            //移除本地监听
            stop_all_listen(app_handle).await;
            Ok(response.into_inner())
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: UpdateRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.update(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn change_passwd<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ChangePasswdRequest,
) -> Result<ChangePasswdResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.change_passwd(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn pre_reset_password<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: PreResetPasswordRequest,
) -> Result<PreResetPasswordResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.pre_reset_password(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn reset_password<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: ResetPasswordRequest,
) -> Result<ResetPasswordResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.reset_password(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn check_session<R: Runtime>(
    app_handle: AppHandle<R>,
    _window: Window<R>,
    request: CheckSessionRequest,
) -> Result<CheckSessionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserApiClient::new(chan.unwrap());
    match client.check_session(request).await {
        Ok(response) => Ok(response.into_inner()),
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
pub async fn get_session<R: Runtime>(app_handle: AppHandle<R>) -> String {
    let cur_value = app_handle.state::<CurSession>().inner();
    let cur_session = cur_value.0.lock().await;
    if let Some(cur_session) = cur_session.clone() {
        return cur_session;
    }
    return "".into();
}

pub async fn get_session_inner(app_handle: &AppHandle) -> String {
    let cur_value = app_handle.state::<CurSession>().inner();
    let cur_session = cur_value.0.lock().await;
    if let Some(cur_session) = cur_session.clone() {
        return cur_session;
    }
    return "".into();
}

#[tauri::command]
pub async fn get_user_id<R: Runtime>(app_handle: AppHandle<R>) -> String {
    let cur_value = app_handle.state::<CurUserId>().inner();
    let cur_user_id = cur_value.0.lock().await;
    if let Some(cur_user_id) = cur_user_id.clone() {
        return cur_user_id;
    }
    return "".into();
}

async fn get_user_secret<R: Runtime>(app_handle: AppHandle<R>) -> String {
    let cur_value = app_handle.state::<CurUserSecret>().inner();
    let cur_user_secret = cur_value.0.lock().await;
    if let Some(cur_user_secret) = cur_user_secret.clone() {
        return cur_user_secret;
    }
    return "".into();
}

pub async fn encrypt<R: Runtime>(
    app_handle: AppHandle<R>,
    data: Vec<u8>,
    default_secret: bool,
) -> Result<Vec<u8>, String> {
    let mut secret = get_user_secret(app_handle).await;
    if &secret == "" || default_secret {
        secret = String::from(UNLOGIN_USER_TOKEN);
    }
    let mut new_secret = [0 as u8; 32];
    new_secret[..32].copy_from_slice(secret.as_bytes());

    let mut iv: [u8; 16] = [0; 16];
    let mut rng = thread_rng();
    let res = rng.try_fill(&mut iv);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let cipher = Cipher::new_256(&new_secret);
    let encrypted = cipher.cbc_encrypt(&iv, data.as_bytes());
    let mut result = Vec::from(iv);
    result.extend(encrypted);
    return Ok(result);
}

pub async fn decrypt<R: Runtime>(
    app_handle: AppHandle<R>,
    data: Vec<u8>,
    default_secret: bool,
) -> Result<Vec<u8>, String> {
    let mut secret = get_user_secret(app_handle).await;
    if &secret == "" || default_secret {
        secret = String::from(UNLOGIN_USER_TOKEN);
    }
    let mut new_secret = [0 as u8; 32];
    new_secret[..32].copy_from_slice(secret.as_bytes());

    if data.len() < 16 {
        return Err("miss iv".into());
    }
    let (iv, data) = data.split_at(16);
    let cipher = Cipher::new_256(&new_secret);
    let decrypted = cipher.cbc_decrypt(iv, data);
    return Ok(decrypted);
}

pub async fn get_user_id_inner(app_handle: &AppHandle) -> String {
    let cur_value = app_handle.state::<CurUserId>().inner();
    let cur_user_id = cur_value.0.lock().await;
    if let Some(cur_user_id) = cur_user_id.clone() {
        return cur_user_id;
    }
    return "".into();
}

pub struct UserApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> UserApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                gen_captcha,
                pre_register,
                register,
                login,
                logout,
                update,
                change_passwd,
                pre_reset_password,
                reset_password,
                check_session,
                get_session,
                get_user_id,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for UserApiPlugin<R> {
    fn name(&self) -> &'static str {
        "user_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(CurSession(Default::default()));
        app.manage(CurUserId(Default::default()));
        app.manage(CurUserSecret(Default::default()));
        app.manage(CurNoticeClient(Default::default()));
        tauri::async_runtime::block_on(async {
            keep_alive(app).await;
        });
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
