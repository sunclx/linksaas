import { PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import style from './index.module.less';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { exit } from '@tauri-apps/api/process';
import { useStores } from '@/hooks';
import { BugOutlined } from '@ant-design/icons';

const { Header } = Layout;

let windowSize: PhysicalSize = new PhysicalSize(1300, 750);
let windowPostion: PhysicalPosition = new PhysicalPosition(0, 0);

const MyHeader: React.FC<{ type?: string; style?: React.CSSProperties; className?: string }> = ({
  ...props
}) => {
  const userStore = useStores('userStore');

  const handleClick = async function handleClick(type: string) {
    switch (type) {
      case 'close':
        if (userStore.sessionId === '') {
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
      <div className={style.l}>
        <h1 />
      </div>
      <div className={style.r}>
        <a href="https://jihulab.com/linksaas/desktop/-/issues" target="_blank" rel="noreferrer" style={{ marginRight: "20px" }} title="报告缺陷"><BugOutlined /></a>
        {userStore.sessionId != "" && <div className={style.btnMinimize} onClick={() => handleClick('minimize')} title="最小化" />}
        {userStore.sessionId != "" && <div className={style.btnMaximize} onClick={() => handleClick('maximize')} title="最大化/恢复" />}
        <div className={style.btnClose} onClick={() => handleClick('close')} title="关闭" />
      </div>
    </Header>
  );
};

export default observer(MyHeader);
