import React from "react";
import msgIcon from '@/assets/allIcon/msg-icon.png';
import { issueState, ISSUE_STATE_COLOR_ENUM } from '@/utils/constant';
import type { IssueInfo } from '@/api/project_issue';
import { ISSUE_STATE_PLAN, ISSUE_STATE_PROCESS, ISSUE_STATE_CHECK, ISSUE_STATE_CLOSE } from '@/api/project_issue';


export const renderTitle = (row: IssueInfo) => {
    return (
        <div>
            <span>{row.basic_info?.title}</span>
            {row.msg_count && (
                <span
                    style={{
                        padding: '0px 5px',
                        display: 'inline-block',
                        height: ' 20px',
                        background: '#F4F4F7',
                        borderRadius: '9px',
                        marginLeft: '4px',
                        color: '#A7A9B6',
                    }}
                >
                    <img src={msgIcon} alt="" style={{ verticalAlign: 'sub' }} />
                    {row.msg_count > 999 ? `999+` : row.msg_count}
                </span>
            )}
        </div>
    );
};

const getColor = (v: number) => {
    switch (v) {
        case ISSUE_STATE_PLAN:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
        case ISSUE_STATE_PROCESS:
            return ISSUE_STATE_COLOR_ENUM.处理颜色;
        case ISSUE_STATE_CHECK:
            return ISSUE_STATE_COLOR_ENUM.验收颜色;
        case ISSUE_STATE_CLOSE:
            return ISSUE_STATE_COLOR_ENUM.关闭颜色;
        default:
            return ISSUE_STATE_COLOR_ENUM.规划中颜色;
    }
};

export const renderState = (val: number) => {
    const v = issueState[val];
    return (
        <div
            style={{
                background: `rgb(${getColor(val)} / 20%)`,
                width: '50px',
                margin: '0 auto',
                borderRadius: '50px',
                textAlign: 'center',
                color: `rgb(${getColor(val)})`,
            }}
        >
            {v.label}
        </div>
    );
};