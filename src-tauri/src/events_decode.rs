pub mod project {
    use prost::Message;
    use proto_gen_rust::events_project;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateProjectEvent(events_project::CreateProjectEvent),
        UpdateProjectEvent(events_project::UpdateProjectEvent),
        OpenProjectEvent(events_project::OpenProjectEvent),
        CloseProjectEvent(events_project::CloseProjectEvent),
        RemoveProjectEvent(events_project::RemoveProjectEvent),
        GenInviteEvent(events_project::GenInviteEvent),
        JoinProjectEvent(events_project::JoinProjectEvent),
        LeaveProjectEvent(events_project::LeaveProjectEvent),
        CreateRoleEvent(events_project::CreateRoleEvent),
        UpdateRoleEvent(events_project::UpdateRoleEvent),
        RemoveRoleEvent(events_project::RemoveRoleEvent),
        UpdateProjectMemberEvent(events_project::UpdateProjectMemberEvent),
        RemoveProjectMemberEvent(events_project::RemoveProjectMemberEvent),
        SetProjectMemberRoleEvent(events_project::SetProjectMemberRoleEvent),
        CreateAppraiseEvent(events_project::CreateAppraiseEvent),
        UpdateAppraiseEvent(events_project::UpdateAppraiseEvent),
        RemoveAppraiseEvent(events_project::RemoveAppraiseEvent),
        ChangeOwnerEvent(events_project::ChangeOwnerEvent),
        CreateEventSubscribeEvent(events_project::CreateEventSubscribeEvent),
        UpdateEventSubscribeEvent(events_project::UpdateEventSubscribeEvent),
        RemoveEventSubscribeEvent(events_project::RemoveEventSubscribeEvent),
        SetAlarmConfigEvent(events_project::SetAlarmConfigEvent),
        CustomEvent(events_project::CustomEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_project::CreateProjectEvent::type_url() {
            if let Ok(ev) = events_project::CreateProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateProjectEvent(ev));
            }
        } else if data.type_url == events_project::UpdateProjectEvent::type_url() {
            if let Ok(ev) = events_project::UpdateProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateProjectEvent(ev));
            }
        } else if data.type_url == events_project::OpenProjectEvent::type_url() {
            if let Ok(ev) = events_project::OpenProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::OpenProjectEvent(ev));
            }
        } else if data.type_url == events_project::CloseProjectEvent::type_url() {
            if let Ok(ev) = events_project::CloseProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::CloseProjectEvent(ev));
            }
        } else if data.type_url == events_project::RemoveProjectEvent::type_url() {
            if let Ok(ev) = events_project::RemoveProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveProjectEvent(ev));
            }
        } else if data.type_url == events_project::GenInviteEvent::type_url() {
            if let Ok(ev) = events_project::GenInviteEvent::decode(data.value.as_slice()) {
                return Some(Event::GenInviteEvent(ev));
            }
        } else if data.type_url == events_project::JoinProjectEvent::type_url() {
            if let Ok(ev) = events_project::JoinProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::JoinProjectEvent(ev));
            }
        } else if data.type_url == events_project::LeaveProjectEvent::type_url() {
            if let Ok(ev) = events_project::LeaveProjectEvent::decode(data.value.as_slice()) {
                return Some(Event::LeaveProjectEvent(ev));
            }
        } else if data.type_url == events_project::CreateRoleEvent::type_url() {
            if let Ok(ev) = events_project::CreateRoleEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateRoleEvent(ev));
            }
        } else if data.type_url == events_project::UpdateRoleEvent::type_url() {
            if let Ok(ev) = events_project::UpdateRoleEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateRoleEvent(ev));
            }
        } else if data.type_url == events_project::RemoveRoleEvent::type_url() {
            if let Ok(ev) = events_project::RemoveRoleEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveRoleEvent(ev));
            }
        } else if data.type_url == events_project::UpdateProjectMemberEvent::type_url() {
            if let Ok(ev) = events_project::UpdateProjectMemberEvent::decode(data.value.as_slice())
            {
                return Some(Event::UpdateProjectMemberEvent(ev));
            }
        } else if data.type_url == events_project::RemoveProjectMemberEvent::type_url() {
            if let Ok(ev) = events_project::RemoveProjectMemberEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveProjectMemberEvent(ev));
            }
        } else if data.type_url == events_project::SetProjectMemberRoleEvent::type_url() {
            if let Ok(ev) = events_project::SetProjectMemberRoleEvent::decode(data.value.as_slice())
            {
                return Some(Event::SetProjectMemberRoleEvent(ev));
            }
        } else if data.type_url == events_project::CreateAppraiseEvent::type_url() {
            if let Ok(ev) = events_project::CreateAppraiseEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateAppraiseEvent(ev));
            }
        } else if data.type_url == events_project::UpdateAppraiseEvent::type_url() {
            if let Ok(ev) = events_project::UpdateAppraiseEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateAppraiseEvent(ev));
            }
        } else if data.type_url == events_project::RemoveAppraiseEvent::type_url() {
            if let Ok(ev) = events_project::RemoveAppraiseEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveAppraiseEvent(ev));
            }
        } else if data.type_url == events_project::ChangeOwnerEvent::type_url() {
            if let Ok(ev) = events_project::ChangeOwnerEvent::decode(data.value.as_slice()) {
                return Some(Event::ChangeOwnerEvent(ev));
            }
        } else if data.type_url == events_project::CreateEventSubscribeEvent::type_url() {
            if let Ok(ev) = events_project::CreateEventSubscribeEvent::decode(data.value.as_slice())
            {
                return Some(Event::CreateEventSubscribeEvent(ev));
            }
        } else if data.type_url == events_project::UpdateEventSubscribeEvent::type_url() {
            if let Ok(ev) = events_project::UpdateEventSubscribeEvent::decode(data.value.as_slice())
            {
                return Some(Event::UpdateEventSubscribeEvent(ev));
            }
        } else if data.type_url == events_project::RemoveEventSubscribeEvent::type_url() {
            if let Ok(ev) = events_project::RemoveEventSubscribeEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveEventSubscribeEvent(ev));
            }
        } else if data.type_url == events_project::SetAlarmConfigEvent::type_url() {
            if let Ok(ev) = events_project::SetAlarmConfigEvent::decode(data.value.as_slice()) {
                return Some(Event::SetAlarmConfigEvent(ev));
            }
        } else if data.type_url == events_project::CustomEvent::type_url() {
            if let Ok(ev) = events_project::CustomEvent::decode(data.value.as_slice()) {
                return Some(Event::CustomEvent(ev));
            }
        }
        None
    }
}

