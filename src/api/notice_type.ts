/* eslint-disable @typescript-eslint/no-namespace */
export namespace project {
  export type UpdateProjectNotice = {
    project_id: string;
  };
  export type RemoveProjectNotice = {
    project_id: string;
  };
  export type AddMemberNotice = {
    project_id: string;
    member_user_id: string;
  };
  export type UpdateMemberNotice = {
    project_id: string;
    member_user_id: string;
  };
  export type RemoveMemberNotice = {
    project_id: string;
    member_user_id: string;
  };
  export type AddChannelNotice = {
    project_id: string;
    channel_id: string;
  };
  export type UpdateChannelNotice = {
    project_id: string;
    channel_id: string;
  };
  export type RemoveChannelNotice = {
    project_id: string;
    channel_id: string;
  };
  export type AddChannelMemberNotice = {
    project_id: string;
    channel_id: string;
    member_user_id: string;
  };
  export type RemoveChannelMemberNotice = {
    project_id: string;
    channel_id: string;
    member_user_id: string;
  };
  export type NewMsgNotice = {
    project_id: string;
    channel_id: string;
  };
  export type UpdateMsgNotice = {
    project_id: string;
    channel_id: string;
    msg_id: string;
  };
  export type SetWorkSnapShotNotice = {
    project_id: string;
    member_user_id: string;
    enable: boolean;
  };
  export type UserOnlineNotice = {
    user_id: string;
  };
  export type UserOfflineNotice = {
    user_id: string;
  };
  export type NewEventNotice = {
    project_id: string;
    member_user_id: string;
    event_id: string;
  };
  export type SetMemberRoleNotice = {
    project_id: string;
    member_user_id: string;
    role_id: string;
  }
  export type ReminderNotice = {
    project_name: string;
    link_type: number;
    link_title: string;
  };

  export type UpdateShortNoteNotice = {
    project_id: string;
    member_user_id: string;
  };

  export type AllNotice = {
    UpdateProjectNotice?: UpdateProjectNotice;
    RemoveProjectNotice?: RemoveProjectNotice;
    AddMemberNotice?: AddMemberNotice;
    UpdateMemberNotice?: UpdateMemberNotice;
    RemoveMemberNotice?: RemoveMemberNotice;
    AddChannelNotice?: AddChannelNotice;
    UpdateChannelNotice?: UpdateChannelNotice;
    RemoveChannelNotice?: RemoveChannelNotice;
    AddChannelMemberNotice?: AddChannelMemberNotice;
    RemoveChannelMemberNotice?: RemoveChannelMemberNotice;
    NewMsgNotice?: NewMsgNotice;
    UpdateMsgNotice?: UpdateMsgNotice;
    SetWorkSnapShotNotice?: SetWorkSnapShotNotice;
    UserOnlineNotice?: UserOnlineNotice,
    UserOfflineNotice?: UserOfflineNotice,
    NewEventNotice?: NewEventNotice,
    SetMemberRoleNotice?: SetMemberRoleNotice,
    ReminderNotice?: ReminderNotice,
    UpdateShortNoteNotice?: UpdateShortNoteNotice,
  };
}

export namespace project_doc {
  export type NewDocSpaceNotice = {
    project_id: string;
    doc_space_id: string;
  };
  export type UpdateDocSpaceNotice = {
    project_id: string;
    doc_space_id: string;
  };
  export type RemoveDocSpaceNotice = {
    project_id: string;
    doc_space_id: string;
  };
  export type NewDocNotice = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
  };
  export type UpdateDocNotice = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
  };

  export type RemoveDocNotice = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
  }

  export type RecoverDocInRecycleNotice = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
  };

  export type RemoveDocInRecycleNotice = {
    project_id: string;
    doc_space_id: string;
    doc_id: string;
  };

  export type LinkSpritNotice = {
    project_id: string;
    doc_id: string;
    sprit_id: string;
  };

  export type CancelLinkSpritNotice = {
    project_id: string;
    doc_id: string;
    sprit_id: string;
  };

  export type AllNotice = {
    NewDocSpaceNotice?: NewDocSpaceNotice;
    UpdateDocSpaceNotice?: UpdateDocSpaceNotice;
    RemoveDocSpaceNotice?: RemoveDocSpaceNotice;
    NewDocNotice?: NewDocNotice;
    UpdateDocNotice?: UpdateDocNotice;
    RemoveDocNotice?: RemoveDocNotice;
    RecoverDocInRecycleNotice?: RecoverDocInRecycleNotice;
    RemoveDocInRecycleNotice?: RemoveDocInRecycleNotice;
    LinkSpritNotice?: LinkSpritNotice;
    CancelLinkSpritNotice?: CancelLinkSpritNotice;
  }
}

