import React from 'react';
import { renderRoutes } from 'react-router-config';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import MemberInfoModal from '@/pages/ChannelAndAi/components/MemberInfoModal';
import CodeCommentThreadModal from '@/pages/Project/Code/CodeCommentThreadModal';
import ProjectSettingModal from '@/pages/Project/Setting/ProjectSettingModal';
import CreateIdeaModal from '@/pages/Idea/components/CreateIdeaModal';
import GitPostHookModal from '@/pages/Project/ProjectTool/GitPostHookModal';



const ProjectLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const memberStore = useStores("memberStore");
    const projectStore = useStores("projectStore");
    const ideaStore = useStores("ideaStore");

    return (
        <div className={style.projectLayout}>
            {renderRoutes(route.routes)}
            {memberStore.floatMemberUserId != "" && <MemberInfoModal memberId={memberStore.floatMemberUserId} />}
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
        </div>
    );
};

export default observer(ProjectLayout);
