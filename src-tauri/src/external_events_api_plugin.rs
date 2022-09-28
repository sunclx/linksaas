use proto_gen_rust::external_events_api::external_events_api_client::ExternalEventsApiClient;
use proto_gen_rust::external_events_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};
use crate::notice_decode::new_wrong_session_notice;


#[tauri::command]
async fn gen_id_and_secret<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GenIdAndSecretRequest,
) -> Result<GenIdAndSecretResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.gen_id_and_secret(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == gen_id_and_secret_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("gen_id_and_secret".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateRequest,
) -> Result<CreateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.create(request).await {
        Ok(response) =>  {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateRequest,
) -> Result<UpdateResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.update(request).await {
        Ok(response) =>  {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListRequest,
) -> Result<ListResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.list(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetRequest,
) -> Result<GetResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.get(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_secret<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetSecretRequest,
) -> Result<GetSecretResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.get_secret(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_secret_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_secret".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveRequest,
) -> Result<RemoveResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.remove(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_source_user<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListSourceUserRequest,
) -> Result<ListSourceUserResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.list_source_user(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_source_user_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_source_user".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn set_source_user_policy<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: SetSourceUserPolicyRequest,
) -> Result<SetSourceUserPolicyResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ExternalEventsApiClient::new(chan.unwrap());
    match client.set_source_user_policy(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == set_source_user_policy_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("set_source_user_policy".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        },
        Err(status) => Err(status.message().into()),
    }
}

pub struct ExternalEventsApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ExternalEventsApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                gen_id_and_secret,
                create,
                update,
                list,
                get,
                get_secret,
                remove,
                list_source_user,
                set_source_user_policy,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ExternalEventsApiPlugin<R> {
    fn name(&self) -> &'static str {
        "external_events_api"
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
