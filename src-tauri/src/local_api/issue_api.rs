use crate::user_api_plugin::{get_session_inner, get_user_id_inner};
use local_api_rust::models::{BugInfo, TaskInfo};
use proto_gen_rust::project_issue_api::issue_info::ExtraInfo;
use proto_gen_rust::project_issue_api::project_issue_api_client::ProjectIssueApiClient;
use proto_gen_rust::project_issue_api::*;
use tauri::AppHandle;

pub async fn list_my_issue(
    app: &AppHandle,
    project_id: &String,
    issue_type: i32,
    state: &String,
) -> Result<ListResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut state_list = Vec::new();
    if state.eq("closed") {
        state_list.push(IssueState::Close as i32);
    } else if state.eq("unclose") {
        state_list.push(IssueState::Plan as i32);
        state_list.push(IssueState::Process as i32);
        state_list.push(IssueState::Check as i32);
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    let res = client
        .list(ListRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            list_param: Some(ListParam {
                filter_by_issue_type: true,
                issue_type: issue_type,
                filter_by_state: state_list.len() > 0,
                state_list: state_list,
                filter_by_create_user_id: false,
                create_user_id_list: Vec::new(),
                filter_by_assgin_user_id: true,
                assgin_user_id_list: vec![get_user_id_inner(app).await],
                assgin_user_type: AssginUserType::AssginUserAll as i32,
                filter_by_sprit_id: false,
                sprit_id_list: Vec::new(),
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "".into(),
                filter_by_task_priority: false,
                task_priority_list: Vec::new(),
                filter_by_software_version: false,
                software_version_list: Vec::new(),
                filter_by_bug_priority: false,
                bug_priority_list: Vec::new(),
                filter_by_bug_level: false,
                bug_level_list: Vec::new(),
            }),
            sort_type: SortType::Dsc as i32,
            sort_key: SortKey::UpdateTime as i32,
            offset: 0,
            limit: 999,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

pub async fn list_issue(
    app: &AppHandle,
    project_id: &String,
    issue_type: i32,
    offset: u32,
    limit: u32,
) -> Result<ListResponse, String> {
    let chan = crate::get_grpc_chan(app).await;
    if chan.is_none() {
        return Err("grpc连接出错".into());
    }
    let mut client = ProjectIssueApiClient::new(chan.unwrap());
    let res = client
        .list(ListRequest {
            session_id: get_session_inner(app).await,
            project_id: project_id.clone(),
            list_param: Some(ListParam {
                filter_by_issue_type: true,
                issue_type: issue_type,
                filter_by_state: false,
                state_list: Vec::new(),
                filter_by_create_user_id: false,
                create_user_id_list: Vec::new(),
                filter_by_assgin_user_id: false,
                assgin_user_id_list: Vec::new(),
                assgin_user_type: AssginUserType::AssginUserAll as i32,
                filter_by_sprit_id: false,
                sprit_id_list: Vec::new(),
                filter_by_create_time: false,
                from_create_time: 0,
                to_create_time: 0,
                filter_by_update_time: false,
                from_update_time: 0,
                to_update_time: 0,
                filter_by_title_keyword: false,
                title_keyword: "".into(),
                filter_by_task_priority: false,
                task_priority_list: Vec::new(),
                filter_by_software_version: false,
                software_version_list: Vec::new(),
                filter_by_bug_priority: false,
                bug_priority_list: Vec::new(),
                filter_by_bug_level: false,
                bug_level_list: Vec::new(),
            }),
            sort_type: SortType::Dsc as i32,
            sort_key: SortKey::UpdateTime as i32,
            offset: offset,
            limit: limit,
        })
        .await;
    if res.is_err() {
        return Err("调用接口出错".into());
    } else {
        return Ok(res.unwrap().into_inner());
    }
}

//只转换类型是bug的类型
pub fn convert_to_bug_list(issue_list: Vec<IssueInfo>) -> Vec<BugInfo> {
    let mut ret_list = Vec::new();
    issue_list.iter().for_each(|issue| {
        if issue.issue_type == IssueType::Bug as i32 {
            let basic_info = issue.basic_info.clone().unwrap_or_else(|| {
                return BasicIssueInfo {
                    title: "".into(),
                    content: "".into(),
                };
            });
            let mut state = "";
            if issue.state == IssueState::Plan as i32 {
                state = "plan";
            } else if issue.state == IssueState::Process as i32 {
                state = "process";
            } else if issue.state == IssueState::Check as i32 {
                state = "check";
            } else if issue.state == IssueState::Close as i32 {
                state = "close";
            }
            let mut software_version = String::from("");
            let mut level = "minor";
            let mut priority = "low";
            if let Some(extra_info) = &issue.extra_info {
                if let ExtraInfo::ExtraBugInfo(info) = extra_info {
                    software_version = info.software_version.clone();
                    if info.level == BugLevel::Minor as i32 {
                        level = "minor";
                    } else if info.level == BugLevel::Major as i32 {
                        level = "major";
                    } else if info.level == BugLevel::Critical as i32 {
                        level = "critical";
                    } else if info.level == BugLevel::Blocker as i32 {
                        level = "blocker";
                    }
                    if info.priority == BugPriority::Low as i32 {
                        priority = "low";
                    } else if info.priority == BugPriority::Normal as i32 {
                        priority = "normal";
                    } else if info.priority == BugPriority::High as i32 {
                        priority = "high";
                    } else if info.priority == BugPriority::Urgent as i32 {
                        priority = "urgent";
                    } else if info.priority == BugPriority::Immediate as i32 {
                        priority = "immediate";
                    }
                }
            }
            ret_list.push(BugInfo {
                bug_id: Some(issue.issue_id.clone()),
                title: Some(basic_info.title.clone()),
                state: Some(state.into()),
                create_user_id: Some(issue.create_user_id.clone()),
                create_display_name: Some(issue.create_display_name.clone()),
                exec_user_id: Some(issue.exec_user_id.clone()),
                exec_display_name: Some(issue.exec_display_name.clone()),
                check_user_id: Some(issue.check_user_id.clone()),
                check_display_name: Some(issue.check_display_name.clone()),
                exec_award_point: Some(issue.exec_award_point),
                check_award_point: Some(issue.check_award_point),
                create_time: Some(issue.create_time),
                update_time: Some(issue.update_time),
                software_version: Some(software_version),
                level: Some(level.into()),
                priority: Some(priority.into()),
            });
        }
    });
    return ret_list;
}

//只转换类型是task的类型
pub fn convert_to_task_list(issue_list: Vec<IssueInfo>) -> Vec<TaskInfo> {
    let mut ret_list = Vec::new();
    issue_list.iter().for_each(|issue| {
        if issue.issue_type == IssueType::Task as i32 {
            let basic_info = issue.basic_info.clone().unwrap_or_else(|| {
                return BasicIssueInfo {
                    title: "".into(),
                    content: "".into(),
                };
            });
            let mut state = "";
            if issue.state == IssueState::Plan as i32 {
                state = "plan";
            } else if issue.state == IssueState::Process as i32 {
                state = "process";
            } else if issue.state == IssueState::Check as i32 {
                state = "check";
            } else if issue.state == IssueState::Close as i32 {
                state = "close";
            }
            let mut priority = "low";
            if let Some(extra_info) = &issue.extra_info {
                if let ExtraInfo::ExtraTaskInfo(info) = extra_info {
                    if info.priority == TaskPriority::Low as i32 {
                        priority = "low";
                    } else if info.priority == TaskPriority::Middle as i32 {
                        priority = "middle";
                    } else if info.priority == TaskPriority::High as i32 {
                        priority = "high";
                    }
                }
            }
            ret_list.push(TaskInfo {
                task_id: Some(issue.issue_id.clone()),
                title: Some(basic_info.title.clone()),
                state: Some(state.into()),
                create_user_id: Some(issue.create_user_id.clone()),
                create_display_name: Some(issue.create_display_name.clone()),
                exec_user_id: Some(issue.exec_user_id.clone()),
                exec_display_name: Some(issue.exec_display_name.clone()),
                check_user_id: Some(issue.check_user_id.clone()),
                check_display_name: Some(issue.check_display_name.clone()),
                exec_award_point: Some(issue.exec_award_point),
                check_award_point: Some(issue.check_award_point),
                create_time: Some(issue.create_time),
                update_time: Some(issue.update_time),
                priority: Some(priority.into()),
            });
        }
    });
    return ret_list;
}
