use crate::notice_decode::{
    decode_notice, earthly::Notice as EarthlyNotice, new_upload_snap_shot_notice,
    new_wrong_session_notice, robot::Notice as RobotNotice, script::Notice as ScriptNotice,
    NoticeMessage,
};
use prost::Message;
use proto_gen_rust::fs_api::{FileOwnerType, SetFileOwnerRequest};
use proto_gen_rust::google::protobuf::Any;
use proto_gen_rust::project_member_api::{
    get_work_snap_shot_status_response, GetWorkSnapShotStatusRequest, UploadWorkSnapShotRequest,
};
use proto_gen_rust::user_api::user_api_client::UserApiClient;
use proto_gen_rust::user_api::*;
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

#[derive(Default)]
pub struct CurSession(pub Mutex<Option<String>>);

#[derive(Default)]
pub struct CurUserId(pub Mutex<Option<String>>);

#[derive(Default)]
struct CurNoticeClient(Mutex<Option<MqttClient>>);

#[derive(Default)]
struct CurWorkSnapShotProject(Mutex<Option<String>>);

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

struct CheckSnapShotResult {
    pub need_snap_shot: bool,
    pub fs_id: String,
}

async fn check_need_snap_shot<R: Runtime>(
    app_handle: &AppHandle<R>,
    window: &Window<R>,
    session_id: String,
    project_id: String,
) -> CheckSnapShotResult {
    //检查是否需要做工作快照
    let last_snap_info_res = crate::project_member_api_plugin::get_work_snap_shot_status(
        app_handle.clone(),
        window.clone(),
        GetWorkSnapShotStatusRequest {
            session_id: session_id.clone(),
            project_id: project_id.clone(),
        },
    )
    .await;
    if last_snap_info_res.is_err() {
        println!("{:?}", last_snap_info_res.err().unwrap());
        return CheckSnapShotResult {
            need_snap_shot: false,
            fs_id: "".into(),
        };
    }
    let last_snap_info = last_snap_info_res.unwrap();
    if last_snap_info.code != get_work_snap_shot_status_response::Code::Ok as i32 {
        return CheckSnapShotResult {
            need_snap_shot: false,
            fs_id: "".into(),
        };
    }
    if last_snap_info.work_snap_shot_info.is_none() {
        return CheckSnapShotResult {
            need_snap_shot: false,
            fs_id: "".into(),
        };
    }
    let work_snap_config = last_snap_info.work_snap_shot_info.unwrap();
    // println!("work snap shot config:{:?}", work_snap_config.clone());
    if !work_snap_config.enable {
        return CheckSnapShotResult {
            need_snap_shot: false,
            fs_id: "".into(),
        };
    }

    let now = std::time::SystemTime::now();
    let now_timestamp = now.duration_since(std::time::UNIX_EPOCH).unwrap().as_secs();

    if now_timestamp - ((last_snap_info.last_time_stamp / 1000) as u64)
        < work_snap_config.interval as u64
    {
        println!(
            "time diff {} {}",
            now_timestamp - ((last_snap_info.last_time_stamp / 1000) as u64),
            work_snap_config.interval
        );
        return CheckSnapShotResult {
            need_snap_shot: false,
            fs_id: "".into(),
        };
    }
    return CheckSnapShotResult {
        need_snap_shot: true,
        fs_id: last_snap_info.fs_id,
    };
}

async fn exec_snap_shot<R: Runtime>(
    app_handle: &AppHandle<R>,
    window: &Window<R>,
    session_id: String,
    project_id: String,
    fs_id: String,
) {
    let img_list = crate::image_utils::capture_screen_data(true, 2.0);
    if img_list.is_err() {
        println!("{:?}", img_list.err().unwrap());
        return;
    }
    let img_list = img_list.unwrap();
    for img in img_list {
        //生成缩略图,200*150
        let thumbnial_img =
            image::imageops::resize(&img, 200, 150, image::imageops::FilterType::Nearest);
        let img_png = crate::image_utils::encode_to_png(img);
        if img_png.is_err() {
            println!("{:?}", img_png.err().unwrap());
            return;
        }
        let thumbnial_img_png = crate::image_utils::encode_to_png(thumbnial_img);
        if thumbnial_img_png.is_err() {
            println!("{:?}", thumbnial_img_png.err().unwrap());
            return;
        }
        //上传文件
        let img_res = crate::fs_api_plugin::write_file_data(
            app_handle.clone(),
            window.clone(),
            "".into(),
            session_id.clone(),
            fs_id.clone(),
            format!("{}.png", Uuid::new_v4().to_string()),
            img_png.unwrap(),
        )
        .await;
        if img_res.is_err() {
            println!("{:?}", img_res.err().unwrap());
            return;
        }
        let img_res = img_res.unwrap();
        let thumbnial_img_res = crate::fs_api_plugin::write_file_data(
            app_handle.clone(),
            window.clone(),
            "".into(),
            session_id.clone(),
            fs_id.clone(),
            format!("{}.png", Uuid::new_v4().to_string()),
            thumbnial_img_png.unwrap(),
        )
        .await;
        if thumbnial_img_res.is_err() {
            println!("{:?}", thumbnial_img_res.err().unwrap());
            return;
        }
        let thumbnial_img_res = thumbnial_img_res.unwrap();
        //设置文件owner
        if let Err(err) = crate::fs_api_plugin::set_file_owner(
            app_handle.clone(),
            window.clone(),
            SetFileOwnerRequest {
                session_id: session_id.clone(),
                fs_id: fs_id.clone(),
                file_id: img_res.clone().file_id,
                owner_type: FileOwnerType::WorkSnapshot as i32,
                owner_id: project_id.clone(),
            },
        )
        .await
        {
            println!("{}", err);
            return;
        }
        if let Err(err) = crate::fs_api_plugin::set_file_owner(
            app_handle.clone(),
            window.clone(),
            SetFileOwnerRequest {
                session_id: session_id.clone(),
                fs_id: fs_id.clone(),
                file_id: thumbnial_img_res.clone().file_id,
                owner_type: FileOwnerType::WorkSnapshot as i32,
                owner_id: project_id.clone(),
            },
        )
        .await
        {
            println!("{}", err);
            return;
        }
        //增加snap shot事件
        if let Err(upload_res) = crate::project_member_api_plugin::upload_work_snap_shot(
            app_handle.clone(),
            window.clone(),
            UploadWorkSnapShotRequest {
                session_id: session_id.clone(),
                project_id: project_id.clone(),
                fs_id: fs_id.clone(),
                file_id: img_res.file_id,
                thumb_file_id: thumbnial_img_res.file_id,
            },
        )
        .await
        {
            println!("{}", upload_res);
            return;
        }
        println!("upload snap shot success");
    }
    //发送notice
    let res = window.emit("notice", new_upload_snap_shot_notice(project_id.clone()));
    if res.is_err() {
        println!("{:?}", res);
    }
}