pub mod issue {
    use prost::Message;
    use proto_gen_rust::events_issue;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateEvent(events_issue::CreateEvent),
        UpdateEvent(events_issue::UpdateEvent),
        RemoveEvent(events_issue::RemoveEvent),
        AssignExecUserEvent(events_issue::AssignExecUserEvent),
        AssignCheckUserEvent(events_issue::AssignCheckUserEvent),
        ChangeStateEvent(events_issue::ChangeStateEvent),
        UpdateProcessStageEvent(events_issue::UpdateProcessStageEvent),
        LinkSpritEvent(events_issue::LinkSpritEvent),
        CancelLinkSpritEvent(events_issue::CancelLinkSpritEvent),
        SetStartTimeEvent(events_issue::SetStartTimeEvent),
        SetEndTimeEvent(events_issue::SetEndTimeEvent),
        SetEstimateMinutesEvent(events_issue::SetEstimateMinutesEvent),
        SetRemainMinutesEvent(events_issue::SetRemainMinutesEvent),
        CancelStartTimeEvent(events_issue::CancelStartTimeEvent),
        CancelEndTimeEvent(events_issue::CancelEndTimeEvent),
        CancelEstimateMinutesEvent(events_issue::CancelEstimateMinutesEvent),
        CancelRemainMinutesEvent(events_issue::CancelRemainMinutesEvent),

        CreateSubIssueEvent(events_issue::CreateSubIssueEvent),
        UpdateSubIssueEvent(events_issue::UpdateSubIssueEvent),
        UpdateSubIssueStateEvent(events_issue::UpdateSubIssueStateEvent),
        RemoveSubIssueEvent(events_issue::RemoveSubIssueEvent),
        AddDependenceEvent(events_issue::AddDependenceEvent),
        RemoveDependenceEvent(events_issue::RemoveDependenceEvent),

        SetDeadLineTimeEvent(events_issue::SetDeadLineTimeEvent),
        CancelDeadLineTimeEvent(events_issue::CancelDeadLineTimeEvent),

