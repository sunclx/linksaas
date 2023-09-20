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
        CreateChannelEvent(events_project::CreateChannelEvent),
        UpdateChannelEvent(events_project::UpdateChannelEvent),
        OpenChannelEvent(events_project::OpenChannelEvent),
        CloseChannelEvent(events_project::CloseChannelEvent),
        RemoveChannelEvent(events_project::RemoveChannelEvent),
        AddChannelMemberEvent(events_project::AddChannelMemberEvent),
        RemoveChannelMemberEvent(events_project::RemoveChannelMemberEvent),
        CreateAppraiseEvent(events_project::CreateAppraiseEvent),
        UpdateAppraiseEvent(events_project::UpdateAppraiseEvent),
        RemoveAppraiseEvent(events_project::RemoveAppraiseEvent),
        AddProjectAppEvent(events_project::AddProjectAppEvent),
        RemoveProjectAppEvent(events_project::RemoveProjectAppEvent),
        CreateGoalEvent(events_project::CreateGoalEvent),
        UpdateGoalEvent(events_project::UpdateGoalEvent),
        RemoveGoalEvent(events_project::RemoveGoalEvent),
        LockGoalEvent(events_project::LockGoalEvent),
        UnlockGoalEvent(events_project::UnlockGoalEvent),
        ChangeOwnerEvent(events_project::ChangeOwnerEvent),
        CreateEventSubscribeEvent(events_project::CreateEventSubscribeEvent),
        UpdateEventSubscribeEvent(events_project::UpdateEventSubscribeEvent),
        RemoveEventSubscribeEvent(events_project::RemoveEventSubscribeEvent),
        WatchChannelEvent(events_project::WatchChannelEvent),
        UnWatchChannelEvent(events_project::UnWatchChannelEvent),
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
        } else if data.type_url == events_project::CreateChannelEvent::type_url() {
            if let Ok(ev) = events_project::CreateChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateChannelEvent(ev));
            }
        } else if data.type_url == events_project::UpdateChannelEvent::type_url() {
            if let Ok(ev) = events_project::UpdateChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateChannelEvent(ev));
            }
        } else if data.type_url == events_project::OpenChannelEvent::type_url() {
            if let Ok(ev) = events_project::OpenChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::OpenChannelEvent(ev));
            }
        } else if data.type_url == events_project::CloseChannelEvent::type_url() {
            if let Ok(ev) = events_project::CloseChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::CloseChannelEvent(ev));
            }
        } else if data.type_url == events_project::RemoveChannelEvent::type_url() {
            if let Ok(ev) = events_project::RemoveChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveChannelEvent(ev));
            }
        } else if data.type_url == events_project::AddChannelMemberEvent::type_url() {
            if let Ok(ev) = events_project::AddChannelMemberEvent::decode(data.value.as_slice()) {
                return Some(Event::AddChannelMemberEvent(ev));
            }
        } else if data.type_url == events_project::RemoveChannelMemberEvent::type_url() {
            if let Ok(ev) = events_project::RemoveChannelMemberEvent::decode(data.value.as_slice())
            {
                return Some(Event::RemoveChannelMemberEvent(ev));
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
        } else if data.type_url == events_project::AddProjectAppEvent::type_url() {
            if let Ok(ev) = events_project::AddProjectAppEvent::decode(data.value.as_slice()) {
                return Some(Event::AddProjectAppEvent(ev));
            }
        } else if data.type_url == events_project::RemoveProjectAppEvent::type_url() {
            if let Ok(ev) = events_project::RemoveProjectAppEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveProjectAppEvent(ev));
            }
        } else if data.type_url == events_project::CreateGoalEvent::type_url() {
            if let Ok(ev) = events_project::CreateGoalEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateGoalEvent(ev));
            }
        } else if data.type_url == events_project::UpdateGoalEvent::type_url() {
            if let Ok(ev) = events_project::UpdateGoalEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateGoalEvent(ev));
            }
        } else if data.type_url == events_project::RemoveGoalEvent::type_url() {
            if let Ok(ev) = events_project::RemoveGoalEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveGoalEvent(ev));
            }
        } else if data.type_url == events_project::LockGoalEvent::type_url() {
            if let Ok(ev) = events_project::LockGoalEvent::decode(data.value.as_slice()) {
                return Some(Event::LockGoalEvent(ev));
            }
        } else if data.type_url == events_project::UnlockGoalEvent::type_url() {
            if let Ok(ev) = events_project::UnlockGoalEvent::decode(data.value.as_slice()) {
                return Some(Event::UnlockGoalEvent(ev));
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
        } else if data.type_url == events_project::WatchChannelEvent::type_url() {
            if let Ok(ev) = events_project::WatchChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::WatchChannelEvent(ev));
            }
        } else if data.type_url == events_project::UnWatchChannelEvent::type_url() {
            if let Ok(ev) = events_project::UnWatchChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::UnWatchChannelEvent(ev));
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

