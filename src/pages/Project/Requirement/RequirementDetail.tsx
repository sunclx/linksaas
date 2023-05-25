import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import CardWrap from "@/components/CardWrap";
import { useHistory, useLocation } from "react-router-dom";
import type { LinkRequirementState } from "@/stores/linkAux";
import type { RequirementInfo } from "@/api/project_requirement";
import { request } from "@/utils/request";
import { get_requirement, update_requirement, remove_requirement, open_requirement, close_requirement } from "@/api/project_requirement";
import { useStores } from "@/hooks";
import DetailsNav from "@/components/DetailsNav";
import { EditText } from "@/components/EditCell/EditText";
import s from "./RequirementDetail.module.less";
import RequirementDetailRight from "./components/RequirementDetailRight";
import RequirementDetailLeft from "./components/RequirementDetailLeft";
import { Dropdown, Modal, message } from "antd";


const RequirementDetail = () => {
    const location = useLocation();
    const history = useHistory();

    const state: LinkRequirementState = location.state as LinkRequirementState;

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');


    const [requirementInfo, setRequirementInfo] = useState<RequirementInfo | null>(null);
    const [dataVersion, setDataVersion] = useState(0);
    const [showRemoveModal, setShowRemoveModal] = useState(false);


    const loadRequirementInfo = async () => {
        const res = await request(get_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: state.requirementId,
        }));
        setRequirementInfo(res.requirement);
        setDataVersion((preVersion) => preVersion + 1);
    };

    const removeRequirement = async () => {
        await request(remove_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: state.requirementId,
        }));
        history.goBack();
    };

    const closeRequirement = async () => {
        await request(close_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: state.requirementId,
        }));
        await loadRequirementInfo();
    };

    const openRequirement = async () => {
        await request(open_requirement({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            requirement_id: state.requirementId,
        }));
        await loadRequirementInfo();
    };

    useEffect(() => {
        loadRequirementInfo();
    }, []);

    return (
        <CardWrap>
            {requirementInfo != null && (
                <DetailsNav title={
                    <EditText editable={true} content={requirementInfo.base_info.title} onChange={async (value) => {
                        const title = value.trim();
                        if (title == "") {
                            message.error("标题不能为空");
                            return false;
                        }
                        try {
                            await request(update_requirement({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                requirement_id: state.requirementId,
                                base_info: {
                                    title: title,
                                    content: requirementInfo.base_info.content,
                                    tag_id_list: requirementInfo.base_info.tag_id_list,
                                },
                            }));
                            await loadRequirementInfo();
                            return true;
                        } catch (e) {
                            console.log(e);
                        }
                        return false;
                    }} showEditIcon={true} />
                }>
                    <Dropdown.Button type="primary"
                        disabled={!(projectStore.isAdmin)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (requirementInfo.closed == false) {
                                closeRequirement();
                            } else {
                                openRequirement();
                            }
                        }}
                        menu={{
                            items: [
                                {
                                    label: "删除",
                                    key: "remove",
                                    danger: true,
                                    disabled: !((projectStore.isAdmin || requirementInfo.create_user_id == userStore.userInfo.userId) && requirementInfo.issue_link_count == 0),
                                },
                            ],
                            onClick: (e) => {
                                if (e.key == "remove") {
                                    setShowRemoveModal(true);
                                }
                            },
                        }}
                    >{requirementInfo.closed == false ? "关闭需求" : "打开需求"}</Dropdown.Button>
                </DetailsNav>)}
            <div className={s.content_wrap}>
                <div className={s.content_left}>
                    {requirementInfo != null && (
                        <RequirementDetailLeft requirement={requirementInfo} onUpdate={() => loadRequirementInfo()} />
                    )}
                </div>
                <div className={s.content_rigth}>
                    {requirementInfo != null && (
                        <RequirementDetailRight requirement={requirementInfo} dataVersion={dataVersion} onUpdate={() => loadRequirementInfo()} />
                    )}
                </div>
            </div>
            {showRemoveModal == true && (
                <Modal open title="删除需求"
                    okButtonProps={{ danger: true }}
                    okText="删除"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeRequirement();
                    }}>
                    是否删除需求&nbsp;{requirementInfo?.base_info.title ?? ""}&nbsp;?
                </Modal>
            )}
        </CardWrap>
    );
};

export default observer(RequirementDetail);