        UpdateTagEvent(events_issue::UpdateTagEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_issue::CreateEvent::type_url() {
            if let Ok(ev) = events_issue::CreateEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateEvent(ev));
            }
        } else if data.type_url == events_issue::UpdateEvent::type_url() {
            if let Ok(ev) = events_issue::UpdateEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEvent(ev));
            }
        } else if data.type_url == events_issue::RemoveEvent::type_url() {
            if let Ok(ev) = events_issue::RemoveEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveEvent(ev));
            }
        } else if data.type_url == events_issue::AssignExecUserEvent::type_url() {
            if let Ok(ev) = events_issue::AssignExecUserEvent::decode(data.value.as_slice()) {
                return Some(Event::AssignExecUserEvent(ev));
            }
        } else if data.type_url == events_issue::AssignCheckUserEvent::type_url() {
            if let Ok(ev) = events_issue::AssignCheckUserEvent::decode(data.value.as_slice()) {
                return Some(Event::AssignCheckUserEvent(ev));
            }
        } else if data.type_url == events_issue::ChangeStateEvent::type_url() {
            if let Ok(ev) = events_issue::ChangeStateEvent::decode(data.value.as_slice()) {
                return Some(Event::ChangeStateEvent(ev));
            }
        } else if data.type_url == events_issue::UpdateProcessStageEvent::type_url() {
            if let Ok(ev) = events_issue::UpdateProcessStageEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateProcessStageEvent(ev));
            }
        } else if data.type_url == events_issue::LinkSpritEvent::type_url() {
            if let Ok(ev) = events_issue::LinkSpritEvent::decode(data.value.as_slice()) {
                return Some(Event::LinkSpritEvent(ev));
            }
        } else if data.type_url == events_issue::CancelLinkSpritEvent::type_url() {
            if let Ok(ev) = events_issue::CancelLinkSpritEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelLinkSpritEvent(ev));
            }
        } else if data.type_url == events_issue::SetStartTimeEvent::type_url() {
            if let Ok(ev) = events_issue::SetStartTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::SetStartTimeEvent(ev));
            }
        } else if data.type_url == events_issue::SetEndTimeEvent::type_url() {
            if let Ok(ev) = events_issue::SetEndTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::SetEndTimeEvent(ev));
            }
        } else if data.type_url == events_issue::SetEstimateMinutesEvent::type_url() {
            if let Ok(ev) = events_issue::SetEstimateMinutesEvent::decode(data.value.as_slice()) {
                return Some(Event::SetEstimateMinutesEvent(ev));
            }
        } else if data.type_url == events_issue::SetRemainMinutesEvent::type_url() {
            if let Ok(ev) = events_issue::SetRemainMinutesEvent::decode(data.value.as_slice()) {
                return Some(Event::SetRemainMinutesEvent(ev));
            }
        } else if data.type_url == events_issue::CancelStartTimeEvent::type_url() {
            if let Ok(ev) = events_issue::CancelStartTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelStartTimeEvent(ev));
            }
        } else if data.type_url == events_issue::CancelEndTimeEvent::type_url() {
            if let Ok(ev) = events_issue::CancelEndTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelEndTimeEvent(ev));
            }
        } else if data.type_url == events_issue::CancelEstimateMinutesEvent::type_url() {
            if let Ok(ev) = events_issue::CancelEstimateMinutesEvent::decode(data.value.as_slice())
            {
                return Some(Event::CancelEstimateMinutesEvent(ev));
            }
        } else if data.type_url == events_issue::CancelRemainMinutesEvent::type_url() {
            if let Ok(ev) = events_issue::CancelRemainMinutesEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelRemainMinutesEvent(ev));
            }
        } else if data.type_url == events_issue::CreateSubIssueEvent::type_url() {
            if let Ok(ev) = events_issue::CreateSubIssueEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateSubIssueEvent(ev));
            }
        } else if data.type_url == events_issue::UpdateSubIssueEvent::type_url() {
            if let Ok(ev) = events_issue::UpdateSubIssueEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateSubIssueEvent(ev));
            }
        } else if data.type_url == events_issue::UpdateSubIssueStateEvent::type_url() {
            if let Ok(ev) = events_issue::UpdateSubIssueStateEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateSubIssueStateEvent(ev));
            }
        } else if data.type_url == events_issue::RemoveSubIssueEvent::type_url() {
            if let Ok(ev) = events_issue::RemoveSubIssueEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveSubIssueEvent(ev));
            }
        } else if data.type_url == events_issue::AddDependenceEvent::type_url() {
            if let Ok(ev) = events_issue::AddDependenceEvent::decode(data.value.as_slice()) {
                return Some(Event::AddDependenceEvent(ev));
            }
        } else if data.type_url == events_issue::RemoveDependenceEvent::type_url() {
            if let Ok(ev) = events_issue::RemoveDependenceEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveDependenceEvent(ev));
            }
        } else if data.type_url == events_issue::SetDeadLineTimeEvent::type_url() {
            if let Ok(ev) = events_issue::SetDeadLineTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::SetDeadLineTimeEvent(ev));
            }
        } else if data.type_url == events_issue::CancelDeadLineTimeEvent::type_url() {
            if let Ok(ev) = events_issue::CancelDeadLineTimeEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelDeadLineTimeEvent(ev));
            }
        } else if data.type_url == events_issue::UpdateTagEvent::type_url() {
            if let Ok(ev) = events_issue::UpdateTagEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateTagEvent(ev));
            }
        }
        None
    }
}

