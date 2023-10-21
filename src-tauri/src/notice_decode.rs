pub mod project {
    use prost::Message;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::notices_project;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        UpdateProjectNotice(notices_project::UpdateProjectNotice),
        RemoveProjectNotice(notices_project::RemoveProjectNotice),
        AddMemberNotice(notices_project::AddMemberNotice),
        UpdateMemberNotice(notices_project::UpdateMemberNotice),
        RemoveMemberNotice(notices_project::RemoveMemberNotice),
        UserOnlineNotice(notices_project::UserOnlineNotice),
        UserOfflineNotice(notices_project::UserOfflineNotice),
        NewEventNotice(notices_project::NewEventNotice),
        SetMemberRoleNotice(notices_project::SetMemberRoleNotice),
        UpdateShortNoteNotice(notices_project::UpdateShortNoteNotice),
        UpdateAlarmStatNotice(notices_project::UpdateAlarmStatNotice),
        CreateBulletinNotice(notices_project::CreateBulletinNotice),
        UpdateBulletinNotice(notices_project::UpdateBulletinNotice),
        RemoveBulletinNotice(notices_project::RemoveBulletinNotice),
        AddTagNotice(notices_project::AddTagNotice),
        UpdateTagNotice(notices_project::UpdateTagNotice),
        RemoveTagNotice(notices_project::RemoveTagNotice),
        UpdateSpritNotice(notices_project::UpdateSpritNotice),
    }

    pub fn decode_notice(data: &Any) -> Option<Notice> {
        if data.type_url == notices_project::UpdateProjectNotice::type_url() {
            if let Ok(notice) = notices_project::UpdateProjectNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateProjectNotice(notice));
            }
        } else if data.type_url == notices_project::RemoveProjectNotice::type_url() {
            if let Ok(notice) = notices_project::RemoveProjectNotice::decode(data.value.as_slice())
            {
                return Some(Notice::RemoveProjectNotice(notice));
            }
        } else if data.type_url == notices_project::AddMemberNotice::type_url() {
            if let Ok(notice) = notices_project::AddMemberNotice::decode(data.value.as_slice()) {
                return Some(Notice::AddMemberNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateMemberNotice::type_url() {
            if let Ok(notice) = notices_project::UpdateMemberNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateMemberNotice(notice));
            }
        } else if data.type_url == notices_project::RemoveMemberNotice::type_url() {
            if let Ok(notice) = notices_project::RemoveMemberNotice::decode(data.value.as_slice()) {
                return Some(Notice::RemoveMemberNotice(notice));
            }
        } else if data.type_url == notices_project::UserOnlineNotice::type_url() {
            if let Ok(notice) = notices_project::UserOnlineNotice::decode(data.value.as_slice()) {
                return Some(Notice::UserOnlineNotice(notice));
            }
        } else if data.type_url == notices_project::UserOfflineNotice::type_url() {
            if let Ok(notice) = notices_project::UserOfflineNotice::decode(data.value.as_slice()) {
                return Some(Notice::UserOfflineNotice(notice));
            }
        } else if data.type_url == notices_project::NewEventNotice::type_url() {
            if let Ok(notice) = notices_project::NewEventNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewEventNotice(notice));
            }
        } else if data.type_url == notices_project::SetMemberRoleNotice::type_url() {
            if let Ok(notice) = notices_project::SetMemberRoleNotice::decode(data.value.as_slice())
            {
                return Some(Notice::SetMemberRoleNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateShortNoteNotice::type_url() {
            if let Ok(notice) =
                notices_project::UpdateShortNoteNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateShortNoteNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateAlarmStatNotice::type_url() {
            if let Ok(notice) =
                notices_project::UpdateAlarmStatNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateAlarmStatNotice(notice));
            }
        } else if data.type_url == notices_project::CreateBulletinNotice::type_url() {
            if let Ok(notice) = notices_project::CreateBulletinNotice::decode(data.value.as_slice())
            {
                return Some(Notice::CreateBulletinNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateBulletinNotice::type_url() {
            if let Ok(notice) = notices_project::UpdateBulletinNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateBulletinNotice(notice));
            }
        } else if data.type_url == notices_project::RemoveBulletinNotice::type_url() {
            if let Ok(notice) = notices_project::RemoveBulletinNotice::decode(data.value.as_slice())
            {
                return Some(Notice::RemoveBulletinNotice(notice));
            }
        } else if data.type_url == notices_project::AddTagNotice::type_url() {
            if let Ok(notice) = notices_project::AddTagNotice::decode(data.value.as_slice()) {
                return Some(Notice::AddTagNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateTagNotice::type_url() {
            if let Ok(notice) = notices_project::UpdateTagNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateTagNotice(notice));
            }
        } else if data.type_url == notices_project::RemoveTagNotice::type_url() {
            if let Ok(notice) = notices_project::RemoveTagNotice::decode(data.value.as_slice()) {
                return Some(Notice::RemoveTagNotice(notice));
            }
        } else if data.type_url == notices_project::UpdateSpritNotice::type_url() {
            if let Ok(notice) = notices_project::UpdateSpritNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateSpritNotice(notice));
            }
        }
        None
    }
}