pub mod project_doc {
    use prost::Message;
    use proto_gen_rust::events_doc;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateSpaceEvent(events_doc::CreateSpaceEvent),
        UpdateSpaceEvent(events_doc::UpdateSpaceEvent),
        RemoveSpaceEvent(events_doc::RemoveSpaceEvent),
        CreateDocEvent(events_doc::CreateDocEvent),
        UpdateDocEvent(events_doc::UpdateDocEvent),
        MoveDocToRecycleEvent(events_doc::MoveDocToRecycleEvent),
        MoveDocEvent(events_doc::MoveDocEvent),
        RemoveDocEvent(events_doc::RemoveDocEvent),
        RecoverDocEvent(events_doc::RecoverDocEvent),
        WatchDocEvent(events_doc::WatchDocEvent),
        UnWatchDocEvent(events_doc::UnWatchDocEvent),
        UpdateTagEvent(events_doc::UpdateTagEvent),
    }
    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_doc::CreateSpaceEvent::type_url() {
            if let Ok(ev) = events_doc::CreateSpaceEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateSpaceEvent(ev));
            }
        } else if data.type_url == events_doc::UpdateSpaceEvent::type_url() {
            if let Ok(ev) = events_doc::UpdateSpaceEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateSpaceEvent(ev));
            }
        } else if data.type_url == events_doc::RemoveSpaceEvent::type_url() {
            if let Ok(ev) = events_doc::RemoveSpaceEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveSpaceEvent(ev));
            }
        } else if data.type_url == events_doc::CreateDocEvent::type_url() {
            if let Ok(ev) = events_doc::CreateDocEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateDocEvent(ev));
            }
        } else if data.type_url == events_doc::UpdateDocEvent::type_url() {
            if let Ok(ev) = events_doc::UpdateDocEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateDocEvent(ev));
            }
        } else if data.type_url == events_doc::MoveDocToRecycleEvent::type_url() {
            if let Ok(ev) = events_doc::MoveDocToRecycleEvent::decode(data.value.as_slice()) {
                return Some(Event::MoveDocToRecycleEvent(ev));
            }
        } else if data.type_url == events_doc::MoveDocEvent::type_url() {
            if let Ok(ev) = events_doc::MoveDocEvent::decode(data.value.as_slice()) {
                return Some(Event::MoveDocEvent(ev));
            }
        } else if data.type_url == events_doc::RemoveDocEvent::type_url() {
            if let Ok(ev) = events_doc::RemoveDocEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveDocEvent(ev));
            }
        } else if data.type_url == events_doc::RecoverDocEvent::type_url() {
            if let Ok(ev) = events_doc::RecoverDocEvent::decode(data.value.as_slice()) {
                return Some(Event::RecoverDocEvent(ev));
            }
        } else if data.type_url == events_doc::WatchDocEvent::type_url() {
            if let Ok(ev) = events_doc::WatchDocEvent::decode(data.value.as_slice()) {
                return Some(Event::WatchDocEvent(ev));
            }
        } else if data.type_url == events_doc::UnWatchDocEvent::type_url() {
            if let Ok(ev) = events_doc::UnWatchDocEvent::decode(data.value.as_slice()) {
                return Some(Event::UnWatchDocEvent(ev));
            }
        } else if data.type_url == events_doc::UpdateTagEvent::type_url() {
            if let Ok(ev) = events_doc::UpdateTagEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateTagEvent(ev));
            }
        }
        None
    }
}

