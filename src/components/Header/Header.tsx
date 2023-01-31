import { PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import style from './index.module.less';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { exit } from '@tauri-apps/api/process';
import { useStores } from '@/hooks';
import { BugOutlined, BulbOutlined } from '@ant-design/icons';
import { remove_info_file } from '@/api/local_api';
import ProjectQuickAccess from './ProjectQuickAccess';

const { Header } = Layout;

let windowSize: PhysicalSize = new PhysicalSize(1300, 750);
let windowPostion: PhysicalPosition = new PhysicalPosition(0, 0);

const MyHeader: React.FC<{ type?: string; style?: React.CSSProperties; className?: string }> = ({
  ...props
}) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const handleClick = async function handleClick(type: string) {
    switch (type) {
      case 'close':
        if (userStore.sessionId == "" || userStore.adminSessionId == "") {
          await remove_info_file();
          await exit(0);
        } else {
          await appWindow.hide();
        }
        break;
      case 'minimize':
        await appWindow.minimize();
        break;
      case 'maximize':
        const isMaximized = await appWindow.isMaximized();
        if (isMaximized) {
          await appWindow.setSize(windowSize);
          if (windowPostion.x == 0 && windowPostion.y == 0) {
            await appWindow.center();
          } else {
            await appWindow.setPosition(windowPostion);
          }
        } else {
          windowSize = await appWindow.outerSize();
          windowPostion = await appWindow.outerPosition();
          await appWindow.maximize();
        }
        break;
    }
  };
  return (
    <Header className={style.layout_header} {...props} data-tauri-drag-region={true}>
      <div className={style.l} >
        {projectStore.curProjectId != "" && <ProjectQuickAccess />}
      </div>
      <div className={style.r}>
        <a href="https://doc.linksaas.pro/" target="_blank" rel="noreferrer" style={{ marginRight: "20px" }} title="使用文档"><BulbOutlined /></a>
        <a href="https://jihulab.com/linksaas/desktop/-/issues" target="_blank" rel="noreferrer" style={{ marginRight: "20px" }} title="报告缺陷"><BugOutlined /></a>
        {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMinimize} onClick={() => handleClick('minimize')} title="最小化" />}
        {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMaximize} onClick={() => handleClick('maximize')} title="最大化/恢复" />}
        <div className={style.btnClose} onClick={() => handleClick('close')} title="关闭" />
      </div>
    </Header>
  );
};

export default observer(MyHeader);
