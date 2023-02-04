import workbench_icon from '@/assets/allIcon/workbench_icon.png';
import { useStores } from '@/hooks';
import { Layout, Carousel } from 'antd';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Portrait from '../Portrait';
import cls from './index.module.less';
const { Sider } = Layout;
import UserPhoto from '@/components/Portrait/UserPhoto';
import adImg from '@/assets/allIcon/ad.png';
import ProjectList from './ProjectList';
import { ArrowsAltOutlined, GlobalOutlined, ShrinkOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { EXTRA_MENU_PATH, WORKBENCH_PATH } from '@/utils/constant';


const LeftMenu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const userStore = useStores('userStore');
  const appStore = useStores('appStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');
  const [curExtraMenuId, setCurExtraMenuId] = useState("");

  return (
    <Sider className={cls.sider} data-tauri-drag-region={true}>
      <div className={cls.user} data-tauri-drag-region={true}>
        {appStore.simpleMode == false && (
          <Portrait>
            <div className={cls.avatar}>
              <UserPhoto logoUri={userStore.userInfo.logoUri ?? ''} />
            </div>
          </Portrait>
        )}
        {appStore.simpleMode == true && (
          <div className={cls.avatar}>
            <UserPhoto logoUri={userStore.userInfo.logoUri ?? ''} />
          </div>
        )}
        <div className={cls.name}>{userStore.userInfo.displayName}</div>
        {appStore.simpleMode == true && (
          <div className={cls.expand} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            appStore.simpleMode = false;
          }} title='退出精简模式'><ArrowsAltOutlined /></div>
        )}
        {appStore.simpleMode == false && (
          <div className={cls.expand} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            appStore.simpleMode = true;
          }} title='进入精简模式'><ShrinkOutlined /></div>
        )}
      </div>
      <div>
        {appStore.simpleMode == false && (
          <div className={`${cls.workbench_menu} ${location.pathname.startsWith(WORKBENCH_PATH) ? cls.active_menu : ""}`}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              if (docSpaceStore.inEdit) {
                docSpaceStore.showCheckLeave(() => {
                  projectStore.setCurProjectId("");
                  history.push(WORKBENCH_PATH);
                });
                return;
              }
              projectStore.setCurProjectId("");
              history.push(WORKBENCH_PATH);
            }}>
            <img src={workbench_icon} alt="" className={cls.workbench_icon} />
            工作台
          </div>
        )}
        <ProjectList />
        {appStore.simpleMode == false && (
          <>
            {appStore.clientCfg?.item_list.map(extraItem => (
              <div key={extraItem.menu_id}
                className={`${cls.workbench_menu} ${location.pathname.startsWith(EXTRA_MENU_PATH) && curExtraMenuId == extraItem.menu_id ? cls.active_menu : ""}`}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  projectStore.setCurProjectId("");
                  history.push(EXTRA_MENU_PATH, { url: extraItem.url });
                  setCurExtraMenuId(extraItem.menu_id);
                }}>
                <GlobalOutlined />&nbsp;{extraItem.name}
              </div>
            ))}
          </>
        )}

      </div>

      {appStore.simpleMode == false && (
        <div className={cls.adArea}>
          <Carousel autoplay>
            <a href="htttp://wwww.linksaas.pro" target="_blank" rel="noreferrer">
              <img
                src={adImg}
              />
            </a>
            {appStore.clientCfg && appStore.clientCfg.ad_list.map(
              item => (
                <a key={item.ad_id} href={item.url} target="_blank" rel="noreferrer" aria-disabled={item.url == ""}>
                  <img src={item.img_url} />
                </a>
              ))}
          </Carousel>
        </div>
      )}
    </Sider>
  );
};
export default observer(LeftMenu);
