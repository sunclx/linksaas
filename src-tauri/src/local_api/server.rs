use async_trait::async_trait;
use local_api_rust::server::MakeService;
use proto_gen_rust::project_issue_api::IssueType;
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

use local_api_rust::models::{
    DocSpaceInfo, ErrInfo, ProjectProjectIdBugAllGet200Response,
    ProjectProjectIdDocSpaceDocSpaceIdGet200Response, ProjectProjectIdEventGet200Response,
    ProjectProjectIdTaskAllGet200Response,
};
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
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBugAllGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::issue_api::list_issue(
            &self.app,
            &project_id,
            IssueType::Bug as i32,
            offset as u32,
            limit as u32,
        )
        .await;
        if res.is_err() {
            return Ok(ProjectProjectIdBugAllGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdBugAllGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdBugAllGetResponse::Status200 {
                body: ProjectProjectIdBugAllGet200Response {
                    total_count: Some(res.total_count as i32),
                    bug_list: Some(super::issue_api::convert_to_bug_list(res.info_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 指派给我的缺陷
    async fn project_project_id_bug_my_get(
        &self,
        project_id: String,
        access_token: String,
        state: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBugMyGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBugMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res =
            super::issue_api::list_my_issue(&self.app, &project_id, IssueType::Bug as i32, &state)
                .await;
        if res.is_err() {
            return Ok(ProjectProjectIdBugMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdBugMyGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdBugMyGetResponse::Status200 {
                body: super::issue_api::convert_to_bug_list(res.info_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 显示缺陷
    async fn project_project_id_bug_record_bug_id_show_get(
        &self,
        project_id: String,
        bug_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdShowGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBugRecordBugIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdBugRecordBugIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("无法找到主窗口".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let win = win.unwrap();
        if let Err(_) = win.emit(
            "shortNote",
            super::notice::ShortNotetNotice {
                project_id: project_id,
                short_note_type: super::notice::ShortNoteType::ShortNoteBug as u32,
                target_id: bug_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdBugRecordBugIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdBugRecordBugIdShowGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 文档列表
    async fn project_project_id_doc_space_doc_space_id_doc_id_show_get(
        &self,
        project_id: String,
        _doc_space_id: String,
        doc_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("访问令牌错误".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(
                ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("无法找到主窗口".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let win = win.unwrap();
        if let Err(_) = win.emit(
            "shortNote",
            super::notice::ShortNotetNotice {
                project_id: project_id,
                short_note_type: super::notice::ShortNoteType::ShortNoteDoc as u32,
                target_id: doc_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(
                ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("发送消息失败".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        return Ok(
            ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse::Status200 {
                body: json!({}),
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 文档列表
    async fn project_project_id_doc_space_doc_space_id_get(
        &self,
        project_id: String,
        doc_space_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdDocSpaceDocSpaceIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::doc_space_api::list_doc_key(
            &self.app,
            &project_id,
            &doc_space_id,
            offset as u32,
            limit as u32,
        )
        .await;
        if res.is_err() {
            return Ok(ProjectProjectIdDocSpaceDocSpaceIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdDocSpaceDocSpaceIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }

            return Ok(ProjectProjectIdDocSpaceDocSpaceIdGetResponse::Status200 {
                body: ProjectProjectIdDocSpaceDocSpaceIdGet200Response {
                    total_count: Some(res.total_count as i32),
                    doc_list: Some(super::doc_space_api::convert_doc_list(res.doc_key_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 文档空间列表
    async fn project_project_id_doc_space_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdDocSpaceGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::doc_space_api::list_doc_space(&self.app, &project_id).await;
        if res.is_err() {
            return Ok(ProjectProjectIdDocSpaceGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdDocSpaceGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            let mut info_list = Vec::new();
            res.doc_space_list.iter().for_each(|item| {
                let mut title = String::from("");
                if let Some(basic_info) = &item.base_info {
                    title = basic_info.title.clone();
                }
                info_list.push(DocSpaceInfo {
                    doc_space_id: Some(item.doc_space_id.clone()),
                    title: Some(title),
                });
            });
            return Ok(ProjectProjectIdDocSpaceGetResponse::Status200 {
                body: info_list,
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 事件列表
    async fn project_project_id_event_get(
        &self,
        project_id: String,
        access_token: String,
        from_time: i64,
        to_time: i64,
        offset: i32,
        limit: i32,
        user_id: Option<String>,
        _context: &C,
    ) -> Result<ProjectProjectIdEventGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdEventGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let mut member_user_id = String::from("");
        if let Some(user_id) = user_id {
            member_user_id = user_id;
        }
        let res = super::event_api::list_project_event(
            &self.app,
            &project_id,
            &member_user_id,
            from_time,
            to_time,
            offset as u32,
            limit as u32,
        )
        .await;
        if res.is_err() {
            return Ok(ProjectProjectIdEventGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdEventGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdEventGetResponse::Status200 {
                body: ProjectProjectIdEventGet200Response {
                    total_count: Some(res.total_count as i32),
                    event_list: Some(super::event_api::convert_event_list(res.event_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 所有任务
    async fn project_project_id_task_all_get(
        &self,
        project_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskAllGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdTaskAllGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::issue_api::list_issue(
            &self.app,
            &project_id,
            IssueType::Task as i32,
            offset as u32,
            limit as u32,
        )
        .await;
        if res.is_err() {
            return Ok(ProjectProjectIdTaskAllGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdTaskAllGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdTaskAllGetResponse::Status200 {
                body: ProjectProjectIdTaskAllGet200Response {
                    total_count: Some(res.total_count as i32),
                    bug_list: Some(super::issue_api::convert_to_task_list(res.info_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 指派给我的任务
    async fn project_project_id_task_my_get(
        &self,
        project_id: String,
        access_token: String,
        state: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskMyGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdTaskMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res =
            super::issue_api::list_my_issue(&self.app, &project_id, IssueType::Task as i32, &state)
                .await;
        if res.is_err() {
            return Ok(ProjectProjectIdTaskMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdTaskMyGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdTaskMyGetResponse::Status200 {
                body: super::issue_api::convert_to_task_list(res.info_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 显示任务
    async fn project_project_id_task_record_task_id_show_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdShowGetResponse, ApiError> {
        if super::access_check::check(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdTaskRecordTaskIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdTaskRecordTaskIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("无法找到主窗口".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let win = win.unwrap();
        if let Err(_) = win.emit(
            "shortNote",
            super::notice::ShortNotetNotice {
                project_id: project_id,
                short_note_type: super::notice::ShortNoteType::ShortNoteTask as u32,
                target_id: task_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdTaskRecordTaskIdShowGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdTaskRecordTaskIdShowGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }
}
