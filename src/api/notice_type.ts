
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
    SetWorkSnapShotNotice?: SetWorkSnapShotNotice;
    UserOnlineNotice?: UserOnlineNotice,
    UserOfflineNotice?: UserOfflineNotice,
    NewEventNotice?: NewEventNotice,
    SetMemberRoleNotice?: SetMemberRoleNotice,
    ReminderNotice?: ReminderNotice,
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

  export type AllNotice = {
    NewDocSpaceNotice?: NewDocSpaceNotice;
    UpdateDocSpaceNotice?: UpdateDocSpaceNotice;
    RemoveDocSpaceNotice?: RemoveDocSpaceNotice;
    NewDocNotice?: NewDocNotice;
    UpdateDocNotice?: UpdateDocNotice;
    RemoveDocNotice?: RemoveDocNotice;
    RecoverDocInRecycleNotice?: RecoverDocInRecycleNotice;
    RemoveDocInRecycleNotice?: RemoveDocInRecycleNotice;
  }
}

export namespace issue {
  export type NewIssueNotice = {
    project_id: string;
    issue_id: string;
  };
  export type RemoveIssueNotice = {
    project_id: string;
    issue_id: string;
  };
  export type SetExecUserNotice = {
    project_id: string;
    issue_id: string;
    exec_user_id: string;
  };
  export type SetCheckUserNotice = {
    project_id: string;
    issue_id: string;
    check_user_id: string;
  };
  export type UpdateIssueNotice = {
    project_id: string;
    issue_id: string;
  };
  export type UpdateIssueStateNotice = {
    project_id: string;
    issue_id: string;
  };

  export type AllNotice = {
    NewIssueNotice?: NewIssueNotice;
    RemoveIssueNotice?: RemoveIssueNotice;
    SetExecUserNotice?: SetExecUserNotice;
    SetCheckUserNotice?: SetCheckUserNotice;
    UpdateIssueNotice?: UpdateIssueNotice;
    UpdateIssueStateNotice?: UpdateIssueStateNotice;
  };
}

export namespace appraise {
  export type NewAppraiseNotice = {
    project_id: string;
    appraise_id: string;
  };
  export type NewVoteNotice = {
    project_id: string;
    appraise_id: string;
  };
  export type AllNotice = {
    NewAppraiseNotice?: NewAppraiseNotice;
    NewVoteNotice?: NewVoteNotice;
  };
}

export namespace client {
  export type WrongSessionNotice = {
    name: string;
  };
  export type UploadSnapShotNotice = {
    project_id: string;
  };
  export type AllNotice = {
    WrongSessionNotice?: WrongSessionNotice;
    UploadSnapShotNotice?: UploadSnapShotNotice;
  };
}

export type AllNotice = {
  ProjectNotice?: project.AllNotice;
  ProjectDocNotice?: project_doc.AllNotice;
  IssueNotice?: issue.AllNotice;
  AppraiseNotice?: appraise.AllNotice;
  ClientNotice?: client.AllNotice;
};
