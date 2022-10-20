import workbench_icon from '@/assets/allIcon/workbench_icon.png';
import { useStores } from '@/hooks';
import { WORKBENCH_PATH } from '@/utils/constant';
import { Layout, Menu, Carousel } from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Portrait from '../Portrait';
import cls from './index.module.less';
import useProjectMenu from './useProjectMenu';
const { Sider } = Layout;
import UserPhoto from '@/components/Portrait/UserPhoto';
import adImg from '@/assets/allIcon/ad.png';
import JoinProject from './JoinProject';
import CreatedProject from './CreatedProject';

const Header: React.FC = () => {
  const projectStore = useStores('projectStore');
  const userStore = useStores('userStore');
  const appStore = useStores('appStore');
  const history = useHistory();
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(projectStore.curProjectId);
  const { menuList, renderPjItemChange } = useProjectMenu();
  const [openKeys, setOpenKeys] = useState(['sub2']);

  useEffect(() => {
    if ([WORKBENCH_PATH].includes(pathname)) {
      setSelectedKeys(pathname);
    } else {
      setSelectedKeys(projectStore.curProjectId);
    }
  }, [pathname, projectStore.curProjectId]);

  const items = [
    {
      label: (
        <div
          key={WORKBENCH_PATH}
          onClick={() => {
            history.push(WORKBENCH_PATH);
            setSelectedKeys(WORKBENCH_PATH);
          }}
        >
          <img src={workbench_icon} alt="" className={cls.workbench_icon} />
          工作台
        </div>
      ),
      key: WORKBENCH_PATH,
    },
    ...menuList,
  ];

  return (
    <Sider className={cls.sider}>
      <div className={cls.user}>
        <Portrait>
          <div className={cls.avatar}>
            <UserPhoto logoUri={userStore.userInfo.logoUri ?? ''} />
          </div>
        </Portrait>
        <div className={cls.name}>{userStore.userInfo.displayName}</div>
      </div>
      <Menu
        theme="dark"
        openKeys={openKeys}
        selectedKeys={[selectedKeys]}
        mode="inline"
        items={items}
        onClickCapture={(e) => {
          const target = e.target as unknown as HTMLElement;
          if (target.className.startsWith('_submenu_')) {
            if (openKeys.length == 0) {
              setOpenKeys(['sub2']);
            } else {
              setOpenKeys([]);
            }
          }
        }}
      />
      {projectStore.projectList.length == 0 && (<div className={cls.zero_project_tips}>
        您还没有加入项目，你可以通过上方的<i className={cls.add} />加入或创建新项目。
      </div>)}
      {appStore.showJoinProject && <JoinProject
        visible={appStore.showJoinProject}
        onChange={(val) => (appStore.showJoinProject = val)}
      />}
      {appStore.showCreateProject && <CreatedProject
        visible={appStore.showCreateProject}
        onChange={(val) => (appStore.showCreateProject = val)}
      />}
      {renderPjItemChange()}

      <div className={cls.adArea}>
        <Carousel autoplay>
          <a href="htttp://wwww.linksaas.pro" target="_blank" rel="noreferrer">
            <img
              src={adImg}
            />
          </a>
          {appStore.clientCfg && appStore.clientCfg.ad_list.map(
            item => (
              <a key={item.img_url} href={item.url} target="_blank" rel="noreferrer" aria-disabled={item.url == ""}>
                <img src={item.img_url} />
              </a>
            ))}
        </Carousel>
      </div>
    </Sider>
  );
};
export default observer(Header);
