import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { PROJECT_TOOL_TYPE } from "@/utils/constant";
import GitHookToolModal from "./components/GitHookToolModal";

const ProjectTool = () => {
    const projectStore = useStores('projectStore');
    
    return (
        <>
        {projectStore.projectTool == PROJECT_TOOL_TYPE.PROJECT_TOOL_GIT_HOOk && (
            <GitHookToolModal/>
        )}
        </>
    );
};

export default observer(ProjectTool);