export namespace issue {
  export type NewIssueNotice = {
    project_id: string;
    issue_id: string;
    create_user_id: string;
  };
  export type RemoveIssueNotice = {
    project_id: string;
    issue_id: string;
    create_user_id: string;
    exec_user_id: string;
    check_user_id: string;
  };
  export type SetExecUserNotice = {
    project_id: string;
    issue_id: string;
    exec_user_id: string;
    old_exec_user_id: string;
  };
  export type SetCheckUserNotice = {
    project_id: string;
    issue_id: string;
    check_user_id: string;
    old_check_user_id: string;
  };
  export type UpdateIssueNotice = {
    project_id: string;
    issue_id: string;
  };
  export type UpdateIssueStateNotice = {
    project_id: string;
    issue_id: string;
    exec_user_id: string;
    check_user_id: string;
  };

  export type SetSpritNotice = {
    project_id: string;
    issue_id: string;
    old_sprit_id: string;
    new_sprit_id: string;
  };

  export type AllNotice = {
    NewIssueNotice?: NewIssueNotice;
    RemoveIssueNotice?: RemoveIssueNotice;
    SetExecUserNotice?: SetExecUserNotice;
    SetCheckUserNotice?: SetCheckUserNotice;
    UpdateIssueNotice?: UpdateIssueNotice;
    UpdateIssueStateNotice?: UpdateIssueStateNotice;
    SetSpritNotice?: SetSpritNotice;
  };
}

export namespace appraise {
  export type NewAppraiseNotice = {
    project_id: string;
    appraise_id: string;
  };

  export type UpdateAppraiseNotice = {
    project_id: string;
    appraise_id: string;
  };

  export type RemoveAppraiseNotice = {
    project_id: string;
    appraise_id: string;
  };

  export type NewVoteNotice = {
    project_id: string;
    appraise_id: string;
  };

  export type RevokeVoteNotice = {
    project_id: string;
    appraise_id: string;
  };

  export type AllNotice = {
    NewAppraiseNotice?: NewAppraiseNotice;
    UpdateAppraiseNotice?: UpdateAppraiseNotice;
    RemoveAppraiseNotice?: RemoveAppraiseNotice;
    NewVoteNotice?: NewVoteNotice;
    RevokeVoteNotice?: RevokeVoteNotice;
  };
}

export namespace client {
  export type WrongSessionNotice = {
    name: string;
  };

  export type UploadSnapShotNotice = {
    project_id: string;
  };

  export type SwitchUserNotice = {};

  export type AllNotice = {
    WrongSessionNotice?: WrongSessionNotice;
    UploadSnapShotNotice?: UploadSnapShotNotice;
    SwitchUserNotice?: SwitchUserNotice;
  };
}

export namespace robot {
  export type RespMetricDataNotice = {
    req_id: string;
  };

  export type AllNotice = {
    RespMetricDataNotice?: RespMetricDataNotice;
  };
}

export namespace earthly {
  export type ExecDataNotice = {
    exec_id: string;
    data_index: number;
    data: number[];
  };
  export type ExecStateNotice = {
    exec_id: string;
    exec_state: number;
  };
  export type AllNotice = {
    ExecDataNotice?: ExecDataNotice;
    ExecStateNotice?: ExecStateNotice;
  };
}

export namespace script {
  export type ExecDataNotice = {
    exec_id: string;
    data_index: number;
    data: number[];
  };
  export type ExecStateNotice = {
    exec_id: string;
    exec_state: number;
  };
  export type AllNotice = {
    ExecDataNotice?: ExecDataNotice;
    ExecStateNotice?: ExecStateNotice;
  };
}

export type AllNotice = {
  ProjectNotice?: project.AllNotice;
  ProjectDocNotice?: project_doc.AllNotice;
  IssueNotice?: issue.AllNotice;
  AppraiseNotice?: appraise.AllNotice;
  RobotNotice?: robot.AllNotice;
  EarthlyNotice?: earthly.AllNotice;
  ScriptNotice?: script.AllNotice;
  ClientNotice?: client.AllNotice;
};
