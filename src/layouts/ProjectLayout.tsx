import React from 'react';
import { renderRoutes } from 'react-router-config';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import CodeCommentThreadModal from '@/pages/Project/Code/CodeCommentThreadModal';
import ProjectSettingModal from '@/pages/Project/Setting/ProjectSettingModal';
import CreateIdeaModal from '@/pages/Idea/components/CreateIdeaModal';
import GitPostHookModal from '@/pages/Project/ProjectTool/GitPostHookModal';
import UpdateEntryModal from '@/pages/Project/Home/UpdateEntryModal';



const ProjectLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const projectStore = useStores("projectStore");
    const ideaStore = useStores("ideaStore");
    const entryStore = useStores("entryStore");

    return (
        <div className={style.projectLayout}>
            {renderRoutes(route.routes)}
            {projectStore.codeCommentThreadId != "" && (
                <CodeCommentThreadModal threadId={projectStore.codeCommentThreadId} commentId={projectStore.codeCommentId} />
            )}
            {projectStore.curProjectId != "" && projectStore.showProjectSetting != null && (
                <ProjectSettingModal />
            )}
            {projectStore.curProjectId != "" && ideaStore.showCreateIdea == true && (
                <CreateIdeaModal/>
            )}
            {projectStore.curProjectId != "" && projectStore.showPostHookModal == true && (
                <GitPostHookModal/>
            )}
            {projectStore.curProjectId != "" && entryStore.editEntryId != "" && (
                <UpdateEntryModal/>
            )}
        </div>
    );
};

export default observer(ProjectLayout);
