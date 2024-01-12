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
import UpdateEntryModal from '@/pages/Project/Home/components/UpdateEntryModal';
import ChatAndCommentPanel from '@/pages/Project/ChatAndComment';
import CreateEntryModal from '@/pages/Project/Home/components/CreateEntryModal';



const ProjectLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const projectStore = useStores("projectStore");
    const ideaStore = useStores("ideaStore");
    const entryStore = useStores("entryStore");

    return (
        <div className={style.projectLayout}>
            <div style={{ flex: 1 }}>
                {renderRoutes(route.routes)}
            </div>
            {projectStore.showChatAndComment && (
                <div style={{ width: "300px", marginRight: "60px", borderLeft: "1px solid #e4e4e8" }}>
                    <div style={{ width: "290px", backgroundColor: "white",margin:"5px 5px",height:"calc(100vh - 96px)",borderRadius:"10px" }}>
                        <ChatAndCommentPanel />
                    </div>
                </div>
            )}
            {projectStore.showChatAndComment == false && <div style={{ width: "60px" }} />}

            {projectStore.codeCommentThreadId != "" && (
                <CodeCommentThreadModal threadId={projectStore.codeCommentThreadId} commentId={projectStore.codeCommentId} />
            )}
            {projectStore.curProjectId != "" && projectStore.showProjectSetting != null && (
                <ProjectSettingModal />
            )}
            {projectStore.curProjectId != "" && ideaStore.showCreateIdea == true && (
                <CreateIdeaModal />
            )}
            {projectStore.curProjectId != "" && projectStore.showPostHookModal == true && (
                <GitPostHookModal />
            )}
            {projectStore.curProjectId != "" && entryStore.editEntryId != "" && (
                <UpdateEntryModal />
            )}
            {entryStore.createEntryType != null && (
                <CreateEntryModal />
            )}
        </div>
    );
};

export default observer(ProjectLayout);
