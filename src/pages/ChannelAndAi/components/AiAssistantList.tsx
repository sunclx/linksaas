import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import s from "./AiAssistantList.module.less";
import { gen_ai_token } from "@/api/project";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";

const AiAssistantList = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const [token, setToken] = useState("");

    const updateToken = async (): Promise<string> => {
        const res = await request(gen_ai_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setToken(res.token);
        return res.token;
    }


    useEffect(() => {
        if((projectStore.curProject?.ai_gateway_addr ?? "") == ""){
            return;
        }
        updateToken().then(aiToken=>{
            //TODO
        })
    }, [projectStore.curProjectId]);

    return (
        <ul className={s.ai_list_wrap}>
            <li>xx</li>
            <li>xx</li>
        </ul>
    );
};

export default observer(AiAssistantList);