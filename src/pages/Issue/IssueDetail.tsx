import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from '@/components/CardWrap';
import type { LinkIssueState } from '@/stores/linkAux';
import { useHistory, useLocation } from "react-router-dom";
import { remove as remove_issue, get as get_issue } from "@/api/project_issue";
import type { IssueInfo } from "@/api/project_issue";
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import DetailsNav from "@/components/DetailsNav";
import { Button, Modal, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import s from './IssueDetail.module.less';
import IssueDetailLeft from "./components/IssueDetailLeft";
import IssueDetailRight from "./components/IssueDetailRight";
import StageModel from "./components/StageModel";
import { EditText } from "@/components/EditCell/EditText";
import { updateTitle } from "./components/utils";
import { getIssueText, getIsTask } from "@/utils/utils";

const IssueDetail = () => {
    const location = useLocation();
    const history = useHistory();

    const state: LinkIssueState = location.state as LinkIssueState;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const spritStore = useStores('spritStore');

    const [issueId, setIssueId] = useState(state.issueId);
    const [issue, setIssue] = useState<IssueInfo | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showStageModal, setShowStageModal] = useState(false);
    const [dataVersion, setDataVersion] = useState(0);
    const [preIssueId, setPreIssueId] = useState("");
    const [nextIssueId, setNextIssueId] = useState("");

    const loadIssue = async () => {
        setIssue(null);
        const res = await request(get_issue(userStore.sessionId, projectStore.curProjectId, issueId));
        if (res) {
            setIssue(res.info);
            setDataVersion((preVersion) => preVersion + 1);
        }
    }

    const calcPreAndNext = () => {
        const issueIdList = state.contextIssueIdList ?? [];
        const index = issueIdList.indexOf(issueId);
        if (index == -1) {
            return;
        }
        if (index > 0) {
            setPreIssueId(issueIdList[index - 1]);
        }
        if (index < issueIdList.length - 1) {
            setNextIssueId(issueIdList[index + 1])
        }
    }

    useEffect(() => {
        calcPreAndNext();
        loadIssue();
    }, [issueId]);

    useEffect(() => {
        setIssueId(state.issueId);
    }, [state.issueId]);

    return (<CardWrap>
        {issue != null && (<DetailsNav title={
            <EditText editable={issue.user_issue_perm.can_update ?? false} content={issue?.basic_info.title ?? ""} onChange={async (value: string) => {
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
            {(state.contextIssueIdList ?? []).length > 0 &&
                <span style={{ display: "inline-block", width: "80px" }} />
            }
            {(state.contextIssueIdList ?? []).length > 0 && (
                <Button
                    type="link"
                    title="上一个"
                    style={{ fontSize: "18px" }}
                    disabled={preIssueId == ""}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const tmpIssueId = preIssueId;
                        setIssue(null);
                        setPreIssueId("");
                        setNextIssueId("");
                        setIssueId(tmpIssueId);
                    }}><ArrowLeftOutlined /></Button>
            )}
            {(state.contextIssueIdList ?? []).length > 0 && (
                <Button
                    type="link"
                    title="下一个"
                    style={{ fontSize: "18px" }}
                    disabled={nextIssueId == ""}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const tmpIssueId = nextIssueId;
                        setIssue(null);
                        setPreIssueId("");
                        setNextIssueId("");
                        setIssueId(tmpIssueId);
                    }}><ArrowRightOutlined /></Button>
            )}
        </DetailsNav>)
        }
        <div className={s.content_wrap}>
            <div className={s.content_left}>
                {issue != null && <IssueDetailLeft issue={issue} onUpdate={() => { loadIssue() }} />}
            </div>
            <div className={s.content_rigth}>
                {issue != null && <IssueDetailRight issue={issue} onUpdate={() => { loadIssue() }} dataVersion={dataVersion} setShowStageModal={() => setShowStageModal(true)} />}
            </div>
        </div>
        {showRemoveModal && (
            <Modal
                title={`删除${getIssueText(location.pathname)}`}
                open={showRemoveModal}
                onCancel={() => setShowRemoveModal(false)}
                onOk={async (e): Promise<void> => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (issue == null) {
                        return;
                    }
                    await request(remove_issue(userStore.sessionId, issue.project_id, issue.issue_id));
                    message.info(`删除${getIssueText(location.pathname)} ${issue.basic_info.title}成功`);
                    setShowRemoveModal(false);
                    if (getIsTask(location.pathname)) {
                        linkAuxStore.goToTaskList({
                            stateList: [],
                            execUserIdList: [],
                            checkUserIdList: [],
                        }, history);
                    } else {
                        linkAuxStore.goToBugList({
                            stateList: [],
                            execUserIdList: [],
                            checkUserIdList: [],
                        }, history);
                    }

                }}
            >
                <p>是否删除当前{getIssueText(location.pathname)} {issue?.basic_info.title}?</p>
                <p style={{ color: "red" }}>删除后将无法恢复当前{getIssueText(location.pathname)}</p>
            </Modal>)
        }
        {showStageModal && issue != null && (
            <StageModel
                issue={issue}
                onCancel={() => setShowStageModal(false)}
                onOk={() => {
                    loadIssue().then(() => {
                        setShowStageModal(false);
                    });
                    spritStore.updateIssue(issue.issue_id);
                }}
            />)}
    </CardWrap>);
}

export default observer(IssueDetail);