pub mod ext_event {
    use prost::Message;
    use proto_gen_rust::events_external_event;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateEvent(events_external_event::CreateEvent),
        UpdateEvent(events_external_event::UpdateEvent),
        GetSecretEvent(events_external_event::GetSecretEvent),
        RemoveEvent(events_external_event::RemoveEvent),
        SetSourceUserPolicyEvent(events_external_event::SetSourceUserPolicyEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_external_event::CreateEvent::type_url() {
            if let Ok(ev) = events_external_event::CreateEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateEvent(ev));
            }
        } else if data.type_url == events_external_event::UpdateEvent::type_url() {
            if let Ok(ev) = events_external_event::UpdateEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEvent(ev));
            }
        } else if data.type_url == events_external_event::GetSecretEvent::type_url() {
            if let Ok(ev) = events_external_event::GetSecretEvent::decode(data.value.as_slice()) {
                return Some(Event::GetSecretEvent(ev));
            }
        } else if data.type_url == events_external_event::RemoveEvent::type_url() {
            if let Ok(ev) = events_external_event::RemoveEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveEvent(ev));
            }
        } else if data.type_url == events_external_event::SetSourceUserPolicyEvent::type_url() {
            if let Ok(ev) =
                events_external_event::SetSourceUserPolicyEvent::decode(data.value.as_slice())
            {
                return Some(Event::SetSourceUserPolicyEvent(ev));
            }
        }
        None
    }
}

pub mod gogs {
    use prost::Message;
    use proto_gen_rust::events_gogs;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateEvent(events_gogs::CreateEvent),
        DeleteEvent(events_gogs::DeleteEvent),
        ForkEvent(events_gogs::ForkEvent),
        IssueCommentEvent(events_gogs::IssueCommentEvent),
        IssueEvent(events_gogs::IssueEvent),
        PullRequestEvent(events_gogs::PullRequestEvent),
        PushEvent(events_gogs::PushEvent),
        ReleaseEvent(events_gogs::ReleaseEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_gogs::CreateEvent::type_url() {
            if let Ok(ev) = events_gogs::CreateEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateEvent(ev));
            }
        } else if data.type_url == events_gogs::DeleteEvent::type_url() {
            if let Ok(ev) = events_gogs::DeleteEvent::decode(data.value.as_slice()) {
                return Some(Event::DeleteEvent(ev));
            }
        } else if data.type_url == events_gogs::ForkEvent::type_url() {
            if let Ok(ev) = events_gogs::ForkEvent::decode(data.value.as_slice()) {
                return Some(Event::ForkEvent(ev));
            }
        } else if data.type_url == events_gogs::IssueCommentEvent::type_url() {
            if let Ok(ev) = events_gogs::IssueCommentEvent::decode(data.value.as_slice()) {
                return Some(Event::IssueCommentEvent(ev));
            }
        } else if data.type_url == events_gogs::IssueEvent::type_url() {
            if let Ok(ev) = events_gogs::IssueEvent::decode(data.value.as_slice()) {
                return Some(Event::IssueEvent(ev));
            }
        } else if data.type_url == events_gogs::PullRequestEvent::type_url() {
            if let Ok(ev) = events_gogs::PullRequestEvent::decode(data.value.as_slice()) {
                return Some(Event::PullRequestEvent(ev));
            }
        } else if data.type_url == events_gogs::PushEvent::type_url() {
            if let Ok(ev) = events_gogs::PushEvent::decode(data.value.as_slice()) {
                return Some(Event::PushEvent(ev));
            }
        } else if data.type_url == events_gogs::ReleaseEvent::type_url() {
            if let Ok(ev) = events_gogs::ReleaseEvent::decode(data.value.as_slice()) {
                return Some(Event::ReleaseEvent(ev));
            }
        }
        None
    }
}

