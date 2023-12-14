use crate::notice_decode::new_wrong_session_notice;
use proto_gen_rust::project_board_api::project_board_api_client::ProjectBoardApiClient;
use proto_gen_rust::project_board_api::*;
use tauri::{
    plugin::{Plugin, Result as PluginResult},
    AppHandle, Invoke, PageLoadPayload, Runtime, Window,
};

#[tauri::command]
async fn create_node<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateNodeRequest,
) -> Result<CreateNodeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.create_node(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_node_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_node".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_node_position<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateNodePositionRequest,
) -> Result<UpdateNodePositionResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.update_node_position(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_node_position_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_node_position".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_node_size<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateNodeSizeRequest,
) -> Result<UpdateNodeSizeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.update_node_size(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_node_size_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_node_size".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_node_bg_color<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateNodeBgColorRequest,
) -> Result<UpdateNodeBgColorResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.update_node_bg_color(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_node_bg_color_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_node_bg_color".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn start_update_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: StartUpdateContentRequest,
) -> Result<StartUpdateContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.start_update_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == start_update_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("start_update_content".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn keep_update_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: KeepUpdateContentRequest,
) -> Result<KeepUpdateContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.keep_update_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == keep_update_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("keep_update_content".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn end_update_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: EndUpdateContentRequest,
) -> Result<EndUpdateContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client: ProjectBoardApiClient<tonic::transport::Channel> = ProjectBoardApiClient::new(chan.unwrap());
    match client.end_update_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == end_update_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("end_update_content".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_content<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateContentRequest,
) -> Result<UpdateContentResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.update_content(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_content_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_content".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_node<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveNodeRequest,
) -> Result<RemoveNodeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.remove_node(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_node_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_node".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_node<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListNodeRequest,
) -> Result<ListNodeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.list_node(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_node_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_node".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_node<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetNodeRequest,
) -> Result<GetNodeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.get_node(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_node_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_node".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn create_edge<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: CreateEdgeRequest,
) -> Result<CreateEdgeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.create_edge(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == create_edge_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("create_edge".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_edge<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveEdgeRequest,
) -> Result<RemoveEdgeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.remove_edge(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_edge_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_edge".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn update_edge<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: UpdateEdgeRequest,
) -> Result<UpdateEdgeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.update_edge(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == update_edge_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("update_edge".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn list_edge<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: ListEdgeRequest,
) -> Result<ListEdgeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.list_edge(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == list_edge_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("list_edge".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn get_edge<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: GetEdgeRequest,
) -> Result<GetEdgeResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.get_edge(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == get_edge_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("get_edge".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

#[tauri::command]
async fn remove_board<R: Runtime>(
    app_handle: AppHandle<R>,
    window: Window<R>,
    request: RemoveBoardRequest,
) -> Result<RemoveBoardResponse, String> {
    let chan = super::get_grpc_chan(&app_handle).await;
    if (&chan).is_none() {
        return Err("no grpc conn".into());
    }
    let mut client = ProjectBoardApiClient::new(chan.unwrap());
    match client.remove_board(request).await {
        Ok(response) => {
            let inner_resp = response.into_inner();
            if inner_resp.code == remove_board_response::Code::WrongSession as i32 {
                if let Err(err) = window.emit("notice", new_wrong_session_notice("remove_board".into())) {
                    println!("{:?}", err);
                }
            }
            return Ok(inner_resp);
        }
        Err(status) => Err(status.message().into()),
    }
}

pub struct ProjectBoardApiPlugin<R: Runtime> {
    invoke_handler: Box<dyn Fn(Invoke<R>) + Send + Sync + 'static>,
}

impl<R: Runtime> ProjectBoardApiPlugin<R> {
    pub fn new() -> Self {
        Self {
            invoke_handler: Box::new(tauri::generate_handler![
                create_node,
                update_node_position,
                update_node_size,
                update_node_bg_color,
                start_update_content,
                keep_update_content,
                end_update_content,
                update_content,
                remove_node,
                list_node,
                get_node,
                create_edge,
                remove_edge,
                update_edge,
                list_edge,
                get_edge,
                remove_board,
            ]),
        }
    }
}

impl<R: Runtime> Plugin<R> for ProjectBoardApiPlugin<R> {
    fn name(&self) -> &'static str {
        "project_board_api"
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
