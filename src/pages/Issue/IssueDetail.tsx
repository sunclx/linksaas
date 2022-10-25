import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import type { LinkIssueState } from '@/stores/linkAux';
import { useLocation } from "react-router-dom";
import { remove as remove_issue, get as get_issue } from "@/api/project_issue";
import type { IssueInfo } from "@/api/project_issue";
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import DetailsNav from "@/components/DetailsNav";
import { Button, Modal, message } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import s from './IssueDetail.module.less';
import IssueDetailLeft from "./components/IssueDetailLeft";
import IssueDetailRight from "./components/IssueDetailRight";
import StageModel from "./components/StageModel";
import { EditText } from "@/components/EditCell/EditText";
import { updateTitle } from "./components/utils";

const IssueDetail = () => {
    const location = useLocation();
    const state: LinkIssueState = location.state as LinkIssueState;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [issue, setIssue] = useState<IssueInfo | undefined>(undefined);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showStageModal, setShowStageModal] = useState(false);
    const [dataVersion, setDataVersion] = useState(0);

    const loadIssue = async () => {
        const res = await request(get_issue(userStore.sessionId, projectStore.curProjectId, state.issueId));
        if (res) {
            setIssue(res.info);
            setDataVersion((preVersion) => preVersion + 1);
        }
    }

    useEffect(() => {
        loadIssue();
    }, [state.issueId]);

    return (<CardWrap>
        {issue != undefined && (<DetailsNav title={
            <EditText editable={true} content={issue?.basic_info.title ?? "xxx"} onChange={async (value: string) => {
                return await updateTitle(userStore.sessionId, issue.project_id, issue.issue_id, value);
            }} showEditIcon={true} />
        }>
            {(issue?.user_issue_perm.can_remove ?? false) == true &&
                (
                    (<Button danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(true);
                    }}>
                        <DeleteOutlined />删除
                    </Button>)
                )
            }
        </DetailsNav>)
        }
        <div className={s.content_wrap}>
            <div className={s.content_left}>
                {issue != undefined && <IssueDetailLeft issue={issue} />}
            </div>
            <div className={s.content_rigth}>
                {issue != undefined && <IssueDetailRight issue={issue} onUpdate={() => { loadIssue() }} dataVersion={dataVersion} setShowStageModal={() => setShowStageModal(true)} />}
            </div>
        </div>
        {showRemoveModal && (
            <Modal
                title={`删除XXXX`}
                open={showRemoveModal}
                onCancel={() => setShowRemoveModal(false)}
                onOk={async (e): Promise<void> => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (issue == undefined) {
                        return;
                    }
                    await request(remove_issue(userStore.sessionId, issue.project_id, issue.issue_id));
                    message.info(`删除XXXX成功`);
                    setShowRemoveModal(false);
                    // if (getIsTask(pathname)) {
                    //     history.push("/app/project/task");
                    // } else {
                    //     history.push("/app/project/bug");
                    // }
                }}
            >
                <p>是否删除当前XXXX?</p>
                <p style={{ color: "red" }}>删除后将无法恢复当前XXX</p>
            </Modal>)
        }
        {showStageModal && issue != undefined && (
            <StageModel
                issue={issue}
                onCancel={() => setShowStageModal(false)}
                onOk={() => {
                    loadIssue().then(() => {
                        setShowStageModal(false);
                    });
                }}
            />)}
    </CardWrap>);
}

export default observer(IssueDetail);