use async_trait::async_trait;
use local_api_rust::server::MakeService;
use serde_json::json;
use std::marker::PhantomData;
use std::net::TcpListener;
use swagger::auth::MakeAllowAllAuthenticator;
use swagger::EmptyContext;
use swagger::{Has, XSpanIdString};
use tauri::{AppHandle, Manager};
use tokio::fs;
use tokio::io::AsyncWriteExt;

pub async fn run(app: AppHandle) {
    for port in 8001..8099 {
        let addr = format!("127.0.0.1:{}", port);
        let listener = TcpListener::bind(&addr);
        if listener.is_err() {
            continue;
        }
        let listener = listener.unwrap();

        let builder = hyper::server::Server::from_tcp(listener);
        if builder.is_err() {
            continue;
        }
        let serv_port = app.state::<ServPort>().inner();
        *serv_port.0.lock().await = Some(port as i16);

        //写入$HOME/.linksaas/local_api文件
        if let Some(home_dir) = dirs::home_dir() {
            let file_path = format!("{}/.linksaas/local_api", home_dir.to_str().unwrap());
            let file = fs::OpenOptions::new()
                .truncate(true)
                .create(true)
                .write(true)
                .open(file_path)
                .await;
            if file.is_ok() {
                let mut file = file.unwrap();
                if let Ok(_) = file.write_all(addr.as_bytes()).await {
                    //do nothing
                    if let Err(err) = file.flush().await {
                        println!("{}", err);
                    }
                }
            }
        }

        let server = Server {
            app: app.clone(),
            marker: PhantomData,
        };
        let service = MakeService::new(server);
        let service = MakeAllowAllAuthenticator::new(service, "cosmo");
        let service =
            local_api_rust::server::context::MakeAddContext::<_, EmptyContext>::new(service);

        builder.unwrap().serve(service).await.unwrap();
    }
}

#[derive(Clone)]
pub struct Server<C> {
    app: AppHandle,
    marker: PhantomData<C>,
}

use local_api_rust::models::ErrInfo;
use local_api_rust::{
    Api, HelloGetResponse, ProjectProjectIdBugAllGetResponse, ProjectProjectIdBugMyGetResponse,
    ProjectProjectIdBugRecordBugIdShowGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ProjectProjectIdDocSpaceGetResponse,
    ProjectProjectIdEventGetResponse, ProjectProjectIdTaskAllGetResponse,
    ProjectProjectIdTaskMyGetResponse, ProjectProjectIdTaskRecordTaskIdShowGetResponse,
    ShowGetResponse,
};
use swagger::ApiError;

use super::ServPort;

#[async_trait]
impl<C> Api<C> for Server<C>
where
    C: Has<XSpanIdString> + Send + Sync,
{
    /// 握手协议
    async fn hello_get(&self, _context: &C) -> Result<HelloGetResponse, ApiError> {
        Ok(HelloGetResponse::Status200 {
            body: "hello linksaas".into(),
            access_control_allow_origin: Some("*".into()),
        })
    }

    /// 显示软件桌面
    async fn show_get(&self, _context: &C) -> Result<ShowGetResponse, ApiError> {
        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("无法找到主窗口".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let win = win.unwrap();
        if let Err(err) = win.set_always_on_top(true) {
            println!("{}", err)
        }
        if let Err(err) = win.set_always_on_top(false) {
            println!("{}", err)
        }
        return Ok(ShowGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 所有缺陷
    async fn project_project_id_bug_all_get(
        &self,
        project_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdBugAllGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 指派给我的缺陷
    async fn project_project_id_bug_my_get(
        &self,
        project_id: String,
        access_token: String,
        state: String,
        context: &C,
    ) -> Result<ProjectProjectIdBugMyGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 显示缺陷
    async fn project_project_id_bug_record_bug_id_show_get(
        &self,
        project_id: String,
        bug_id: String,
        access_token: String,
        context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdShowGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 文档列表
    async fn project_project_id_doc_space_doc_space_id_doc_id_show_get(
        &self,
        project_id: String,
        doc_space_id: String,
        doc_id: String,
        access_token: String,
        context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 文档列表
    async fn project_project_id_doc_space_doc_space_id_get(
        &self,
        project_id: String,
        doc_space_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 文档空间列表
    async fn project_project_id_doc_space_get(
        &self,
        project_id: String,
        access_token: String,
        context: &C,
    ) -> Result<ProjectProjectIdDocSpaceGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 事件列表
    async fn project_project_id_event_get(
        &self,
        project_id: String,
        access_token: String,
        day: String,
        user_id: Option<String>,
        context: &C,
    ) -> Result<ProjectProjectIdEventGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 所有任务
    async fn project_project_id_task_all_get(
        &self,
        project_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        context: &C,
    ) -> Result<ProjectProjectIdTaskAllGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 指派给我的任务
    async fn project_project_id_task_my_get(
        &self,
        project_id: String,
        access_token: String,
        state: String,
        context: &C,
    ) -> Result<ProjectProjectIdTaskMyGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }

    /// 显示任务
    async fn project_project_id_task_record_task_id_show_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdShowGetResponse, ApiError> {
        Err(ApiError("Generic failure".into()))
    }
}
