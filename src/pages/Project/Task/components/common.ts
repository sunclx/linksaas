import type { ChangeStateRequest, IssueInfo } from '@/api/project_issue';
import { request } from '@/utils/request';
import { assign_check_user, assign_exec_user, change_state, add_comment } from '@/api/project_issue';
import { ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK } from '@/api/project_issue';
import type { RemirrorJSON } from '@remirror/core';
import { is_empty_doc } from '@/components/Editor';



export const updateIssue = async (changeStateReq: ChangeStateRequest, destUserId: string, comment: RemirrorJSON, issueInfo: IssueInfo) => {
    if (issueInfo.state != changeStateReq.state) {
        const changeStatRes = await request(change_state(changeStateReq));
        if (!changeStatRes) {
            return;
        }
    }
    // 处理人接口
    if (
        changeStateReq.state === ISSUE_STATE_PROCESS &&
        destUserId !== issueInfo.exec_user_id
    ) {
        const assginRes = await request(assign_exec_user(changeStateReq.session_id, changeStateReq.project_id, changeStateReq.issue_id, destUserId));
        if (!assginRes) {
            return;
        }
    }

    // 验收人接口
    if (
        changeStateReq.state === ISSUE_STATE_CHECK &&
        destUserId !== issueInfo.check_user_id
    ) {
        const assginRes = await request(assign_check_user(changeStateReq.session_id, changeStateReq.project_id, changeStateReq.issue_id, destUserId));
        if (!assginRes) {
            return;
        }
    }
    //send comment
    if (!is_empty_doc(comment)) {
        await request(add_comment({
            session_id: changeStateReq.session_id,
            project_id: changeStateReq.project_id,
            issue_id: changeStateReq.issue_id,
            comment: {
                comment_data: JSON.stringify(comment),
                ref_comment_id: "",
            },
        }));
    }
}