pub mod gitlab {
    use prost::Message;
    use proto_gen_rust::events_gitlab;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        BuildEvent(events_gitlab::BuildEvent),
        CommentEvent(events_gitlab::CommentEvent),
        IssueEvent(events_gitlab::IssueEvent),
        JobEvent(events_gitlab::JobEvent),
        MergeRequestEvent(events_gitlab::MergeRequestEvent),
        PipelineEvent(events_gitlab::PipelineEvent),
        PushEvent(events_gitlab::PushEvent),
        TagEvent(events_gitlab::TagEvent),
        WikiEvent(events_gitlab::WikiEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_gitlab::BuildEvent::type_url() {
            if let Ok(ev) = events_gitlab::BuildEvent::decode(data.value.as_slice()) {
                return Some(Event::BuildEvent(ev));
            }
        } else if data.type_url == events_gitlab::CommentEvent::type_url() {
            if let Ok(ev) = events_gitlab::CommentEvent::decode(data.value.as_slice()) {
                return Some(Event::CommentEvent(ev));
            }
        } else if data.type_url == events_gitlab::IssueEvent::type_url() {
            if let Ok(ev) = events_gitlab::IssueEvent::decode(data.value.as_slice()) {
                return Some(Event::IssueEvent(ev));
            }
        } else if data.type_url == events_gitlab::JobEvent::type_url() {
            if let Ok(ev) = events_gitlab::JobEvent::decode(data.value.as_slice()) {
                return Some(Event::JobEvent(ev));
            }
        } else if data.type_url == events_gitlab::MergeRequestEvent::type_url() {
            if let Ok(ev) = events_gitlab::MergeRequestEvent::decode(data.value.as_slice()) {
                return Some(Event::MergeRequestEvent(ev));
            }
        } else if data.type_url == events_gitlab::PipelineEvent::type_url() {
            if let Ok(ev) = events_gitlab::PipelineEvent::decode(data.value.as_slice()) {
                return Some(Event::PipelineEvent(ev));
            }
        } else if data.type_url == events_gitlab::PushEvent::type_url() {
            if let Ok(ev) = events_gitlab::PushEvent::decode(data.value.as_slice()) {
                return Some(Event::PushEvent(ev));
            }
        } else if data.type_url == events_gitlab::TagEvent::type_url() {
            if let Ok(ev) = events_gitlab::TagEvent::decode(data.value.as_slice()) {
                return Some(Event::TagEvent(ev));
            }
        } else if data.type_url == events_gitlab::WikiEvent::type_url() {
            if let Ok(ev) = events_gitlab::WikiEvent::decode(data.value.as_slice()) {
                return Some(Event::WikiEvent(ev));
            }
        }

        None
    }
}

pub mod gitee {
    use prost::Message;
    use proto_gen_rust::events_gitee;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        PushEvent(events_gitee::PushEvent),
        IssueEvent(events_gitee::IssueEvent),
        PullRequestEvent(events_gitee::PullRequestEvent),
        NoteEvent(events_gitee::NoteEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_gitee::PushEvent::type_url() {
            if let Ok(ev) = events_gitee::PushEvent::decode(data.value.as_slice()) {
                return Some(Event::PushEvent(ev));
            }
        } else if data.type_url == events_gitee::IssueEvent::type_url() {
            if let Ok(ev) = events_gitee::IssueEvent::decode(data.value.as_slice()) {
                return Some(Event::IssueEvent(ev));
            }
        } else if data.type_url == events_gitee::PullRequestEvent::type_url() {
            if let Ok(ev) = events_gitee::PullRequestEvent::decode(data.value.as_slice()) {
                return Some(Event::PullRequestEvent(ev));
            }
        } else if data.type_url == events_gitee::NoteEvent::type_url() {
            if let Ok(ev) = events_gitee::NoteEvent::decode(data.value.as_slice()) {
                return Some(Event::NoteEvent(ev));
            }
        }
        None
    }
}

