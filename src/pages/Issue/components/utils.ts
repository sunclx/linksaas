import type { MemberInfo } from "@/api/project_member";
import type { EditSelectItem } from "@/components/EditCell/EditSelect";
import * as issueApi from '@/api/project_issue';
import { message } from 'antd';

export function getStateColor(v: number) {
    switch (v) {
        case issueApi.ISSUE_STATE_PLAN:
            return '72 201 118';
        case issueApi.ISSUE_STATE_PROCESS:
            return '83 165 255';
        case issueApi.ISSUE_STATE_CHECK:
            return '247 136 91';
        case issueApi.ISSUE_STATE_CLOSE:
            return '196 196 196';
        default:
            return '72 201 118';
    }
};

export function getMemberSelectItems(memberList: MemberInfo[]): EditSelectItem[] {
    return memberList.map(member => {
        return {
            value: member.member_user_id,
            label: member.display_name,
            color: "#000",
        }
    });
}

export async function updateTitle(sessionId: string, projectId: string, issueId: string, title: string): Promise<boolean> {
    try {
        const res = await issueApi.update_title({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            title: title,
        });
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateContent(sessionId: string, projectId: string, issueId: string, content: string): Promise<boolean> {
    try {
        const res = await issueApi.update_content({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            content: content,
        });
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function updateStartTime(sessionId: string, projectId: string, issueId: string, startTime: number): Promise<boolean> {
    try {
        const res = await issueApi.set_start_time(sessionId, projectId, issueId, startTime);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function cancelStartTime(sessionId: string, projectId: string, issueId: string): Promise<boolean> {
    try {
        const res = await issueApi.cancel_start_time(sessionId, projectId, issueId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function updateDeadLineTime(sessionId: string, projectId: string, issueId: string, deadLineTime: number): Promise<boolean> {
    try {
        const res = await issueApi.set_dead_line_time({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            dead_line_time: deadLineTime,
        });
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function cancelDeadLineTime(sessionId: string, projectId: string, issueId: string): Promise<boolean> {
    try {
        const res = await issueApi.cancel_dead_line_time({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
        });
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function updateEndTime(sessionId: string, projectId: string, issueId: string, endTime: number): Promise<boolean> {
    try {
        const res = await issueApi.set_end_time(sessionId, projectId, issueId, endTime);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}


export async function cancelEndTime(sessionId: string, projectId: string, issueId: string): Promise<boolean> {
    try {
        const res = await issueApi.cancel_end_time(sessionId, projectId, issueId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateRemainMinutes(sessionId: string, projectId: string, issueId: string, minutes: number): Promise<boolean> {
    try {
        const res = await issueApi.set_remain_minutes({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            remain_minutes: minutes,
            has_spend_minutes: false,
            spend_minutes: 0,
        });
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function cancelRemainMinutes(sessionId: string, projectId: string, issueId: string): Promise<boolean> {
    try {
        const res = await issueApi.cancel_remain_minutes(sessionId, projectId, issueId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateEstimateMinutes(sessionId: string, projectId: string, issueId: string, minutes: number): Promise<boolean> {
    try {
        const res = await issueApi.set_estimate_minutes(sessionId, projectId, issueId, minutes);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function cancelEstimateMinutes(sessionId: string, projectId: string, issueId: string): Promise<boolean> {
    try {
        const res = await issueApi.cancel_estimate_minutes(sessionId, projectId, issueId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateExecUser(sessionId: string, projectId: string, issueId: string, execUserId: string): Promise<boolean> {
    try {
        const res = await issueApi.assign_exec_user(sessionId, projectId, issueId, execUserId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateCheckUser(sessionId: string, projectId: string, issueId: string, checkUserId: string): Promise<boolean> {
    try {
        const res = await issueApi.assign_check_user(sessionId, projectId, issueId, checkUserId);
        if (res.code == 0) {
            return true
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateExtraInfo(sessionId: string, projectId: string, issueId: string, extraInfo: issueApi.ExtraInfo): Promise<boolean> {
    try {
        const res = await issueApi.update_extra_info({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            extra_info: extraInfo,
        });
        if (res.code == 0) {
            return true;
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}

export async function updateProcessStage(sessionId: string, projectId: string, issueId: string, stage: issueApi.PROCESS_STAGE): Promise<boolean> {
    try {
        const res = await issueApi.update_process_stage({
            session_id: sessionId,
            project_id: projectId,
            issue_id: issueId,
            process_stage: stage,
        });
        if (res.code == 0) {
            return true;
        }
        message.error(res.err_msg);
        return false;
    } catch (_) {
        return false;
    }
}