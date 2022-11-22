use async_trait::async_trait;
use local_api_rust::server::MakeService;
use proto_gen_rust::events_api::{EventRefType, EventType};
use proto_gen_rust::project_channel_api::ListChanScope;
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
    DocSpaceInfo, ErrInfo, IssueInfo, ProjectProjectIdBlockCollBlockCollIdBlockIdGet200Response,
    ProjectProjectIdBlockCollBlockCollIdGet200Response, ProjectProjectIdBlockCollGet200Response,
    ProjectProjectIdBugAllGet200Response, ProjectProjectIdDocSpaceDocSpaceIdGet200Response,
    ProjectProjectIdEventGet200Response, ProjectProjectIdTaskAllGet200Response,
    ProjectProjectIdTaskRecordTaskIdDependGet200Response,
};
use local_api_rust::{
    Api, HelloGetResponse, ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse,
    ProjectProjectIdBlockCollBlockCollIdGetResponse, ProjectProjectIdBlockCollGetResponse,
    ProjectProjectIdBugAllGetResponse, ProjectProjectIdBugMyGetResponse,
    ProjectProjectIdBugRecordBugIdEventsGetResponse,
    ProjectProjectIdBugRecordBugIdShortNoteGetResponse,
    ProjectProjectIdBugRecordBugIdShowGetResponse, ProjectProjectIdChannelMsgChannelIdGetResponse,
    ProjectProjectIdChannelMyGetResponse, ProjectProjectIdChannelNotJoinGetResponse,
    ProjectProjectIdChannelOrphanGetResponse, ProjectProjectIdCreateBugGetResponse,
    ProjectProjectIdCreateDocDocSpaceIdGetResponse, ProjectProjectIdCreateTaskGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ProjectProjectIdDocSpaceGetResponse,
    ProjectProjectIdEventGetResponse, ProjectProjectIdMemberGetResponse,
    ProjectProjectIdMemberMemberUserIdShowGetResponse, ProjectProjectIdTaskAllGetResponse,
    ProjectProjectIdTaskMyGetResponse, ProjectProjectIdTaskRecordTaskIdDependGetResponse,
    ProjectProjectIdTaskRecordTaskIdEventsGetResponse,
    ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse,
    ProjectProjectIdTaskRecordTaskIdShowGetResponse,
    ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse, ShowGetResponse,
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
        if let Err(err) = win.show() {
            println!("{}", err);
        }
        if let Err(err) = win.set_always_on_top(true) {
            println!("{}", err);
        }
        if let Err(err) = win.set_always_on_top(false) {
            println!("{}", err);
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
                short_note_mode_type: super::notice::ShortNoteMode::Detail as u32,
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
                short_note_mode_type: super::notice::ShortNoteMode::Detail as u32,
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
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
                short_note_mode_type: super::notice::ShortNoteMode::Detail as u32,
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

    /// 便签方式显示缺陷
    async fn project_project_id_bug_record_bug_id_short_note_get(
        &self,
        project_id: String,
        bug_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdShortNoteGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdBugRecordBugIdShortNoteGetResponse::Status500 {
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
                ProjectProjectIdBugRecordBugIdShortNoteGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Show as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteBug as u32,
                target_id: bug_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(
                ProjectProjectIdBugRecordBugIdShortNoteGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("发送消息失败".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        return Ok(
            ProjectProjectIdBugRecordBugIdShortNoteGetResponse::Status200 {
                body: json!({}),
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 便签方式显示任务
    async fn project_project_id_task_record_task_id_short_note_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse::Status500 {
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
                ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Show as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteTask as u32,
                target_id: task_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("发送消息失败".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        return Ok(
            ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse::Status200 {
                body: json!({}),
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 项目成员列表
    async fn project_project_id_member_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdMemberGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdMemberGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let res = super::member_api::list_member(&self.app, &project_id).await;
        if res.is_err() {
            return Ok(ProjectProjectIdMemberGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdMemberGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdMemberGetResponse::Status200 {
                body: super::member_api::convert_member_list(res.member_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 显示成员信息
    async fn project_project_id_member_member_user_id_show_get(
        &self,
        project_id: String,
        member_user_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdMemberMemberUserIdShowGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdMemberMemberUserIdShowGetResponse::Status500 {
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
                ProjectProjectIdMemberMemberUserIdShowGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Detail as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteMember as u32,
                target_id: member_user_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(
                ProjectProjectIdMemberMemberUserIdShowGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("发送消息失败".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        return Ok(
            ProjectProjectIdMemberMemberUserIdShowGetResponse::Status200 {
                body: json!({}),
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 创建缺陷
    async fn project_project_id_create_bug_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCreateBugGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdCreateBugGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdCreateBugGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Create as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteBug as u32,
                target_id: "".into(),
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdCreateBugGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdCreateBugGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 创建文档
    async fn project_project_id_create_doc_doc_space_id_get(
        &self,
        project_id: String,
        doc_space_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCreateDocDocSpaceIdGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdCreateDocDocSpaceIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdCreateDocDocSpaceIdGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Create as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteDoc as u32,
                target_id: doc_space_id.clone(),
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdCreateDocDocSpaceIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdCreateDocDocSpaceIdGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 创建任务
    async fn project_project_id_create_task_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCreateTaskGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdCreateTaskGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }

        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdCreateTaskGetResponse::Status500 {
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
                short_note_mode_type: super::notice::ShortNoteMode::Create as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteTask as u32,
                target_id: "".into(),
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdCreateTaskGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdCreateTaskGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 任务相关事件
    async fn project_project_id_task_record_task_id_events_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdEventsGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdEventsGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("访问令牌错误".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let res = super::event_api::list_event_by_ref(
            &self.app,
            &project_id,
            EventType::Task,
            EventRefType::Task,
            &task_id,
        )
        .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdEventsGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdTaskRecordTaskIdEventsGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdTaskRecordTaskIdEventsGetResponse::Status200 {
                    body: super::event_api::convert_event_list(res.event_list),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 缺陷相关事件
    async fn project_project_id_bug_record_bug_id_events_get(
        &self,
        project_id: String,
        bug_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdEventsGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBugRecordBugIdEventsGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::event_api::list_event_by_ref(
            &self.app,
            &project_id,
            EventType::Bug,
            EventRefType::Bug,
            &bug_id,
        )
        .await;
        if res.is_err() {
            return Ok(ProjectProjectIdBugRecordBugIdEventsGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdBugRecordBugIdEventsGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdBugRecordBugIdEventsGetResponse::Status200 {
                body: super::event_api::convert_event_list(res.event_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 列出子任务
    async fn project_project_id_task_record_task_id_sub_task_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("访问令牌错误".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let res = super::issue_api::list_sub_task(&self.app, &project_id, &task_id).await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse::Status200 {
                    body: super::issue_api::convert_to_sub_task_list(res.sub_issue_list),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 列出依赖工单
    async fn project_project_id_task_record_task_id_depend_get(
        &self,
        project_id: String,
        task_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdDependGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("访问令牌错误".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let my_dep_res = super::issue_api::list_my_depend(&self.app, &project_id, &task_id).await;
        let mut my_dep_list: Vec<IssueInfo> = Vec::new();
        if my_dep_res.is_err() {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(my_dep_res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        } else {
            let res = my_dep_res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            super::issue_api::convert_to_issue_list(res.issue_list)
                .iter()
                .for_each(|item| {
                    my_dep_list.push(item.clone());
                });
        }
        let dep_me_res = super::issue_api::list_depend_me(&self.app, &project_id, &task_id).await;
        let mut dep_me_list: Vec<IssueInfo> = Vec::new();
        if dep_me_res.is_err() {
            return Ok(
                ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(dep_me_res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        } else {
            let res = dep_me_res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            super::issue_api::convert_to_issue_list(res.issue_list)
                .iter()
                .for_each(|item| {
                    dep_me_list.push(item.clone());
                });
        }
        return Ok(
            ProjectProjectIdTaskRecordTaskIdDependGetResponse::Status200 {
                body: ProjectProjectIdTaskRecordTaskIdDependGet200Response {
                    my_depend_list: Some(my_dep_list),
                    depend_me_list: Some(dep_me_list),
                },
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 列出沟通内容
    async fn project_project_id_channel_msg_channel_id_get(
        &self,
        project_id: String,
        channel_id: String,
        access_token: String,
        limit: i32,
        ref_msg_id: Option<String>,
        _context: &C,
    ) -> Result<ProjectProjectIdChannelMsgChannelIdGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let perm = super::access_check::get_perm(&self.app, &project_id).await;
        if perm.is_err() {
            return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(perm.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else if perm.unwrap().access_channel == false {
            return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("没有访问权限".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let ref_msg_id = ref_msg_id.unwrap_or_default();
        let res =
            super::channel_api::list_msg(&self.app, &project_id, &channel_id, &ref_msg_id, limit)
                .await;
        if res.is_err() {
            return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdChannelMsgChannelIdGetResponse::Status200 {
                body: super::channel_api::convert_msg_list(res.msg_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 我的沟通频道
    async fn project_project_id_channel_my_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdChannelMyGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdChannelMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let perm = super::access_check::get_perm(&self.app, &project_id).await;
        if perm.is_err() {
            return Ok(ProjectProjectIdChannelMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(perm.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else if perm.unwrap().access_channel == false {
            return Ok(ProjectProjectIdChannelMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("没有访问权限".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::channel_api::list(&self.app, &project_id).await;
        if res.is_err() {
            return Ok(ProjectProjectIdChannelMyGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdChannelMyGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdChannelMyGetResponse::Status200 {
                body: super::channel_api::convert_channel_list(res.info_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 我未加入的频道
    async fn project_project_id_channel_not_join_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdChannelNotJoinGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let perm = super::access_check::get_perm(&self.app, &project_id).await;
        if perm.is_err() {
            return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(perm.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else if perm.unwrap().access_channel == false {
            return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("没有访问权限".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res =
            super::channel_api::list_by_admin(&self.app, &project_id, ListChanScope::WithoutMe)
                .await;
        if res.is_err() {
            return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdChannelNotJoinGetResponse::Status200 {
                body: super::channel_api::convert_channel_list(res.info_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 孤儿频道
    async fn project_project_id_channel_orphan_get(
        &self,
        project_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdChannelOrphanGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let perm = super::access_check::get_perm(&self.app, &project_id).await;
        if perm.is_err() {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(perm.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else if perm.unwrap().access_channel == false {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("没有访问权限".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let perm = super::access_check::get_perm(&self.app, &project_id).await;
        if perm.is_err() {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(perm.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else if perm.unwrap().access_channel == false {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("没有访问权限".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res =
            super::channel_api::list_by_admin(&self.app, &project_id, ListChanScope::Orphan).await;
        if res.is_err() {
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdChannelOrphanGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdChannelOrphanGetResponse::Status200 {
                body: super::channel_api::convert_channel_list(res.info_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 可变内容块内容
    async fn project_project_id_block_coll_block_coll_id_block_id_get(
        &self,
        project_id: String,
        block_coll_id: String,
        block_id: String,
        access_token: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(
                ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("访问令牌错误".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let res =
            super::vc_api::get_block_content(&self.app, &project_id, &block_coll_id, &block_id)
                .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdBlockCollBlockCollIdBlockIdGetResponse::Status200 {
                    body: ProjectProjectIdBlockCollBlockCollIdBlockIdGet200Response {
                        content_list: Some(super::vc_api::convert_content_list(res.content_list)),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 可变内容块
    async fn project_project_id_block_coll_block_coll_id_get(
        &self,
        project_id: String,
        block_coll_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdBlockCollBlockCollIdGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBlockCollBlockCollIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res =
            super::vc_api::list_block(&self.app, &project_id, &block_coll_id, offset, limit).await;
        if res.is_err() {
            return Ok(ProjectProjectIdBlockCollBlockCollIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdBlockCollBlockCollIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdBlockCollBlockCollIdGetResponse::Status200 {
                body: ProjectProjectIdBlockCollBlockCollIdGet200Response {
                    total_count: Some(res.total_count as i32),
                    block_list: Some(super::vc_api::convert_block_list(res.block_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 可变内容集合
    async fn project_project_id_block_coll_get(
        &self,
        project_id: String,
        access_token: String,
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdBlockCollGetResponse, ApiError> {
        if super::access_check::check_token(&self.app, &project_id, &access_token).await == false {
            return Ok(ProjectProjectIdBlockCollGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("访问令牌错误".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let res = super::vc_api::list_block_coll(&self.app, &project_id, offset, limit).await;
        if res.is_err() {
            return Ok(ProjectProjectIdBlockCollGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdBlockCollGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdBlockCollGetResponse::Status200 {
                body: ProjectProjectIdBlockCollGet200Response {
                    total_count: Some(res.total_count as i32),
                    block_coll_list: Some(super::vc_api::convert_block_coll_list(
                        res.block_coll_list,
                    )),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }
}
