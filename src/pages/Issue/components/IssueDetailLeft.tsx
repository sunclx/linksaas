import React from "react";
import s from './IssueDetailLeft.module.less';
import { ReadOnlyEditor } from "@/components/Editor";
import { Card } from "antd";
import Button from "@/components/Button";
import { useLocation } from "react-router-dom";
import { getIsTask } from "@/utils/utils";
import { ExtraIssueInfo } from "./ExtraIssueInfo";
import type { IssueInfo } from "@/api/project_issue";
import { CommentList } from "./CommentList";

export interface IssueDetailLeftProps {
    issue: IssueInfo
    onUpdate: () => void;
}

const IssueDetailLeft: React.FC<IssueDetailLeftProps> = (props) => {
    const { pathname } = useLocation();
    return (
        <div className={s.leftCom}>
            <Card title={<h2>内容详情</h2>} bordered={false} extra={<Button>修改</Button>}>
                <ReadOnlyEditor content={props.issue?.basic_info.content ?? ""} />
            </Card>
            {getIsTask(pathname) && (props.issue?.issue_id ?? "") != "" && <ExtraIssueInfo issueId={props.issue?.issue_id ?? ""}
                canOptSubIssue={props.issue?.user_issue_perm.can_opt_sub_issue ?? false}
                canOptDependence={props.issue?.user_issue_perm.can_opt_dependence ?? false} />}
            <CommentList issueId={props.issue?.issue_id ?? ""} />
        </div>
    );
}

export default IssueDetailLeft;