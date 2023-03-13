import React, { useEffect } from "react";
import { observer } from 'mobx-react';
import s from "./AiAssistantList.module.less";
import { gen_ai_token } from "@/api/project";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { AI_CAP_TYPE, getAiCap } from "@/api/ai";
import { Empty } from "antd";
import { PROJECT_CHAT_TYPE } from "@/utils/constant";

const AiAssistantList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const loadAiCap = async () => {
        const tokenRes = await request(gen_ai_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        const aiCap = await getAiCap(projectStore.curProject?.ai_gateway_addr ?? "", tokenRes.token);
        if (aiCap.coding.completeLangList.length + aiCap.coding.convertLangList.length +
            aiCap.coding.explainLangList.length + aiCap.coding.fixErrorLangList.length +
            aiCap.coding.genTestLangList.length > 0) {
            projectStore.projectAiCap = aiCap;
        }
        console.log("xxxx", aiCap);
    }

    useEffect(() => {
        if ((projectStore.curProject?.ai_gateway_addr ?? "") == "") {
            return;
        }
        loadAiCap();
    }, [projectStore.curProjectId]);

    return (
        <ul className={s.ai_list_wrap}>
            {projectStore.projectAiCap == null && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {projectStore.projectAiCap != null && (
                <>
                    {projectStore.projectAiCap.coding.completeLangList.length > 0 && (
                        <li className={s.ai_item + ' ' + ((projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_AI && projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_COMPLETE) ? s.current : "")}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                projectStore.curAiCapType = AI_CAP_TYPE.AI_CAP_CODE_COMPLETE;
                            }}>
                            代码补全
                            <div className={s.divider} />
                        </li>
                    )}
                    {projectStore.projectAiCap.coding.convertLangList.length > 0 && (
                        <li className={s.ai_item + ' ' + ((projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_AI && projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_CONVERT) ? s.current : "")}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                projectStore.curAiCapType = AI_CAP_TYPE.AI_CAP_CODE_CONVERT;
                            }}>
                            代码转换
                            <div className={s.divider} />
                        </li>
                    )}
                    {projectStore.projectAiCap.coding.explainLangList.length > 0 && (
                        <li className={s.ai_item + ' ' + ((projectStore.projectChatType == PROJECT_CHAT_TYPE.PROJECT_CHAT_AI && projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_EXPLAIN) ? s.current : "")}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                projectStore.curAiCapType = AI_CAP_TYPE.AI_CAP_CODE_EXPLAIN;
                            }}>
                            代码解释
                            <div className={s.divider} />
                        </li>
                    )}
                </>
            )}
        </ul>
    );
};

export default observer(AiAssistantList);