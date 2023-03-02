import { PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { appWindow } from '@tauri-apps/api/window';
import React, { useEffect, useState } from 'react';
import style from './index.module.less';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { exit } from '@tauri-apps/api/process';
import { useStores } from '@/hooks';
import { ArrowsAltOutlined, BugOutlined, BulbOutlined, InfoCircleOutlined, ShrinkOutlined } from '@ant-design/icons';
import { remove_info_file } from '@/api/local_api';
import ProjectQuickAccess from './ProjectQuickAccess';
import { checkUpdate } from '@tauri-apps/api/updater';
import { check_update } from '@/api/main';

const { Header } = Layout;

let windowSize: PhysicalSize = new PhysicalSize(1300, 750);
let windowPostion: PhysicalPosition = new PhysicalPosition(0, 0);

const MyHeader: React.FC<{ type?: string; style?: React.CSSProperties; className?: string }> = ({
  ...props
}) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const appStore = useStores('appStore');

  const [hasNewVersion, setHasNewVersion] = useState(false);

  const handleClick = async function handleClick(type: string) {
    switch (type) {
      case 'close':
        if (userStore.sessionId == "" && userStore.adminSessionId == "") {
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

  useEffect(() => {
    if (props.type == "login") {
      checkUpdate().then(res => {
        setHasNewVersion(res.shouldUpdate);
      });
    }
  }, [])
  return (
    <Header className={style.layout_header} {...props} data-tauri-drag-region={true}>
      <div className={style.l} >
        {projectStore.curProjectId != "" && userStore.sessionId != "" && <ProjectQuickAccess />}
      </div>
      <div className={style.r}>
        {props.type == "login" && hasNewVersion == true && (
          <a style={{ marginRight: "20px" }} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            check_update();
          }}>
            <InfoCircleOutlined />&nbsp;有新版本
          </a>
        )}
        {appStore.simpleMode == false && (
          <>
            <a href="https://doc.linksaas.pro/" target="_blank" rel="noreferrer" style={{ marginRight: "20px" }} title="使用文档"><BulbOutlined /></a>
            <a href="https://jihulab.com/linksaas/desktop/-/issues" target="_blank" rel="noreferrer" style={{ marginRight: "30px" }} title="报告缺陷"><BugOutlined /></a>
          </>
        )}

        {appStore.simpleMode == true && (
          <div
            className={style.btnSimpleMode}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              appStore.simpleMode = false;
            }} title='退出精简模式'><ArrowsAltOutlined /></div>
        )}
        {appStore.simpleMode == false && projectStore.curProjectId != "" && (
          <div
            className={style.btnSimpleMode}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              appStore.simpleMode = true;
            }} title='进入精简模式'><ShrinkOutlined /></div>
        )}

        {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMinimize} onClick={() => handleClick('minimize')} title="最小化" />}
        {appStore.simpleMode == false && (
          <>
            {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMaximize} onClick={() => handleClick('maximize')} title="最大化/恢复" />}
          </>
        )}
        <div className={style.btnClose} onClick={() => handleClick('close')} title="关闭" />
      </div>
    </Header>
  );
};

export default observer(MyHeader);