pub mod requirement {
    use prost::Message;
    use proto_gen_rust::events_requirement;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateRequirementEvent(events_requirement::CreateRequirementEvent),
        UpdateRequirementEvent(events_requirement::UpdateRequirementEvent),
        RemoveRequirementEvent(events_requirement::RemoveRequirementEvent),
        LinkIssueEvent(events_requirement::LinkIssueEvent),
        UnlinkIssueEvent(events_requirement::UnlinkIssueEvent),
        CloseRequirementEvent(events_requirement::CloseRequirementEvent),
        OpenRequirementEvent(events_requirement::OpenRequirementEvent),
        SetKanoInfoEvent(events_requirement::SetKanoInfoEvent),
        SetFourQInfoEvent(events_requirement::SetFourQInfoEvent),
        UpdateTagEvent(events_requirement::UpdateTagEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_requirement::CreateRequirementEvent::type_url() {
            if let Ok(ev) =
                events_requirement::CreateRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::CreateRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::UpdateRequirementEvent::type_url() {
            if let Ok(ev) =
                events_requirement::UpdateRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::UpdateRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::RemoveRequirementEvent::type_url() {
            if let Ok(ev) =
                events_requirement::RemoveRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::RemoveRequirementEvent::type_url() {
            if let Ok(ev) =
                events_requirement::RemoveRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::LinkIssueEvent::type_url() {
            if let Ok(ev) = events_requirement::LinkIssueEvent::decode(data.value.as_slice()) {
                return Some(Event::LinkIssueEvent(ev));
            }
        } else if data.type_url == events_requirement::UnlinkIssueEvent::type_url() {
            if let Ok(ev) = events_requirement::UnlinkIssueEvent::decode(data.value.as_slice()) {
                return Some(Event::UnlinkIssueEvent(ev));
            }
        } else if data.type_url == events_requirement::CloseRequirementEvent::type_url() {
            if let Ok(ev) = events_requirement::CloseRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::CloseRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::OpenRequirementEvent::type_url() {
            if let Ok(ev) = events_requirement::OpenRequirementEvent::decode(data.value.as_slice())
            {
                return Some(Event::OpenRequirementEvent(ev));
            }
        } else if data.type_url == events_requirement::SetKanoInfoEvent::type_url() {
            if let Ok(ev) = events_requirement::SetKanoInfoEvent::decode(data.value.as_slice()) {
                return Some(Event::SetKanoInfoEvent(ev));
            }
        } else if data.type_url == events_requirement::SetFourQInfoEvent::type_url() {
            if let Ok(ev) = events_requirement::SetFourQInfoEvent::decode(data.value.as_slice()) {
                return Some(Event::SetFourQInfoEvent(ev));
            }
        } else if data.type_url == events_requirement::UpdateTagEvent::type_url() {
            if let Ok(ev) = events_requirement::UpdateTagEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateTagEvent(ev));
            }
        }
        None
    }
}

pub mod code {
    use prost::Message;
    use proto_gen_rust::events_code;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        AddCommentEvent(events_code::AddCommentEvent),
        UpdateCommentEvent(events_code::UpdateCommentEvent),
        RemoveCommentEvent(events_code::RemoveCommentEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_code::AddCommentEvent::type_url() {
            if let Ok(ev) = events_code::AddCommentEvent::decode(data.value.as_slice()) {
                return Some(Event::AddCommentEvent(ev));
            }
        } else if data.type_url == events_code::UpdateCommentEvent::type_url() {
            if let Ok(ev) = events_code::UpdateCommentEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateCommentEvent(ev));
            }
        } else if data.type_url == events_code::RemoveCommentEvent::type_url() {
            if let Ok(ev) = events_code::RemoveCommentEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveCommentEvent(ev));
            }
        }
        None
    }
}