pub mod project_doc {
    use prost::Message;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::notices_doc;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        NewDocSpaceNotice(notices_doc::NewDocSpaceNotice),
        UpdateDocSpaceNotice(notices_doc::UpdateDocSpaceNotice),
        RemoveDocSpaceNotice(notices_doc::RemoveDocSpaceNotice),
        NewDocNotice(notices_doc::NewDocNotice),
        UpdateDocNotice(notices_doc::UpdateDocNotice),
        RemoveDocNotice(notices_doc::RemoveDocNotice),
        RecoverDocInRecycleNotice(notices_doc::RecoverDocInRecycleNotice),
        RemoveDocInRecycleNotice(notices_doc::RemoveDocInRecycleNotice),
        LinkSpritNotice(notices_doc::LinkSpritNotice),
        CancelLinkSpritNotice(notices_doc::CancelLinkSpritNotice),
    }

    pub fn decode_notice(data: &Any) -> Option<Notice> {
        if data.type_url == notices_doc::NewDocSpaceNotice::type_url() {
            if let Ok(notice) = notices_doc::NewDocSpaceNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewDocSpaceNotice(notice));
            }
        } else if data.type_url == notices_doc::UpdateDocSpaceNotice::type_url() {
            if let Ok(notice) = notices_doc::UpdateDocSpaceNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateDocSpaceNotice(notice));
            }
        } else if data.type_url == notices_doc::RemoveDocSpaceNotice::type_url() {
            if let Ok(notice) = notices_doc::RemoveDocSpaceNotice::decode(data.value.as_slice()) {
                return Some(Notice::RemoveDocSpaceNotice(notice));
            }
        } else if data.type_url == notices_doc::NewDocNotice::type_url() {
            if let Ok(notice) = notices_doc::NewDocNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewDocNotice(notice));
            }
        } else if data.type_url == notices_doc::UpdateDocNotice::type_url() {
            if let Ok(notice) = notices_doc::UpdateDocNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateDocNotice(notice));
            }
        } else if data.type_url == notices_doc::RemoveDocNotice::type_url() {
            if let Ok(notice) = notices_doc::RemoveDocNotice::decode(data.value.as_slice()) {
                return Some(Notice::RemoveDocNotice(notice));
            }
        } else if data.type_url == notices_doc::RecoverDocInRecycleNotice::type_url() {
            if let Ok(notice) =
                notices_doc::RecoverDocInRecycleNotice::decode(data.value.as_slice())
            {
                return Some(Notice::RecoverDocInRecycleNotice(notice));
            }
        } else if data.type_url == notices_doc::RemoveDocInRecycleNotice::type_url() {
            if let Ok(notice) = notices_doc::RemoveDocInRecycleNotice::decode(data.value.as_slice())
            {
                return Some(Notice::RemoveDocInRecycleNotice(notice));
            }
        } else if data.type_url == notices_doc::LinkSpritNotice::type_url() {
            if let Ok(notice) = notices_doc::LinkSpritNotice::decode(data.value.as_slice()) {
                return Some(Notice::LinkSpritNotice(notice));
            }
        } else if data.type_url == notices_doc::CancelLinkSpritNotice::type_url() {
            if let Ok(notice) = notices_doc::CancelLinkSpritNotice::decode(data.value.as_slice()) {
                return Some(Notice::CancelLinkSpritNotice(notice));
            }
        }
        None
    }
}

