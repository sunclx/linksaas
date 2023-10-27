import { PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { appWindow } from '@tauri-apps/api/window';
import React, { useEffect, useState } from 'react';
import style from './index.module.less';
import { Button, Layout, Popover, Progress, Space, message } from 'antd';
import { observer } from 'mobx-react';
import { exit } from '@tauri-apps/api/process';
import { useStores } from '@/hooks';
import { BugOutlined, EditOutlined, HomeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { remove_info_file } from '@/api/local_api';
import { checkUpdate } from '@tauri-apps/api/updater';
import { check_update } from '@/api/main';
import { listen } from '@tauri-apps/api/event';
import { APP_PROJECT_HOME_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH } from '@/utils/constant';
import { useHistory, useLocation } from 'react-router-dom';
import ProjectQuickAccess from './ProjectQuickAccess';
import EntryPopover from '@/pages/Project/Home/EntryPopover';
import { ENTRY_TYPE_SPRIT } from '@/api/project_entry';
import { watch, unwatch, WATCH_TARGET_ENTRY } from "@/api/project_watch";
import moment from 'moment';
import { request } from '@/utils/request';

const { Header } = Layout;

let windowSize: PhysicalSize = new PhysicalSize(1300, 750);
let windowPostion: PhysicalPosition = new PhysicalPosition(0, 0);

const MyHeader: React.FC<{ type?: string; style?: React.CSSProperties; className?: string }> = ({
  ...props
}) => {
  const history = useHistory();
  const location = useLocation();

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const entryStore = useStores('entryStore');
  const docStore = useStores('docStore');

  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

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

  const genEntryTitle = (): string => {
    if (entryStore.curEntry == null) {
      return "";
    }
    if (entryStore.curEntry.entry_type == ENTRY_TYPE_SPRIT) {
      return `${entryStore.curEntry.entry_title}(${moment(entryStore.curEntry.extra_info.ExtraSpritInfo?.start_time ?? 0).format("YYYY-MM-DD")}至${moment(entryStore.curEntry.extra_info.ExtraSpritInfo?.end_time ?? 0).format("YYYY-MM-DD")})`;
    }
    return entryStore.curEntry.entry_title;
  }

  const watchEntry = async () => {
    await request(watch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      target_type: WATCH_TARGET_ENTRY,
      target_id: entryStore.curEntry?.entry_id ?? "",
    }));
    entryStore.updateEntry(entryStore.curEntry?.entry_id ?? "");
  };

  const unwatchEntry = async () => {
    await request(unwatch({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      target_type: WATCH_TARGET_ENTRY,
      target_id: entryStore.curEntry?.entry_id ?? "",
    }));
    entryStore.updateEntry(entryStore.curEntry?.entry_id ?? "");
  }

  useEffect(() => {
    if (props.type == "login") {
      checkUpdate().then(res => {
        setHasNewVersion(res.shouldUpdate);
      });
    }
  }, []);

  useEffect(() => {
    const unlisten = listen<number>("updateProgress", ev => {
      console.log(ev);
      if (ev.payload >= 0) {
        setUpdateProgress(oldValue => {
          if (oldValue > 0.98) {
            return 1.0;
          }
          return oldValue + ev.payload
        });
      } else {
        message.error("更新出错");
        setUpdateProgress(0);
      }
    })
    return () => {
      unlisten.then(f => f());
    }
  }, []);


  return (
    <div>
      <div style={{ height: "4px", backgroundColor: "white", borderTop: "1px solid #e8e9ee" }} />
      <Header className={style.layout_header} {...props} data-tauri-drag-region>
        {projectStore.curProjectId != "" && (
          <div>
            <ProjectQuickAccess />
            {location.pathname.startsWith(APP_PROJECT_HOME_PATH) == false && (
              <Button type="text"
                title='返回项目主页'
                icon={<HomeTwoTone style={{ fontSize: "22px" }} twoToneColor={["orange", "white"]} />}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (docStore.inEdit) {
                    docStore.showCheckLeave(() => {
                      entryStore.reset();
                      history.push(APP_PROJECT_HOME_PATH);
                    });
                  } else {
                    entryStore.reset();
                    history.push(APP_PROJECT_HOME_PATH);
                  }
                }} />
            )}

            <Space size="small" style={{ fontSize: "16px", marginLeft: "10px", lineHeight: "26px", cursor: "default" }}>
              {location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) && (
                <>
                  <span>/</span>
                  <span>我的工作</span>
                </>
              )}
              {location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) && (
                <>
                  <span>/</span>
                  <span>项目概览</span>
                </>
              )}
              {location.pathname.startsWith(APP_PROJECT_MY_WORK_PATH) == false && location.pathname.startsWith(APP_PROJECT_OVERVIEW_PATH) == false
                && location.pathname.startsWith(APP_PROJECT_HOME_PATH) == false
                && entryStore.curEntry != null && (
                  <>
                    <span>/</span>
                    <Popover trigger={["hover", "click"]} placement='top' content={<EntryPopover entryInfo={entryStore.curEntry} />}>
                      <InfoCircleOutlined />
                    </Popover>
                    <span>
                      <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (entryStore.curEntry?.my_watch == true) {
                          unwatchEntry();
                        } else {
                          watchEntry();
                        }
                      }}>
                        <span className={(entryStore.curEntry?.my_watch ?? false) ? style.isCollect : style.noCollect} />
                      </a>
                    </span>
                    <div style={{ maxWidth: "200px", textOverflow: "clip", overflow: "hidden", whiteSpace: "nowrap" }} title={genEntryTitle()}>{genEntryTitle()}</div>
                    {entryStore.curEntry.can_update && (
                      <Button type="link" icon={<EditOutlined />} style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        entryStore.editEntryId = entryStore.curEntry?.entry_id ?? "";
                      }} />
                    )}

                  </>
                )}
            </Space>
          </div>
        )}
        <div className={style.l} />
        <div className={style.r}>
          {props.type == "login" && hasNewVersion == true && (
            <a style={{ marginRight: "20px" }} onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              check_update();
            }}>
              <Space size="small">
                <InfoCircleOutlined />
                {updateProgress == 0 && "有新版本"}
                {updateProgress > 0 && (
                  <Progress type="line" percent={Math.ceil(updateProgress * 100)} showInfo={false} style={{ width: 50, paddingBottom: "16px" }} />
                )}
              </Space>
            </a>
          )}
          <a href="https://atomgit.com/openlinksaas/desktop/issues" target="_blank" rel="noreferrer" style={{ marginRight: "20px" }} title="报告缺陷"><BugOutlined /></a>
          {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMinimize} onClick={() => handleClick('minimize')} title="最小化" />}
          {(userStore.sessionId != "" || userStore.adminSessionId != "") && <div className={style.btnMaximize} onClick={() => handleClick('maximize')} title="最大化/恢复" />}
          <div className={style.btnClose} onClick={() => handleClick('close')} title="关闭" />
        </div>
      </Header>
    </div>
  );
};

export default observer(MyHeader);
