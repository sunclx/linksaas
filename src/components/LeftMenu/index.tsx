import workbench_icon from '@/assets/allIcon/workbench_icon.png';
import { useStores } from '@/hooks';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Portrait from '../Portrait';
import cls from './index.module.less';
const { Sider } = Layout;
import UserPhoto from '@/components/Portrait/UserPhoto';
import ProjectList from './ProjectList';
import { GlobalOutlined, TeamOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { APP_GROUP_HOME_PATH, APP_GROUP_PATH, EXTRA_MENU_PATH, PUB_RES_PATH, WORKBENCH_PATH } from '@/utils/constant';

const LeftMenu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const userStore = useStores('userStore');
  const appStore = useStores('appStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const [curExtraMenuId, setCurExtraMenuId] = useState("");

  return (
    <Sider className={cls.sider}>
      <Portrait>
        <div className={cls.user}>
          <div className={cls.avatar}>
            <UserPhoto logoUri={userStore.userInfo.logoUri ?? ''} />
          </div>
          <div className={cls.name}>{userStore.userInfo.displayName}</div>
        </div>
      </Portrait>

      <div>
        <div className={`${cls.workbench_menu} ${location.pathname.startsWith(WORKBENCH_PATH) ? cls.active_menu : ""}`}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (docStore.inEdit) {
              docStore.showCheckLeave(() => {
                history.push(WORKBENCH_PATH);
                projectStore.setCurProjectId("");
              });
            } else {
              history.push(WORKBENCH_PATH);
              projectStore.setCurProjectId("");
            }
          }}>
          <img src={workbench_icon} alt="" className={cls.workbench_icon} />
          工作台
        </div>
        <div style={{ borderBottom: "2px dotted #333", margin: "5px 24px", paddingTop: "5px" }} />
        <ProjectList />
        <div style={{ borderTop: "2px dotted #333", margin: "5px 24px" }} />
        <div className={`${cls.workbench_menu} ${location.pathname.startsWith(APP_GROUP_PATH) ? cls.active_menu : ""}`}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (docStore.inEdit) {
              docStore.showCheckLeave(() => {
                history.push(APP_GROUP_HOME_PATH);
                projectStore.setCurProjectId("");
              });
              return;
            }
            history.push(APP_GROUP_HOME_PATH);
            projectStore.setCurProjectId("");
          }}>
          <TeamOutlined />&nbsp;兴趣小组
        </div>
        {(appStore.clientCfg?.enable_pub_app_store == true
          || appStore.clientCfg?.enable_pub_docker_template == true
          || appStore.clientCfg?.enable_pub_search == true) && (
            <div className={`${cls.workbench_menu} ${location.pathname.startsWith(PUB_RES_PATH) ? cls.active_menu : ""}`}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (docStore.inEdit) {
                  docStore.showCheckLeave(() => {
                    history.push(PUB_RES_PATH);
                    projectStore.setCurProjectId("");
                  });
                  return;
                }
                history.push(PUB_RES_PATH);
                projectStore.setCurProjectId("");
              }}>
              <GlobalOutlined />&nbsp;公共资源
            </div>
          )}
        {(appStore.clientCfg?.item_list.length ?? 0) > 0 && <div style={{ borderTop: "2px dotted #333", margin: "5px 24px" }} />}
        {appStore.clientCfg?.item_list.map(extraItem => (
          <div key={extraItem.menu_id}
            className={`${cls.workbench_menu} ${location.pathname.startsWith(EXTRA_MENU_PATH) && curExtraMenuId == extraItem.menu_id ? cls.active_menu : ""}`}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              projectStore.setCurProjectId("").then(() => {
                history.push(EXTRA_MENU_PATH, { url: extraItem.url });
              });
              setCurExtraMenuId(extraItem.menu_id);
            }}>
            <GlobalOutlined />&nbsp;{extraItem.name}
          </div>
        ))}
      </div>
    </Sider>
  );
};
export default observer(LeftMenu);