pub mod sprit {
    use prost::Message;
    use proto_gen_rust::events_sprit;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateEvent(events_sprit::CreateEvent),
        UpdateEvent(events_sprit::UpdateEvent),
        RemoveEvent(events_sprit::RemoveEvent),
        WatchEvent(events_sprit::WatchEvent),
        UnWatchEvent(events_sprit::UnWatchEvent),
        LinkDocEvent(events_sprit::LinkDocEvent),
        CancelLinkDocEvent(events_sprit::CancelLinkDocEvent),
        LinkChannelEvent(events_sprit::LinkChannelEvent),
        CancelLinkChannelEvent(events_sprit::CancelLinkChannelEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_sprit::CreateEvent::type_url() {
            if let Ok(ev) = events_sprit::CreateEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateEvent(ev));
            }
        } else if data.type_url == events_sprit::UpdateEvent::type_url() {
            if let Ok(ev) = events_sprit::UpdateEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEvent(ev));
            }
        } else if data.type_url == events_sprit::RemoveEvent::type_url() {
            if let Ok(ev) = events_sprit::RemoveEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveEvent(ev));
            }
        } else if data.type_url == events_sprit::WatchEvent::type_url() {
            if let Ok(ev) = events_sprit::WatchEvent::decode(data.value.as_slice()) {
                return Some(Event::WatchEvent(ev));
            }
        } else if data.type_url == events_sprit::UnWatchEvent::type_url() {
            if let Ok(ev) = events_sprit::UnWatchEvent::decode(data.value.as_slice()) {
                return Some(Event::UnWatchEvent(ev));
            }
        } else if data.type_url == events_sprit::LinkDocEvent::type_url() {
            if let Ok(ev) = events_sprit::LinkDocEvent::decode(data.value.as_slice()) {
                return Some(Event::LinkDocEvent(ev));
            }
        } else if data.type_url == events_sprit::CancelLinkDocEvent::type_url() {
            if let Ok(ev) = events_sprit::CancelLinkDocEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelLinkDocEvent(ev));
            }
        } else if data.type_url == events_sprit::LinkChannelEvent::type_url() {
            if let Ok(ev) = events_sprit::LinkChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::LinkChannelEvent(ev));
            }
        } else if data.type_url == events_sprit::CancelLinkChannelEvent::type_url() {
            if let Ok(ev) = events_sprit::CancelLinkChannelEvent::decode(data.value.as_slice()) {
                return Some(Event::CancelLinkChannelEvent(ev));
            }
        }
        None
    }
}


pub mod book_shelf {
    use prost::Message;
    use proto_gen_rust::events_book_shelf;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        AddBookEvent(events_book_shelf::AddBookEvent),
        RemoveBookEvent(events_book_shelf::RemoveBookEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_book_shelf::AddBookEvent::type_url() {
            if let Ok(ev) = events_book_shelf::AddBookEvent::decode(data.value.as_slice()) {
                return Some(Event::AddBookEvent(ev));
            }
        } else if data.type_url == events_book_shelf::RemoveBookEvent::type_url() {
            if let Ok(ev) = events_book_shelf::RemoveBookEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveBookEvent(ev));
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

pub mod robot {
    use prost::Message;
    use proto_gen_rust::events_robot;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateEvent(events_robot::CreateEvent),
        UpdateEvent(events_robot::UpdateEvent),
        RemoveEvent(events_robot::RemoveEvent),
        AddAccessUserEvent(events_robot::AddAccessUserEvent),
        RemoveAccessUserEvent(events_robot::RemoveAccessUserEvent),
        RenewTokenEvent(events_robot::RenewTokenEvent),
    }
    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_robot::CreateEvent::type_url() {
            if let Ok(ev) = events_robot::CreateEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateEvent(ev));
            }
        } else if data.type_url == events_robot::UpdateEvent::type_url() {
            if let Ok(ev) = events_robot::UpdateEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEvent(ev));
            }
        } else if data.type_url == events_robot::RemoveEvent::type_url() {
            if let Ok(ev) = events_robot::RemoveEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveEvent(ev));
            }
        } else if data.type_url == events_robot::AddAccessUserEvent::type_url() {
            if let Ok(ev) = events_robot::AddAccessUserEvent::decode(data.value.as_slice()) {
                return Some(Event::AddAccessUserEvent(ev));
            }
        } else if data.type_url == events_robot::RemoveAccessUserEvent::type_url() {
            if let Ok(ev) = events_robot::RemoveAccessUserEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveAccessUserEvent(ev));
            }
        } else if data.type_url == events_robot::RenewTokenEvent::type_url() {
            if let Ok(ev) = events_robot::RenewTokenEvent::decode(data.value.as_slice()) {
                return Some(Event::RenewTokenEvent(ev));
            }
        }
        None
    }
}