pub mod idea {
    use prost::Message;
    use proto_gen_rust::events_idea;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateIdeaEvent(events_idea::CreateIdeaEvent),
        UpdateIdeaContentEvent(events_idea::UpdateIdeaContentEvent),
        UpdateIdeaTagEvent(events_idea::UpdateIdeaTagEvent),
        UpdateIdeaKeywordEvent(events_idea::UpdateIdeaKeywordEvent),
        LockIdeaEvent(events_idea::LockIdeaEvent),
        UnlockIdeaEvent(events_idea::UnlockIdeaEvent),
        RemoveIdeaEvent(events_idea::RemoveIdeaEvent),
        SetAppraiseEvent(events_idea::SetAppraiseEvent),
        CancelAppraiseEvent(events_idea::CancelAppraiseEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_idea::CreateIdeaEvent::type_url() {
            if let Ok(ev) = events_idea::CreateIdeaEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateIdeaEvent(ev));
            }
        } else if data.type_url == events_idea::UpdateIdeaContentEvent::type_url() {
            if let Ok(ev) = events_idea::UpdateIdeaContentEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateIdeaContentEvent(ev));
            }
        } else if data.type_url == events_idea::UpdateIdeaTagEvent::type_url() {
            if let Ok(ev) = events_idea::UpdateIdeaTagEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateIdeaTagEvent(ev));
            }
        } else if data.type_url == events_idea::UpdateIdeaKeywordEvent::type_url() {
            if let Ok(ev) = events_idea::UpdateIdeaKeywordEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateIdeaKeywordEvent(ev));
            }
        } else if data.type_url == events_idea::LockIdeaEvent::type_url() {
            if let Ok(ev) = events_idea::LockIdeaEvent::decode(data.value.as_slice()) {
                return Some(Event::LockIdeaEvent(ev));
            }
        } else if data.type_url == events_idea::UnlockIdeaEvent::type_url() {
            if let Ok(ev) = events_idea::UnlockIdeaEvent::decode(data.value.as_slice()) {
                return Some(Event::UnlockIdeaEvent(ev));
            }
        } else if data.type_url == events_idea::RemoveIdeaEvent::type_url() {
            if let Ok(ev) = events_idea::RemoveIdeaEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveIdeaEvent(ev));
            }
        } else if data.type_url == events_idea::SetAppraiseEvent::type_url() {
            if let Ok(ev) = events_idea::SetAppraiseEvent::decode(data.value.as_slice()) {
                return Some(Event::SetAppraiseEvent(ev));
            }
        } else if data.type_url == events_idea::CancelAppraiseEvent::type_url() {
            if let Ok(ev) = events_idea::CancelAppraiseEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelAppraiseEvent(ev));
            }
        }
        None
    }
}

pub mod data_anno {
    use prost::Message;
    use proto_gen_rust::events_data_anno;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateAnnoProjectEvent(events_data_anno::CreateAnnoProjectEvent),
        RemoveAnnoProjectEvent(events_data_anno::RemoveAnnoProjectEvent),
        AddAnnoMemberEvent(events_data_anno::AddAnnoMemberEvent),
        RemoveAnnoMemberEvent(events_data_anno::RemoveAnnoMemberEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_data_anno::CreateAnnoProjectEvent::type_url() {
            if let Ok(ev) = events_data_anno::CreateAnnoProjectEvent::decode(data.value.as_slice())
            {
                return Some(Event::CreateAnnoProjectEvent(ev));
            }
        } else if data.type_url == events_data_anno::RemoveAnnoProjectEvent::type_url() {
            if let Ok(ev) = events_data_anno::RemoveAnnoProjectEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveAnnoProjectEvent(ev));
            }
        } else if data.type_url == events_data_anno::AddAnnoMemberEvent::type_url() {
            if let Ok(ev) = events_data_anno::AddAnnoMemberEvent::decode(data.value.as_slice()) {
                return Some(Event::AddAnnoMemberEvent(ev));
            }
        } else if data.type_url == events_data_anno::RemoveAnnoMemberEvent::type_url() {
            if let Ok(ev) = events_data_anno::RemoveAnnoMemberEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveAnnoMemberEvent(ev));
            }
        }
        None
    }
}