pub mod issue {
    use prost::Message;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::notices_issue;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        NewIssueNotice(notices_issue::NewIssueNotice),
        RemoveIssueNotice(notices_issue::RemoveIssueNotice),
        SetExecUserNotice(notices_issue::SetExecUserNotice),
        SetCheckUserNotice(notices_issue::SetCheckUserNotice),
        UpdateIssueNotice(notices_issue::UpdateIssueNotice),
        UpdateIssueStateNotice(notices_issue::UpdateIssueStateNotice),
        SetSpritNotice(notices_issue::SetSpritNotice),
    }

    pub fn decode_notice(data: &Any) -> Option<Notice> {
        if data.type_url == notices_issue::NewIssueNotice::type_url() {
            if let Ok(notice) = notices_issue::NewIssueNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewIssueNotice(notice));
            }
        } else if data.type_url == notices_issue::RemoveIssueNotice::type_url() {
            if let Ok(notice) = notices_issue::RemoveIssueNotice::decode(data.value.as_slice()) {
                return Some(Notice::RemoveIssueNotice(notice));
            }
        } else if data.type_url == notices_issue::SetExecUserNotice::type_url() {
            if let Ok(notice) = notices_issue::SetExecUserNotice::decode(data.value.as_slice()) {
                return Some(Notice::SetExecUserNotice(notice));
            }
        } else if data.type_url == notices_issue::SetCheckUserNotice::type_url() {
            if let Ok(notice) = notices_issue::SetCheckUserNotice::decode(data.value.as_slice()) {
                return Some(Notice::SetCheckUserNotice(notice));
            }
        } else if data.type_url == notices_issue::UpdateIssueNotice::type_url() {
            if let Ok(notice) = notices_issue::UpdateIssueNotice::decode(data.value.as_slice()) {
                return Some(Notice::UpdateIssueNotice(notice));
            }
        } else if data.type_url == notices_issue::UpdateIssueStateNotice::type_url() {
            if let Ok(notice) = notices_issue::UpdateIssueStateNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateIssueStateNotice(notice));
            }
        } else if data.type_url == notices_issue::SetSpritNotice::type_url() {
            if let Ok(notice) = notices_issue::SetSpritNotice::decode(data.value.as_slice()) {
                return Some(Notice::SetSpritNotice(notice));
            }
        }
        None
    }
}

