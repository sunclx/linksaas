use crate::fs_api_plugin::{set_file_owner, write_file, write_thumb_image_file};
use crate::notice_decode::new_git_post_hook_notice;
use crate::user_api_plugin::get_session_inner;
use async_trait::async_trait;
use local_api_rust::server::MakeService;
use proto_gen_rust::events_api::{EventRefType, EventType};
use proto_gen_rust::fs_api::{FileOwnerType, SetFileOwnerRequest};
use proto_gen_rust::project_channel_api::ListChanScope;
use proto_gen_rust::project_issue_api::IssueType;
use proto_gen_rust::project_test_case_api::{BasicResultImage, ResultType};
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
    DocSpaceInfo, ErrInfo, IssueInfo, ProjectProjectIdAiTokenGet200Response,
    ProjectProjectIdBugAllGet200Response, ProjectProjectIdCodeCommentCommentThreadIdPut200Response,
    ProjectProjectIdCodeCommentCommentThreadIdPutRequest,
    ProjectProjectIdDocSpaceDocSpaceIdGet200Response, ProjectProjectIdEventGet200Response,
    ProjectProjectIdTaskAllGet200Response, ProjectProjectIdTaskRecordTaskIdDependGet200Response,
    ProjectProjectIdTestCaseReportEntryIdPost200Response,
    ProjectProjectIdTestCaseReportEntryIdPostRequest,
};
use local_api_rust::{
    Api, HelloGetResponse, ProjectGetResponse, ProjectProjectIdAiTokenGetResponse,
    ProjectProjectIdBugAllGetResponse, ProjectProjectIdBugMyGetResponse,
    ProjectProjectIdBugRecordBugIdEventsGetResponse,
    ProjectProjectIdBugRecordBugIdShortNoteGetResponse,
    ProjectProjectIdBugRecordBugIdShowGetResponse, ProjectProjectIdChannelMsgChannelIdGetResponse,
    ProjectProjectIdChannelMyGetResponse, ProjectProjectIdChannelNotJoinGetResponse,
    ProjectProjectIdChannelOrphanGetResponse,
    ProjectProjectIdCodeCommentCommentThreadIdCommentIdDeleteResponse,
    ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse,
    ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse,
    ProjectProjectIdCodeCommentCommentThreadIdGetResponse,
    ProjectProjectIdCodeCommentCommentThreadIdPutResponse, ProjectProjectIdCreateBugGetResponse,
    ProjectProjectIdCreateDocDocSpaceIdGetResponse, ProjectProjectIdCreateTaskGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse,
    ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ProjectProjectIdDocSpaceGetResponse,
    ProjectProjectIdEventGetResponse, ProjectProjectIdMemberGetResponse,
    ProjectProjectIdMemberMemberUserIdShowGetResponse, ProjectProjectIdTaskAllGetResponse,
    ProjectProjectIdTaskMyGetResponse, ProjectProjectIdTaskRecordTaskIdDependGetResponse,
    ProjectProjectIdTaskRecordTaskIdEventsGetResponse,
    ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse,
    ProjectProjectIdTaskRecordTaskIdShowGetResponse,
    ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse, ProjectProjectIdTestCaseLangGetResponse,
    ProjectProjectIdTestCaseLangLangFrameworkEntryIdGetResponse,
    ProjectProjectIdTestCaseLangLangGetResponse, ProjectProjectIdTestCaseListEntryIdGetResponse,
    ProjectProjectIdTestCaseReportEntryIdPostResponse,
    ProjectProjectIdTestCaseShowEntryIdGetResponse, ProjectProjectIdToolsPostHookGetResponse,
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
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdBugAllGetResponse, ApiError> {
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
        state: String,
        _context: &C,
    ) -> Result<ProjectProjectIdBugMyGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdShowGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdDocIdShowGetResponse, ApiError> {
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
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceDocSpaceIdGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdDocSpaceGetResponse, ApiError> {
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
        from_time: i64,
        to_time: i64,
        offset: i32,
        limit: i32,
        user_id: Option<String>,
        _context: &C,
    ) -> Result<ProjectProjectIdEventGetResponse, ApiError> {
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
        offset: i32,
        limit: i32,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskAllGetResponse, ApiError> {
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
                    task_list: Some(super::issue_api::convert_to_task_list(res.info_list)),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 指派给我的任务
    async fn project_project_id_task_my_get(
        &self,
        project_id: String,
        state: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTaskMyGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdShowGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdShortNoteGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdShortNoteGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdMemberGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdMemberMemberUserIdShowGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdCreateBugGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdCreateDocDocSpaceIdGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdCreateTaskGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdEventsGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdBugRecordBugIdEventsGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdSubTaskGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdTaskRecordTaskIdDependGetResponse, ApiError> {
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
        limit: i32,
        ref_msg_id: Option<String>,
        _context: &C,
    ) -> Result<ProjectProjectIdChannelMsgChannelIdGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdChannelMyGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdChannelNotJoinGetResponse, ApiError> {
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
        _context: &C,
    ) -> Result<ProjectProjectIdChannelOrphanGetResponse, ApiError> {
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

    /// 列出生成测试代码支持的语言
    async fn project_project_id_test_case_lang_get(
        &self,
        _project_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseLangGetResponse, ApiError> {
        let res = super::testcase_api::list_lang(&self.app).await;
        if res.is_err() {
            return Ok(ProjectProjectIdTestCaseLangGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdTestCaseLangGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdTestCaseLangGetResponse::Status200 {
                body: res.lang_list,
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 生成测试用例代码
    async fn project_project_id_test_case_lang_lang_framework_entry_id_get(
        &self,
        project_id: String,
        lang: String,
        framework: String,
        entry_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseLangLangFrameworkEntryIdGetResponse, ApiError> {
        let res = super::testcase_api::gen_test_code(
            &self.app,
            &project_id,
            &lang,
            &framework,
            &entry_id,
        )
        .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdTestCaseLangLangFrameworkEntryIdGetResponse::Status500 {
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
                    ProjectProjectIdTestCaseLangLangFrameworkEntryIdGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdTestCaseLangLangFrameworkEntryIdGetResponse::Status200 {
                    body: res.gen_code,
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 列出生成测试代码支持的框架
    async fn project_project_id_test_case_lang_lang_get(
        &self,
        _project_id: String,
        lang: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseLangLangGetResponse, ApiError> {
        let res = super::testcase_api::list_frame_work(&self.app, &lang).await;
        if res.is_err() {
            return Ok(ProjectProjectIdTestCaseLangLangGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdTestCaseLangLangGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdTestCaseLangLangGetResponse::Status200 {
                body: res.frame_work_list,
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 列出测试用例
    async fn project_project_id_test_case_list_entry_id_get(
        &self,
        project_id: String,
        entry_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseListEntryIdGetResponse, ApiError> {
        let mut real_entry_id = entry_id;
        if &real_entry_id == "__ROOT__" {
            real_entry_id = "".into();
        }
        let res = super::testcase_api::list_entry(&self.app, &project_id, &real_entry_id).await;
        if res.is_err() {
            return Ok(ProjectProjectIdTestCaseListEntryIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdTestCaseListEntryIdGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdTestCaseListEntryIdGetResponse::Status200 {
                body: super::testcase_api::convert_to_entry_list(res.entry_list),
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// 上报测试结果
    async fn project_project_id_test_case_report_entry_id_post(
        &self,
        project_id: String,
        entry_id: String,
        request: Option<ProjectProjectIdTestCaseReportEntryIdPostRequest>,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseReportEntryIdPostResponse, ApiError> {
        if request.is_none() {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("错误的请求数据".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let request = request.unwrap();
        //获取项目信息
        let project_res = super::project_api::get_project(&self.app, &project_id).await;
        if project_res.is_err() {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(project_res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let project_res = project_res.unwrap();
        if &project_res.err_msg != "" {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(project_res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let test_case_fs_id = project_res.info.unwrap().test_case_fs_id;
        //上传文件
        let window = self.app.get_window("main");
        if window.is_none() {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("无法获取窗口句柄".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let window = window.unwrap();
        let session_id = get_session_inner(&self.app).await;
        let mut dest_image_list: Vec<BasicResultImage> = Vec::new();
        if let Some(image_list) = request.image_list {
            for file_name in &image_list {
                let thumb_res = write_thumb_image_file(
                    self.app.clone(),
                    window.clone(),
                    "".into(),
                    session_id.clone(),
                    test_case_fs_id.clone(),
                    file_name.clone(),
                    200,
                    150,
                )
                .await;
                if thumb_res.is_err() {
                    return Ok(
                        ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                            body: ErrInfo {
                                err_msg: Some(thumb_res.err().unwrap()),
                            },
                            access_control_allow_origin: Some("*".into()),
                        },
                    );
                }
                let thumb_res = thumb_res.unwrap();
                if &thumb_res.err_msg != "" {
                    return Ok(
                        ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                            body: ErrInfo {
                                err_msg: Some(thumb_res.err_msg),
                            },
                            access_control_allow_origin: Some("*".into()),
                        },
                    );
                }

                let res = write_file(
                    self.app.clone(),
                    window.clone(),
                    "".into(),
                    session_id.clone(),
                    test_case_fs_id.clone(),
                    file_name.clone(),
                )
                .await;
                if res.is_err() {
                    return Ok(
                        ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
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
                            ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                                body: ErrInfo {
                                    err_msg: Some(res.err_msg),
                                },
                                access_control_allow_origin: Some("*".into()),
                            },
                        );
                    }
                    dest_image_list.push(BasicResultImage {
                        thumb_file_id: thumb_res.file_id,
                        file_id: res.file_id,
                    });
                }
            }
        }
        let mut extra_file_id_list: Vec<String> = Vec::new();
        if let Some(extra_file_list) = request.extra_file_list {
            for file_name in &extra_file_list {
                let res = write_file(
                    self.app.clone(),
                    window.clone(),
                    "".into(),
                    session_id.clone(),
                    test_case_fs_id.clone(),
                    file_name.clone(),
                )
                .await;
                if res.is_err() {
                    return Ok(
                        ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
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
                            ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                                body: ErrInfo {
                                    err_msg: Some(res.err_msg),
                                },
                                access_control_allow_origin: Some("*".into()),
                            },
                        );
                    }
                    extra_file_id_list.push(res.file_id);
                }
            }
        }
        //上传结果
        let mut result_type = ResultType::Success as i32;
        let req_result_type = request.result_type.unwrap();
        if &req_result_type == "warn" {
            result_type = ResultType::Warn as i32;
        } else if &req_result_type == "fail" {
            result_type = ResultType::Fail as i32;
        }
        let res = super::testcase_api::add_result(
            &self.app,
            &project_id,
            &entry_id,
            &request.desc.unwrap(),
            result_type,
            dest_image_list.clone(),
            extra_file_id_list.clone(),
        )
        .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err().unwrap()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let res = res.unwrap();
        if &res.err_msg != "" {
            return Ok(
                ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let result_id = res.result_id;
        //调整文件owner
        let mut file_id_list: Vec<String> = Vec::new();
        for img_file in dest_image_list {
            file_id_list.push(img_file.thumb_file_id);
            file_id_list.push(img_file.file_id);
        }
        for file_id in extra_file_id_list {
            file_id_list.push(file_id);
        }
        for file_id in file_id_list {
            let res = set_file_owner(
                self.app.clone(),
                window.clone(),
                SetFileOwnerRequest {
                    session_id: session_id.clone(),
                    fs_id: test_case_fs_id.clone(),
                    file_id: file_id,
                    owner_type: FileOwnerType::TestCaseResult as i32,
                    owner_id: result_id.clone(),
                },
            )
            .await;
            if res.is_err() {
                return Ok(
                    ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err().unwrap()),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(
                    ProjectProjectIdTestCaseReportEntryIdPostResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
        }
        return Ok(
            ProjectProjectIdTestCaseReportEntryIdPostResponse::Status200 {
                body: ProjectProjectIdTestCaseReportEntryIdPost200Response {
                    result_id: Some(result_id),
                },
                access_control_allow_origin: Some("*".into()),
            },
        );
    }

    /// 显示测试用例或目录
    async fn project_project_id_test_case_show_entry_id_get(
        &self,
        project_id: String,
        entry_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdTestCaseShowEntryIdGetResponse, ApiError> {
        let win = self.app.get_window("main");
        if win.is_none() {
            return Ok(ProjectProjectIdTestCaseShowEntryIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("无法找到主窗口".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        let win = win.unwrap();
        let mut target_id = entry_id;
        if &target_id == "__ROOT__" {
            target_id = "".into();
        }
        if let Err(_) = win.emit(
            "shortNote",
            super::notice::ShortNotetNotice {
                project_id: project_id,
                short_note_mode_type: super::notice::ShortNoteMode::Detail as u32,
                short_note_type: super::notice::ShortNoteType::ShortNoteTestCase as u32,
                target_id: target_id,
                extra_target_value: "".into(),
            },
        ) {
            return Ok(ProjectProjectIdTestCaseShowEntryIdGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some("发送消息失败".into()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
        return Ok(ProjectProjectIdTestCaseShowEntryIdGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 删除代码评论
    async fn project_project_id_code_comment_comment_thread_id_comment_id_delete(
        &self,
        project_id: String,
        _comment_thread_id: String,
        comment_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCodeCommentCommentThreadIdCommentIdDeleteResponse, ApiError> {
        let res =
            super::project_code_api::remove_comment(&self.app, &project_id, &comment_id).await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdDeleteResponse::Status500 {
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
                    ProjectProjectIdCodeCommentCommentThreadIdCommentIdDeleteResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdDeleteResponse::Status200 {
                    body: json!({}),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 获取单个代码评论
    async fn project_project_id_code_comment_comment_thread_id_comment_id_get(
        &self,
        project_id: String,
        _comment_thread_id: String,
        comment_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse, ApiError> {
        let res = super::project_code_api::get_comment(&self.app, &project_id, &comment_id).await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse::Status500 {
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
                    ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            if res.comment.is_none() {
                return Ok(
                    ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some("no code comment".into()),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            let comment = res.comment.unwrap();
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdGetResponse::Status200 {
                    body: super::project_code_api::convert_to_comment(&comment),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 更新单个代码评论
    async fn project_project_id_code_comment_comment_thread_id_comment_id_post(
        &self,
        project_id: String,
        _comment_thread_id: String,
        comment_id: String,
        request: Option<ProjectProjectIdCodeCommentCommentThreadIdPutRequest>,
        _context: &C,
    ) -> Result<ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse, ApiError> {
        if request.is_none() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("错误的请求参数".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let request = request.unwrap();
        let content = request.content.unwrap_or_default();
        let content_type_str = request.content_type.unwrap_or_default();
        let mut content_type = proto_gen_rust::project_code_api::ContentType::Text;
        if content_type_str == "markdown" {
            content_type = proto_gen_rust::project_code_api::ContentType::Markdown;
        }
        let res = super::project_code_api::update_comment(
            &self.app,
            &project_id,
            &comment_id,
            content_type,
            &content,
        )
        .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse::Status500 {
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
                    ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdCommentIdPostResponse::Status200 {
                    body: json!({}),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 列出代码评论
    async fn project_project_id_code_comment_comment_thread_id_get(
        &self,
        project_id: String,
        thread_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdCodeCommentCommentThreadIdGetResponse, ApiError> {
        let res = super::project_code_api::list_comment(&self.app, &project_id, &thread_id).await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdGetResponse::Status500 {
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
                    ProjectProjectIdCodeCommentCommentThreadIdGetResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdGetResponse::Status200 {
                    body: super::project_code_api::convert_to_comment_list(&res.comment_list),
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    /// 新增代码评论
    async fn project_project_id_code_comment_comment_thread_id_put(
        &self,
        project_id: String,
        thread_id: String,
        request: Option<ProjectProjectIdCodeCommentCommentThreadIdPutRequest>,
        _context: &C,
    ) -> Result<ProjectProjectIdCodeCommentCommentThreadIdPutResponse, ApiError> {
        if request.is_none() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdPutResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("错误的请求参数".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
        let request = request.unwrap();
        let content = request.content.unwrap_or_default();
        let content_type_str = request.content_type.unwrap_or_default();
        let mut content_type = proto_gen_rust::project_code_api::ContentType::Text;
        if content_type_str == "markdown" {
            content_type = proto_gen_rust::project_code_api::ContentType::Markdown;
        }

        let res = super::project_code_api::add_comment(
            &self.app,
            &project_id,
            &thread_id,
            content_type,
            &content,
        )
        .await;
        if res.is_err() {
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdPutResponse::Status500 {
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
                    ProjectProjectIdCodeCommentCommentThreadIdPutResponse::Status500 {
                        body: ErrInfo {
                            err_msg: Some(res.err_msg),
                        },
                        access_control_allow_origin: Some("*".into()),
                    },
                );
            }
            return Ok(
                ProjectProjectIdCodeCommentCommentThreadIdPutResponse::Status200 {
                    body: ProjectProjectIdCodeCommentCommentThreadIdPut200Response {
                        comment_id: Some(res.comment_id),
                    },
                    access_control_allow_origin: Some("*".into()),
                },
            );
        }
    }

    async fn project_project_id_ai_token_get(
        &self,
        project_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdAiTokenGetResponse, ApiError> {
        let res = super::project_api::gen_ai_token(&self.app, &project_id).await;
        if res.is_err() {
            return Ok(ProjectProjectIdAiTokenGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectProjectIdAiTokenGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            return Ok(ProjectProjectIdAiTokenGetResponse::Status200 {
                body: ProjectProjectIdAiTokenGet200Response {
                    token: Some(res.token),
                },
                access_control_allow_origin: Some("*".into()),
            });
        }
    }

    /// git post commit hook回调
    async fn project_project_id_tools_post_hook_get(
        &self,
        project_id: String,
        _context: &C,
    ) -> Result<ProjectProjectIdToolsPostHookGetResponse, ApiError> {
        let win = self.app.get_window("main");
        if win.is_some() {
            let win = win.unwrap();
            if let Err(_) = win.emit("notice", new_git_post_hook_notice(project_id)) {
                return Ok(ProjectProjectIdToolsPostHookGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some("发送通知失败".into()),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
        }
        return Ok(ProjectProjectIdToolsPostHookGetResponse::Status200 {
            body: json!({}),
            access_control_allow_origin: Some("*".into()),
        });
    }

    /// 获取项目列表
    async fn project_get(&self, _context: &C) -> Result<ProjectGetResponse, ApiError> {
        let res = super::project_api::list_project(&self.app).await;
        if res.is_err() {
            return Ok(ProjectGetResponse::Status500 {
                body: ErrInfo {
                    err_msg: Some(res.err().unwrap()),
                },
                access_control_allow_origin: Some("*".into()),
            });
        } else {
            let res = res.unwrap();
            if &res.err_msg != "" {
                return Ok(ProjectGetResponse::Status500 {
                    body: ErrInfo {
                        err_msg: Some(res.err_msg),
                    },
                    access_control_allow_origin: Some("*".into()),
                });
            }
            let mut project_list: Vec<local_api_rust::models::ProjectInfo> = Vec::new();
            res.info_list.iter().for_each(|prj| {
                project_list.push(local_api_rust::models::ProjectInfo {
                    project_id: Some(prj.project_id.clone()),
                    project_name: Some(prj.basic_info.as_ref().unwrap().project_name.clone()),
                })
            });
            return Ok(ProjectGetResponse::Status200 {
                body: project_list,
                access_control_allow_origin: Some("*".into()),
            });
        }
    }
}