pub mod api_collection {
    use prost::Message;
    use proto_gen_rust::events_api_collection;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateApiCollectionEvent(events_api_collection::CreateApiCollectionEvent),
        RemoveApiCollectionEvent(events_api_collection::RemoveApiCollectionEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_api_collection::CreateApiCollectionEvent::type_url() {
            if let Ok(ev) =
                events_api_collection::CreateApiCollectionEvent::decode(data.value.as_slice())
            {
                return Some(Event::CreateApiCollectionEvent(ev));
            }
        } else if data.type_url == events_api_collection::RemoveApiCollectionEvent::type_url() {
            if let Ok(ev) =
                events_api_collection::RemoveApiCollectionEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveApiCollectionEvent(ev));
            }
        }
        None
    }
}

pub mod atomgit {
    use prost::Message;
    use proto_gen_rust::events_atomgit;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        IssueEvent(events_atomgit::IssueEvent),
        PushEvent(events_atomgit::PushEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_atomgit::IssueEvent::type_url() {
            if let Ok(ev) = events_atomgit::IssueEvent::decode(data.value.as_slice()) {
                return Some(Event::IssueEvent(ev));
            }
        } else if data.type_url == events_atomgit::PushEvent::type_url() {
            if let Ok(ev) = events_atomgit::PushEvent::decode(data.value.as_slice()) {
                return Some(Event::PushEvent(ev));
            }
        }
        None
    }
}

pub mod cicd {
    use prost::Message;
    use proto_gen_rust::events_cicd;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreatePipeLineEvent(events_cicd::CreatePipeLineEvent),
        RemovePipeLineEvent(events_cicd::RemovePipeLineEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_cicd::CreatePipeLineEvent::type_url() {
            if let Ok(ev) = events_cicd::CreatePipeLineEvent::decode(data.value.as_slice()) {
                return Some(Event::CreatePipeLineEvent(ev));
            }
        } else if data.type_url == events_cicd::RemovePipeLineEvent::type_url() {
            if let Ok(ev) = events_cicd::RemovePipeLineEvent::decode(data.value.as_slice()) {
                return Some(Event::RemovePipeLineEvent(ev));
            }
        }
        None
    }
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub enum EventMessage {
    ProjectEvent(project::Event),
    IssueEvent(issue::Event),
    ExtEvEvent(ext_event::Event),
    GitlabEvent(gitlab::Event),
    GogsEvent(gogs::Event),
    GiteeEvent(gitee::Event),
    RequirementEvent(requirement::Event),
    CodeEvent(code::Event),
    IdeaEvent(idea::Event),
    DataAnnoEvent(data_anno::Event),
    ApiCollectionEvent(api_collection::Event),
    AtomgitEvent(atomgit::Event),
    CiCdEvent(cicd::Event),
    NoopEvent(),
}

use proto_gen_rust::google::protobuf::Any;

pub fn decode_event(data: &Any) -> Option<EventMessage> {
    if let Some(ret) = project::decode_event(data) {
        return Some(EventMessage::ProjectEvent(ret));
    }
    if let Some(ret) = issue::decode_event(data) {
        return Some(EventMessage::IssueEvent(ret));
    }
    if let Some(ret) = ext_event::decode_event(data) {
        return Some(EventMessage::ExtEvEvent(ret));
    }
    if let Some(ret) = gitlab::decode_event(data) {
        return Some(EventMessage::GitlabEvent(ret));
    }
    if let Some(ret) = gogs::decode_event(data) {
        return Some(EventMessage::GogsEvent(ret));
    }
    if let Some(ret) = gitee::decode_event(data) {
        return Some(EventMessage::GiteeEvent(ret));
    }
    if let Some(ret) = requirement::decode_event(data) {
        return Some(EventMessage::RequirementEvent(ret));
    }
    if let Some(ret) = code::decode_event(data) {
        return Some(EventMessage::CodeEvent(ret));
    }
    if let Some(ret) = idea::decode_event(data) {
        return Some(EventMessage::IdeaEvent(ret));
    }
    if let Some(ret) = data_anno::decode_event(data) {
        return Some(EventMessage::DataAnnoEvent(ret));
    }
    if let Some(ret) = api_collection::decode_event(data) {
        return Some(EventMessage::ApiCollectionEvent(ret));
    }
    if let Some(ret) = atomgit::decode_event(data) {
        return Some(EventMessage::AtomgitEvent(ret));
    }
    if let Some(ret) = cicd::decode_event(data) {
        return Some(EventMessage::CiCdEvent(ret));
    }
    Some(EventMessage::NoopEvent())
}