pub mod appraise {
    use prost::Message;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::notices_appraise;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        NewAppraiseNotice(notices_appraise::NewAppraiseNotice),
        UpdateAppraiseNotice(notices_appraise::UpdateAppraiseNotice),
        RemoveAppraiseNotice(notices_appraise::RemoveAppraiseNotice),
        NewVoteNotice(notices_appraise::NewVoteNotice),
        RevokeVoteNotice(notices_appraise::RevokeVoteNotice),
    }
    pub fn decode_notice(data: &Any) -> Option<Notice> {
        if data.type_url == notices_appraise::NewAppraiseNotice::type_url() {
            if let Ok(notice) = notices_appraise::NewAppraiseNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewAppraiseNotice(notice));
            }
        } else if data.type_url == notices_appraise::UpdateAppraiseNotice::type_url() {
            if let Ok(notice) =
                notices_appraise::UpdateAppraiseNotice::decode(data.value.as_slice())
            {
                return Some(Notice::UpdateAppraiseNotice(notice));
            }
        } else if data.type_url == notices_appraise::RemoveAppraiseNotice::type_url() {
            if let Ok(notice) =
                notices_appraise::RemoveAppraiseNotice::decode(data.value.as_slice())
            {
                return Some(Notice::RemoveAppraiseNotice(notice));
            }
        } else if data.type_url == notices_appraise::NewVoteNotice::type_url() {
            if let Ok(notice) = notices_appraise::NewVoteNotice::decode(data.value.as_slice()) {
                return Some(Notice::NewVoteNotice(notice));
            }
        } else if data.type_url == notices_appraise::RevokeVoteNotice::type_url() {
            if let Ok(notice) = notices_appraise::RevokeVoteNotice::decode(data.value.as_slice()) {
                return Some(Notice::RevokeVoteNotice(notice));
            }
        }
        None
    }
}

pub mod idea {
    use prost::Message;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::notices_idea;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        KeywordChangeNotice(notices_idea::KeywordChangeNotice),
    }

    pub fn decode_notice(data: &Any) -> Option<Notice> {
        if data.type_url == notices_idea::KeywordChangeNotice::type_url() {
            if let Ok(notice) = notices_idea::KeywordChangeNotice::decode(data.value.as_slice()) {
                return Some(Notice::KeywordChangeNotice(notice));
            }
        }
        None
    }
}

pub mod client {
    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    #[serde(rename_all = "snake_case")]
    pub struct WrongSessionNotice {
        pub name: String, //用于区分发生错误的地方
    }

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    #[serde(rename_all = "snake_case")]
    pub struct SwitchUserNotice {}

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    #[serde(rename_all = "snake_case")]
    pub struct GitPostHookNotice {
        pub project_id: String,
    }

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
    pub enum Notice {
        WrongSessionNotice(WrongSessionNotice),
        SwitchUserNotice(SwitchUserNotice),
        GitPostHookNotice(GitPostHookNotice),
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
pub enum NoticeMessage {
    ProjectNotice(project::Notice),
    ProjectDocNotice(project_doc::Notice),
    IssueNotice(issue::Notice),
    AppraiseNotice(appraise::Notice),
    IdeaNotice(idea::Notice),
    ClientNotice(client::Notice),
}

use proto_gen_rust::google::protobuf::Any;

pub fn decode_notice(data: &Any) -> Option<NoticeMessage> {
    if let Some(ret) = project::decode_notice(data) {
        return Some(NoticeMessage::ProjectNotice(ret));
    }
    if let Some(ret) = project_doc::decode_notice(data) {
        return Some(NoticeMessage::ProjectDocNotice(ret));
    }
    if let Some(ret) = issue::decode_notice(data) {
        return Some(NoticeMessage::IssueNotice(ret));
    }
    if let Some(ret) = appraise::decode_notice(data) {
        return Some(NoticeMessage::AppraiseNotice(ret));
    }
    if let Some(ret) = idea::decode_notice(data) {
        return Some(NoticeMessage::IdeaNotice(ret));
    }
    None
}

pub fn new_wrong_session_notice(name: String) -> NoticeMessage {
    return NoticeMessage::ClientNotice(client::Notice::WrongSessionNotice(
        client::WrongSessionNotice { name: name },
    ));
}

pub fn new_switch_user_notice() -> NoticeMessage {
    return NoticeMessage::ClientNotice(client::Notice::SwitchUserNotice(
        client::SwitchUserNotice {},
    ));
}

pub fn new_git_post_hook_notice(project_id: String) -> NoticeMessage {
    return NoticeMessage::ClientNotice(client::Notice::GitPostHookNotice(
        client::GitPostHookNotice {
            project_id: project_id,
        },
    ));
}
