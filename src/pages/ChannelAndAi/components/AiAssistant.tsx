import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { AI_CAP_TYPE } from "@/api/ai";
import AiCodeComplete from "./AiCodeComplete";
import AiCodeConvert from "./AiCodeConvert";

const AiAssistant = () => {
    const projectStore = useStores('projectStore');

    return (
        <>
            {projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_COMPLETE && <AiCodeComplete />}
            {projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_CONVERT && <AiCodeConvert />}
            {projectStore.curAiCapType == AI_CAP_TYPE.AI_CAP_CODE_EXPLAIN && "33"}
        </>
    );
};

export default observer(AiAssistant);