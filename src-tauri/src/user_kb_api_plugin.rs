use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::user_kb_api::user_kb_api_client::UserKbApiClient;
use proto_gen_rust::user_kb_api::*;
use rsa::{BigUint, PublicKey as PubKey, RsaPrivateKey, RsaPublicKey};
use ssh_key::private::KeypairData;
use ssh_key::public::KeyData;
use ssh_key::{PrivateKey, PublicKey};
use tauri::async_runtime::Mutex;
use tauri::Manager;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use tokio::fs;

#[derive(Default)]
pub struct CurPrivateKey(pub Mutex<Option<RsaPrivateKey>>);

#[tauri::command]
async fn create_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateSpaceRequest,
) -> Result<CreateSpaceResponse, String> {
    let mut new_request = request.clone();
    if request.kb_space_type == KbSpaceType::KbSpaceSecure as i32 {
        let pub_key_str = fs::read_to_string(request.ssh_pub_key).await;
        if pub_key_str.is_err() {
            return Err(pub_key_str.err().unwrap().to_string());
        }
        let pub_key_str = pub_key_str.unwrap();
        let pub_key = PublicKey::from_openssh(&pub_key_str);
        if pub_key.is_err() {
            return Err(pub_key.err().unwrap().to_string());
        }
        new_request.ssh_pub_key = pub_key_str;
    }

    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.create_space(new_request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_space_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_space".into()))
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
async fn update_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateSpaceRequest,
) -> Result<UpdateSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.update_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_space_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_space".into()))
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
async fn list_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSpaceRequest,
) -> Result<ListSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.list_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_space_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_space".into()))
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
async fn get_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetSpaceRequest,
) -> Result<GetSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.get_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_space_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("get_space".into()))
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
async fn remove_space<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveSpaceRequest,
) -> Result<RemoveSpaceResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.remove_space(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_space_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_space".into()))
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
async fn create_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateDocRequest,
) -> Result<CreateDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.create_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_doc_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("create_doc".into()))
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
async fn update_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateDocRequest,
) -> Result<UpdateDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.update_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_doc_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("update_doc".into()))
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
async fn list_doc_index<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListDocIndexRequest,
) -> Result<ListDocIndexResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.list_doc_index(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_doc_index_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("list_doc_index".into()))
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
async fn get_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetDocRequest,
) -> Result<GetDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.get_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_doc".into()))
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
async fn remove_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveDocRequest,
) -> Result<RemoveDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.remove_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_doc_response::Code::WrongSession as i32 {
                if let Err(err) =
                    window.emit("notice", new_wrong_session_notice("remove_doc".into()))
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
async fn move_doc<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: MoveDocRequest,
) -> Result<MoveDocResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = UserKbApiClient::new(chan.unwrap());
    match client.move_doc(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == move_doc_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("move_doc".into()))
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
async fn valid_ssh_key<R: Runtime>(
    app_handle: AppHandle<R>,
    pub_key_str: String,
    priv_key_file: String,
) -> Result<(), String> {
    //加载公钥
    let pub_key = PublicKey::from_openssh(&pub_key_str);
    if pub_key.is_err() {
        return Err(pub_key.err().unwrap().to_string());
    }
    let pub_key = pub_key.unwrap();
    //加载私钥
    let priv_key_data = fs::read(priv_key_file).await;
    if priv_key_data.is_err() {
        return Err(priv_key_data.err().unwrap().to_string());
    }
    let priv_key_data = priv_key_data.unwrap();
    let priv_key = PrivateKey::from_openssh(priv_key_data);
    if priv_key.is_err() {
        return Err(priv_key.err().unwrap().to_string());
    }
    let priv_key = priv_key.unwrap();
    //验证
    if priv_key.public_key().key_data() == pub_key.key_data() {
        if let KeypairData::Rsa(rsa_key) = priv_key.key_data().clone() {
            let n = BigUint::from_bytes_be(rsa_key.public.n.as_bytes());
            let e = BigUint::from_bytes_be(rsa_key.public.e.as_bytes());
            let d = BigUint::from_bytes_be(rsa_key.private.d.as_bytes());
            let p = BigUint::from_bytes_be(rsa_key.private.p.as_bytes());
            let q = BigUint::from_bytes_be(rsa_key.private.q.as_bytes());
            let priv_key = RsaPrivateKey::from_components(n, e, d, vec![p, q]);
            if priv_key.is_err() {
                return Err(priv_key.err().unwrap().to_string());
            }
            let priv_key = priv_key.unwrap();
            let key = app_handle.state::<CurPrivateKey>().inner();
            *key.0.lock().await = Some(priv_key);
        } else {
            return Err("only support rsa".into());
        }

        return Ok(());
    } else {
        return Err("wrong private key".into());
    }
}

#[tauri::command]
async fn encrypt(key: String, content: String) -> Result<String, String> {
    let pub_key = PublicKey::from_openssh(&key);
    if pub_key.is_err() {
        return Err(pub_key.err().unwrap().to_string());
    }
    let pub_key = pub_key.unwrap();
    let pub_key = pub_key.key_data().clone();
    match pub_key {
        KeyData::Rsa(rsa_key) => {
            let e = BigUint::from_bytes_be(rsa_key.e.as_bytes());
            let n = BigUint::from_bytes_be(rsa_key.n.as_bytes());
            let pub_key = RsaPublicKey::new(n, e);
            if pub_key.is_err() {
                return Err(pub_key.err().unwrap().to_string());
            }
            let pub_key = pub_key.unwrap();
            let mut rng = rand::thread_rng();
            let res = pub_key.encrypt(&mut rng, rsa::Pkcs1v15Encrypt, content.as_ref());
            if res.is_err() {
                return Err(res.err().unwrap().to_string());
            }
            let res = res.unwrap();
            return Ok(base64::encode(res));
        }
        _ => {
            return Err("not support".into());
        }
    }
}

#[tauri::command]
async fn decrypt<R: Runtime>(app_handle: AppHandle<R>, content: String) -> Result<String, String> {
    let priv_key = app_handle.state::<CurPrivateKey>().inner();
    let priv_key = priv_key.0.lock().await;
    let priv_key = priv_key.clone();
    if priv_key.is_none() {
        return Err("miss privite key".into());
    }
    let priv_key = priv_key.unwrap();

    let res = base64::decode(content);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let res = res.unwrap();

    let res = priv_key.decrypt(rsa::Pkcs1v15Encrypt, &res);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    let res = res.unwrap();
    let res = String::from_utf8(res);
    if res.is_err() {
        return Err(res.err().unwrap().to_string());
    }
    return Ok(res.unwrap());
}

pub struct UserKbApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> UserKbApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_space,
                update_space,
                list_space,
                get_space,
                remove_space,
                create_doc,
                update_doc,
                list_doc_index,
                get_doc,
                remove_doc,
                move_doc,
                valid_ssh_key,
                encrypt,
                decrypt,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for UserKbApiPlugin<R> {
    fn name(&self) -> &'static str {
        "user_kb_api"
    }
    fn initialization_script(&self) -> Option<String> {
        None
    }

    fn initialize(&mut self, app: &AppHandle<R>, _config: serde_json::Value) -> PluginResult<()> {
        app.manage(CurPrivateKey(Default::default()));
        Ok(())
    }

    fn created(&mut self, _window: Window<R>) {}

    fn on_page_load(&mut self, _window: Window<R>, _payload: PageLoadPayload) {}

    fn extend_api(&mut self, message: Invoke<R>) {
        (self.invoke_handler)(message)
    }
}