pub mod earthly {
    use prost::Message;
    use proto_gen_rust::events_earthly;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        AddRepoEvent(events_earthly::AddRepoEvent),
        RemoveRepoEvent(events_earthly::RemoveRepoEvent),
        CreateActionEvent(events_earthly::CreateActionEvent),
        UpdateActionEvent(events_earthly::UpdateActionEvent),
        RemoveActionEvent(events_earthly::RemoveActionEvent),
        ExecEvent(events_earthly::ExecEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_earthly::AddRepoEvent::type_url() {
            if let Ok(ev) = events_earthly::AddRepoEvent::decode(data.value.as_slice()) {
                return Some(Event::AddRepoEvent(ev));
            }
        } else if data.type_url == events_earthly::RemoveRepoEvent::type_url() {
            if let Ok(ev) = events_earthly::RemoveRepoEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveRepoEvent(ev));
            }
        } else if data.type_url == events_earthly::CreateActionEvent::type_url() {
            if let Ok(ev) = events_earthly::CreateActionEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateActionEvent(ev));
            }
        } else if data.type_url == events_earthly::UpdateActionEvent::type_url() {
            if let Ok(ev) = events_earthly::UpdateActionEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateActionEvent(ev));
            }
        } else if data.type_url == events_earthly::RemoveActionEvent::type_url() {
            if let Ok(ev) = events_earthly::RemoveActionEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveActionEvent(ev));
            }
        } else if data.type_url == events_earthly::ExecEvent::type_url() {
            if let Ok(ev) = events_earthly::ExecEvent::decode(data.value.as_slice()) {
                return Some(Event::ExecEvent(ev));
            }
        }

        None
    }
}

pub mod script {
    use prost::Message;
    use proto_gen_rust::events_script;
    use proto_gen_rust::google::protobuf::Any;
    use proto_gen_rust::TypeUrl;

    #[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
    pub enum Event {
        CreateScriptSuiteEvent(events_script::CreateScriptSuiteEvent),
        RemoveScriptSuiteEvent(events_script::RemoveScriptSuiteEvent),
        UpdateScriptSuiteNameEvent(events_script::UpdateScriptSuiteNameEvent),
        UpdateEnvPermEvent(events_script::UpdateEnvPermEvent),
        UpdateSysPermEvent(events_script::UpdateSysPermEvent),
        UpdateNetPermEvent(events_script::UpdateNetPermEvent),
        UpdateReadPermEvent(events_script::UpdateReadPermEvent),
        UpdateWritePermEvent(events_script::UpdateWritePermEvent),
        UpdateRunPermEvent(events_script::UpdateRunPermEvent),
        UpdateScriptEvent(events_script::UpdateScriptEvent),
        UpdateExecUserEvent(events_script::UpdateExecUserEvent),
        UpdateEnvParamDefEvent(events_script::UpdateEnvParamDefEvent),
        UpdateArgParamDefEvent(events_script::UpdateArgParamDefEvent),
        RecoverScriptEvent(events_script::RecoverScriptEvent),
        ExecEvent(events_script::ExecEvent),
    }

