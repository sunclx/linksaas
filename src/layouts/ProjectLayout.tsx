import React from 'react';
import { renderRoutes } from 'react-router-config';
import type { IRouteConfig } from '@/routes';
import style from './style.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import MemberInfoModal from '@/pages/Channel/components/MemberInfoModal';
import CodeCommentThreadModal from '@/pages/Project/Code/CodeCommentThreadModal';
import ProjectSettingModal from '@/pages/Project/ProjectSettingModal';



const ProjectLayout: React.FC<{ route: IRouteConfig }> = ({ route }) => {
    const appStore = useStores('appStore');
    const memberStore = useStores("memberStore");
    const projectStore = useStores("projectStore");

    return (
        <div className={style.projectLayout}>
            {renderRoutes(route.routes)}
            {memberStore.floatMemberUserId != "" && <MemberInfoModal memberId={memberStore.floatMemberUserId} />}
            {appStore.codeCommentThreadId != "" && (
                <CodeCommentThreadModal threadId={appStore.codeCommentThreadId} commentId={appStore.codeCommentId} />
            )}
            {projectStore.curProjectId != "" && appStore.showProjectSetting && (
                <ProjectSettingModal />
            )}
        </div>
    );
};

export default observer(ProjectLayout);