async fn run_work_snap_shot<R: Runtime>(app_handle: &AppHandle<R>) {
    let handle = app_handle.clone();
    tauri::async_runtime::spawn(async move {
        loop {
            let mut session_id = String::from("");
            {
                let cur_value = (&handle).state::<CurSession>().inner();
                let cur_session = cur_value.0.lock().await;
                if let Some(cur_session_id) = cur_session.clone() {
                    session_id = cur_session_id;
                }
            }
            if &session_id == "" {
                sleep(Duration::from_secs(60)).await;
                continue;
            }

            let cur_value = (&handle).state::<CurWorkSnapShotProject>().inner();
            let cur_snap_item = cur_value.0.lock().await;
            if let Some(cur_snap_item) = cur_snap_item.clone() {
                let window = handle.get_window("main").unwrap();
                let snap_shot_res = check_need_snap_shot(
                    &handle,
                    &window,
                    session_id.clone(),
                    cur_snap_item.clone(),
                )
                .await;
                if !(snap_shot_res.need_snap_shot) {
                    sleep(Duration::from_secs(60)).await;
                    continue;
                }
                exec_snap_shot(
                    &handle,
                    &window,
                    session_id.clone(),
                    cur_snap_item.clone(),
                    snap_shot_res.fs_id,
                )
                .await;
                sleep(Duration::from_secs(120)).await;
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
                    match notice {
                        NoticeMessage::RobotNotice(RobotNotice::RespMetricDataNotice(n)) => {
                            let m = n.clone();
                            let event_name = format!("metric_data_{}", m.req_id);
                            let res = window.emit(
                                &event_name,
                                NoticeMessage::RobotNotice(RobotNotice::RespMetricDataNotice(n)),
                            );
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                        NoticeMessage::EarthlyNotice(EarthlyNotice::ExecDataNotice(n)) => {
                            let m = n.clone();
                            let event_name = format!("exec_data_{}", m.exec_id);
                            let res = window.emit(
                                &event_name,
                                NoticeMessage::EarthlyNotice(EarthlyNotice::ExecDataNotice(n)),
                            );
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                        NoticeMessage::ScriptNotice(ScriptNotice::ExecDataNotice(n)) => {
                            let m = n.clone();
                            let event_name = format!("exec_data_{}", m.exec_id);
                            let res = window.emit(
                                &event_name,
                                NoticeMessage::ScriptNotice(ScriptNotice::ExecDataNotice(n)),
                            );
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                        NoticeMessage::EarthlyNotice(EarthlyNotice::ExecStateNotice(n)) => {
                            let m = n.clone();
                            let event_name = format!("exec_state_{}", m.exec_id);
                            let res = window.emit(
                                &event_name,
                                NoticeMessage::EarthlyNotice(EarthlyNotice::ExecStateNotice(n)),
                            );
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                        NoticeMessage::ScriptNotice(ScriptNotice::ExecStateNotice(n)) => {
                            let m = n.clone();
                            let event_name = format!("exec_state_{}", m.exec_id);
                            let res = window.emit(
                                &event_name,
                                NoticeMessage::ScriptNotice(ScriptNotice::ExecStateNotice(n)),
                            );
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
                        _ => {
                            let res = window.emit("notice", notice);
                            if res.is_err() {
                                println!("{:?}", res);
                            }
                        }
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
            let munu_item = &app_handle.tray_handle().get_item("switch_user");
            if let Err(err) = munu_item.set_enabled(false) {
                println!("{:?}", err);
            }
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

pub async fn get_user_id_inner(app_handle: &AppHandle) -> String {
    let cur_value = app_handle.state::<CurUserId>().inner();
    let cur_user_id = cur_value.0.lock().await;
    if let Some(cur_user_id) = cur_user_id.clone() {
        return cur_user_id;
    }
    return "".into();
}

#[tauri::command]
async fn set_cur_work_snapshot<R: Runtime>(app_handle: AppHandle<R>, project_id: String) {
    println!("set cur work snapshot for project {}", &project_id);
    let cur_value = app_handle.state::<CurWorkSnapShotProject>().inner();
    if (&project_id).is_empty() {
        *cur_value.0.lock().await = None;
    } else {
        *cur_value.0.lock().await = Some(project_id);
    }
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
                set_cur_work_snapshot,
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
        app.manage(CurNoticeClient(Default::default()));
        app.manage(CurWorkSnapShotProject(Default::default()));
        tauri::async_runtime::block_on(async {
            keep_alive(app).await;
            run_work_snap_shot(app).await;
        });
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