    pub fn decode_event(data: &Any) -> Option<Event> {
        if data.type_url == events_script::CreateScriptSuiteEvent::type_url() {
            if let Ok(ev) = events_script::CreateScriptSuiteEvent::decode(data.value.as_slice()) {
                return Some(Event::CreateScriptSuiteEvent(ev));
            }
        } else if data.type_url == events_script::RemoveScriptSuiteEvent::type_url() {
            if let Ok(ev) = events_script::RemoveScriptSuiteEvent::decode(data.value.as_slice()) {
                return Some(Event::RemoveScriptSuiteEvent(ev));
            }
        } else if data.type_url == events_script::UpdateScriptSuiteNameEvent::type_url() {
            if let Ok(ev) = events_script::UpdateScriptSuiteNameEvent::decode(data.value.as_slice())
            {
                return Some(Event::UpdateScriptSuiteNameEvent(ev));
            }
        } else if data.type_url == events_script::UpdateEnvPermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateEnvPermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEnvPermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateSysPermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateSysPermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateSysPermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateNetPermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateNetPermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateNetPermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateReadPermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateReadPermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateReadPermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateWritePermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateWritePermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateWritePermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateRunPermEvent::type_url() {
            if let Ok(ev) = events_script::UpdateRunPermEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateRunPermEvent(ev));
            }
        } else if data.type_url == events_script::UpdateScriptEvent::type_url() {
            if let Ok(ev) = events_script::UpdateScriptEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateScriptEvent(ev));
            }
        } else if data.type_url == events_script::UpdateExecUserEvent::type_url() {
            if let Ok(ev) = events_script::UpdateExecUserEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateExecUserEvent(ev));
            }
        } else if data.type_url == events_script::UpdateEnvParamDefEvent::type_url() {
            if let Ok(ev) = events_script::UpdateEnvParamDefEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateEnvParamDefEvent(ev));
            }
        } else if data.type_url == events_script::UpdateArgParamDefEvent::type_url() {
            if let Ok(ev) = events_script::UpdateArgParamDefEvent::decode(data.value.as_slice()) {
                return Some(Event::UpdateArgParamDefEvent(ev));
            }
        } else if data.type_url == events_script::RecoverScriptEvent::type_url() {
            if let Ok(ev) = events_script::RecoverScriptEvent::decode(data.value.as_slice()) {
                return Some(Event::RecoverScriptEvent(ev));
            }
        } else if data.type_url == events_script::ExecEvent::type_url() {
            if let Ok(ev) = events_script::ExecEvent::decode(data.value.as_slice()) {
                return Some(Event::ExecEvent(ev));
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

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq)]
pub enum EventMessage {
    ProjectEvent(project::Event),
    ProjectDocEvent(project_doc::Event),
    SpritEvent(sprit::Event),
    IssueEvent(issue::Event),
    BookShelfEvent(book_shelf::Event),
    ExtEvEvent(ext_event::Event),
    GitlabEvent(gitlab::Event),
    GogsEvent(gogs::Event),
    GiteeEvent(gitee::Event),
    RobotEvent(robot::Event),
    EarthlyEvent(earthly::Event),
    ScriptEvent(script::Event),
    RequirementEvent(requirement::Event),
    CodeEvent(code::Event),
    IdeaEvent(idea::Event),
    DataAnnoEvent(data_anno::Event),
    ApiCollectionEvent(api_collection::Event),
    AtomgitEvent(atomgit::Event),
    NoopEvent(),
}

use proto_gen_rust::google::protobuf::Any;

pub fn decode_event(data: &Any) -> Option<EventMessage> {
    if let Some(ret) = project::decode_event(data) {
        return Some(EventMessage::ProjectEvent(ret));
    }
    if let Some(ret) = project_doc::decode_event(data) {
        return Some(EventMessage::ProjectDocEvent(ret));
    }
    if let Some(ret) = sprit::decode_event(data) {
        return Some(EventMessage::SpritEvent(ret));
    }
    if let Some(ret) = issue::decode_event(data) {
        return Some(EventMessage::IssueEvent(ret));
    }
    if let Some(ret) = book_shelf::decode_event(data) {
        return Some(EventMessage::BookShelfEvent(ret));
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
    if let Some(ret) = robot::decode_event(data) {
        return Some(EventMessage::RobotEvent(ret));
    }
    if let Some(ret) = earthly::decode_event(data) {
        return Some(EventMessage::EarthlyEvent(ret));
    }
    if let Some(ret) = script::decode_event(data) {
        return Some(EventMessage::ScriptEvent(ret));
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
    Some(EventMessage::NoopEvent())
}
