import {
  useCommands,
  useAttrs,
  useActive,
  useRemirrorContext,
  useCurrentSelection,
  useEditorState,
} from '@remirror/react';

import React, { useEffect, useState } from 'react';
import { Dropdown, Select, Menu, Tooltip, Button } from 'antd';
import { DownOutlined, ExclamationOutlined } from '@ant-design/icons';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { uniqId } from '@/utils/utils';
import { request } from '@/utils/request';
import * as fsApi from '@/api/fs';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import {
  WIDGET_TYPE_REQUIRE_MENT_REF,
  WIDGET_TYPE_TASK_REF,
  WIDGET_TYPE_BUG_REF,
  WIDGET_TYPE_MERMAID,
  WidgetTypeList,
  WIDGET_TYPE_SPRIT_REF,
  WIDGET_TYPE_API_COLL_REF,
} from '../widgets/index';
import type { HeadingExtensionAttributes } from '@remirror/extension-heading';
import { redoDepth, undoDepth } from '@remirror/pm/history';
import ToolbarGroup from './ToolbarGroup';

const UndoBtn = () => {
  const commands = useCommands();
  const context = useRemirrorContext({ autoUpdate: true });

  const depth = undoDepth(context.getState());

  return (
    <Tooltip title="撤销">
      <div
        className={depth > 0 ? 'undo-enable-btn' : 'undo-disable-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (depth > 0) {
            commands.undo();
          }
        }}
      />
    </Tooltip>
  );
};

const RedoBtn = () => {
  const commands = useCommands();
  const context = useRemirrorContext({ autoUpdate: true });

  const depth = redoDepth(context.getState());

  return (
    <Tooltip title="恢复">
      <div
        className={depth > 0 ? 'redo-enable-btn' : 'redo-disable-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (depth > 0) {
            commands.redo();
          }
        }}
      />
    </Tooltip>
  );
};

export const historyItem = (
  <ToolbarGroup
    key="history"
    items={[<UndoBtn key="undo" />, <RedoBtn key="redo" />]}
    separator={true} />
);

const CopyBtn = () => {
  const commands = useCommands();
  useCurrentSelection();

  const enabled = commands.copy.enabled();

  return (
    <Tooltip title="复制">
      <div
        className={enabled ? 'copy-enable-btn' : 'copy-disable-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (enabled) {
            commands.copy();
          }
        }}
      />
    </Tooltip>
  );
};

const CutBtn = () => {
  const commands = useCommands();
  useCurrentSelection();

  const enabled = commands.cut.enabled();

  return (
    <Tooltip title="剪切">
      <div
        className={enabled ? 'cut-enable-btn' : 'cut-disable-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (enabled) {
            commands.cut();
          }
        }}
      />
    </Tooltip>
  );
};

const PasteBtn = () => {
  const commands = useCommands();
  useEditorState();

  const enabled = commands.paste.enabled();

  return (
    <Tooltip title="粘贴">
      <div
        className={enabled ? 'paste-enable-btn' : 'paste-disable-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (enabled) {
            commands.paste();
          }
        }}
      />
    </Tooltip>
  );
};

export const clipboardItem = (
  <ToolbarGroup
    key="clipboard"
    items={[<CopyBtn key="copy" />, <CutBtn key="cut" />, <PasteBtn key="paste" />]}
    separator={true} />
);


const HeadBtn = () => {
  const attrs = useAttrs();
  const active = useActive();
  const commands = useCommands();

  const [typeName, setTypeName] = useState('正文');

  const items = ['一级标题', '二级标题', '三级标题', '四级标题', '五级标题', '六级标题', '正文'];

  useEffect(() => {
    const headAttr = attrs.heading();
    if (headAttr !== undefined) {
      const lv = (headAttr as HeadingExtensionAttributes).level!;
      switch (lv) {
        case 1:
          setTypeName('一级标题');
          break;
        case 2:
          setTypeName('二级标题');
          break;
        case 3:
          setTypeName('三级标题');
          break;
        case 4:
          setTypeName('四级标题');
          break;
        case 5:
          setTypeName('五级标题');
          break;
        case 6:
          setTypeName('六级标题');
          break;
        default:
          break;
      }
    } else {
      setTypeName('正文');
    }
  }, [
    active.heading({ level: 1 }),
    active.heading({ level: 2 }),
    active.heading({ level: 3 }),
    active.heading({ level: 4 }),
    active.heading({ level: 5 }),
    active.heading({ level: 6 }),
  ]);

  const changeHead = (value: string) => {
    commands.convertParagraph();
    if (value == '一级标题') {
      commands.toggleHeading({ level: 1 });
    } else if (value == '二级标题') {
      commands.toggleHeading({ level: 2 });
    } else if (value == '三级标题') {
      commands.toggleHeading({ level: 3 });
    } else if (value == '四级标题') {
      commands.toggleHeading({ level: 4 });
    } else if (value == '五级标题') {
      commands.toggleHeading({ level: 5 });
    } else if (value == '六级标题') {
      commands.toggleHeading({ level: 6 });
    }
  };
  return (
    <Select
      style={{ width: '80px', marginLeft: '5px' }}
      bordered={false}
      onChange={(value) => changeHead(value)}
      value={typeName}
    >
      {items.map((item) => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
};

export const headItem = (
  <ToolbarGroup
    key="head"
    items={[<HeadBtn key="head" />]}
    separator={true} />
);

const BulletListBtn = () => {
  const active = useActive();
  const commands = useCommands();

  return (
    <Tooltip title="无序列表">
      <div
        className={active.bulletList() ? 'bullet-list-active-btn' : 'bullet-list-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          commands.toggleBulletList();
        }}
      />
    </Tooltip>
  );
};

const OrderedListBtn = () => {
  const active = useActive();
  const commands = useCommands();

  return (
    <Tooltip title="有序列表">
      <div
        className={active.orderedList() ? 'order-list-active-btn' : 'order-list-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          commands.toggleOrderedList();
        }}
      />
    </Tooltip>
  );
};

const TaskListBtn = () => {
  const active = useActive();
  const commands = useCommands();

  return (
    <Tooltip title="任务列表">
      <div
        className={active.taskList() ? 'bullet-list-active-btn' : 'bullet-list-btn'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          commands.toggleTaskList();
        }}
      />
    </Tooltip>
  );
};

export const listItem = (
  <ToolbarGroup
    key="list"
    items={[<BulletListBtn key="bulletList" />, <OrderedListBtn key="orderList" />, <TaskListBtn key="taskList" />]}
    separator={true} />
);


const ContentWidget = observer(() => {
  const projectStore = useStores('projectStore');
  const commands = useCommands();

  const items = [];
  if (projectStore.curProjectId !== "") {
    items.push({
      key: 'manager',
      label: '项目管理',
      children: [
        {
          key: WIDGET_TYPE_REQUIRE_MENT_REF,
          label: "引用需求",
        },
        {
          key: WIDGET_TYPE_TASK_REF,
          label: '引用任务',
        },
        {
          key: WIDGET_TYPE_BUG_REF,
          label: '引用缺陷',
        },
        {
          key: WIDGET_TYPE_SPRIT_REF,
          label: '引用工作计划'
        }
      ],
    });
  }
  const designItems = {
    key: 'design',
    label: '软件设计',
    children: [
      {
        key: WIDGET_TYPE_MERMAID,
        label: 'mermaid',
      },
    ],
  };
  if (projectStore.curProject?.setting.disable_api_collection == false) {
    designItems.children.push({
      key: WIDGET_TYPE_API_COLL_REF,
      label: "引用接口集合",
    });
  }
  items.push(designItems);
  const menu = (
    <Menu
      subMenuCloseDelay={0.05}
      onClick={(value) => {
        const index = WidgetTypeList.findIndex((item) => item == value.key);
        if (index != -1) {
          commands.insertWidget(value.key);
        }
      }}
      items={items}
    />
  );
  return (
    <Dropdown overlay={menu}>
      <Tooltip title="内容组件">
        <div className="widget-btn">
          <DownOutlined />
        </div>
      </Tooltip>
    </Dropdown>
  );
});

export const contentWidgetItem = (
  <ToolbarGroup
    key="widget"
    items={[<ContentWidget key="widget" />]}
    separator={false} />
);

interface UploadImageProps {
  fsId: string;
  thumbWidth: number;
  thumbHeight: number;
  ownerType: fsApi.FILE_OWNER_TYPE;
  ownerId: string;
}

const AddUploadImage: React.FC<UploadImageProps> = observer((props) => {
  interface UploadInfo {
    fileName: string;
    filePath: string;
    trackId: string;
    thumbTrackId: string;
  }

  const userStore = useStores('userStore');
  const commands = useCommands();
  const upload = async () => {
    const selected = await open_dialog({
      multiple: true,
      filters: [
        {
          name: '图片',
          extensions: ['png', 'jpg', 'jpeg', 'gif'],
        },
      ],
    });
    let fileList: string[] = [];
    if (Array.isArray(selected)) {
      fileList = selected;
    } else if (selected === null) {
      //do nothing
    } else {
      fileList.push(selected);
    }
    const uploadInfoList: UploadInfo[] = [];
    //获取filename
    for (const file of fileList) {
      let fileName = file.replaceAll('\\', '/');
      const pos = fileName.lastIndexOf('/');
      if (pos != -1) {
        fileName = fileName.substring(pos + 1);
      }
      uploadInfoList.push({
        filePath: file,
        fileName: fileName,
        trackId: uniqId(),
        thumbTrackId: uniqId(),
      });
    }
    //创建node
    for (const uploadInfo of uploadInfoList) {
      commands.insertImageUpload(
        uploadInfo.trackId,
        uploadInfo.thumbTrackId,
        props.fsId,
        uploadInfo.fileName,
      );
    }
    //上传文件
    for (const uploadInfo of uploadInfoList) {
      //上传缩略图
      const thumbRes = await request(
        fsApi.write_thumb_image_file(
          userStore.sessionId,
          props.fsId,
          uploadInfo.filePath,
          uploadInfo.thumbTrackId,
          props.thumbWidth,
          props.thumbHeight,
        ),
      );
      await request(
        fsApi.set_file_owner({
          session_id: userStore.sessionId,
          fs_id: props.fsId,
          file_id: thumbRes.file_id,
          owner_type: props.ownerType,
          owner_id: props.ownerId,
        }),
      );
      //上传正式图片
      const res = await request(
        fsApi.write_file(userStore.sessionId, props.fsId, uploadInfo.filePath, uploadInfo.trackId),
      );
      await request(
        fsApi.set_file_owner({
          session_id: userStore.sessionId,
          fs_id: props.fsId,
          file_id: res.file_id,
          owner_type: props.ownerType,
          owner_id: props.ownerId,
        }),
      );
    }
  };
  return (
    <Tooltip title="图片">
      <div className="img-btn" onClick={() => upload()} />
    </Tooltip>
  );
});

interface UploadFileProps {
  fsId: string;
  ownerType: fsApi.FILE_OWNER_TYPE;
  ownerId: string;
}

const AddUploadFile: React.FC<UploadFileProps> = observer((props) => {
  interface UploadInfo {
    fileName: string;
    filePath: string;
    trackId: string;
  }
  const userStore = useStores('userStore');
  const commands = useCommands();

  const upload = async () => {
    const selected = await open_dialog({
      multiple: true,
    });
    let fileList: string[] = [];
    if (Array.isArray(selected)) {
      fileList = selected;
    } else if (selected === null) {
      //do nothing
    } else {
      fileList.push(selected);
    }
    const uploadInfoList: UploadInfo[] = [];
    //获取filename
    for (const file of fileList) {
      let fileName = file.replaceAll('\\', '/');
      const pos = fileName.lastIndexOf('/');
      if (pos != -1) {
        fileName = fileName.substring(pos + 1);
      }
      uploadInfoList.push({
        filePath: file,
        fileName: fileName,
        trackId: uniqId(),
      });
    }
    //创建node
    for (const uploadInfo of uploadInfoList) {
      commands.insertFileUpload(uploadInfo.trackId, props.fsId, uploadInfo.fileName);
    }
    //上传文件
    for (const uploadInfo of uploadInfoList) {
      const res = await request(
        fsApi.write_file(userStore.sessionId, props.fsId, uploadInfo.filePath, uploadInfo.trackId),
      );
      await request(
        fsApi.set_file_owner({
          session_id: userStore.sessionId,
          fs_id: props.fsId,
          file_id: res.file_id,
          owner_type: props.ownerType,
          owner_id: props.ownerId,
        }),
      );
    }
  };

  return (
    <Tooltip title="文件">
      <div className="file-btn" onClick={() => upload()} />
    </Tooltip>
  );
});

const AddCode = () => {
  const commands = useCommands();

  return (
    <Tooltip title="代码">
      <div className="code-btn" onClick={() => commands.insertCode()} />
    </Tooltip>
  );
};

const AddTable = () => {
  const commands = useCommands();

  return (
    <Tooltip title="表格">
      <div className="table-btn" onClick={() => commands.createTable({ withHeaderRow: false })} />
    </Tooltip>
  );
};

const AddKatex = () => {
  const commands = useCommands();

  return (
    <Tooltip title="数学公式">
      <div className="math-btn" onClick={() => commands.insertKatex()} />
    </Tooltip>
  );
};

const AddCallout = () => {
  const { toggleCallout, updateCallout } = useCommands();
  const active = useActive();

  const [hover, setHover] = useState(false);

  const infoEnable = active.callout({ type: "info" });
  const warningEnable = active.callout({ type: "warning" });
  const errorEnable = active.callout({ type: "error" });
  const successEnable = active.callout({ type: "success" });

  return (
    <Tooltip title="提示">
      <Dropdown placement='bottom' menu={{
        items: [
          {
            key: "info",
            label: <div style={{ backgroundColor: "#eef6fc", width: "80px", textAlign: "center", padding: "4px 4px", color: "#3298dc", fontWeight: 700 }}>提示</div>,
          },
          {
            key: "warning",
            label: <div style={{ backgroundColor: "#fffbeb", width: "80px", textAlign: "center", padding: "4px 4px", color: "#ffdd57", fontWeight: 700 }}>警告</div>,
          },
          {
            key: "error",
            label: <div style={{ backgroundColor: "#feecf0", width: "80px", textAlign: "center", padding: "4px 4px", color: "#f14668", fontWeight: 700 }}>错误</div>,
          },
          {
            key: "success",
            label: <div style={{ backgroundColor: "#effaf3", width: "80px", textAlign: "center", padding: "4px 4px", color: "#48c774", fontWeight: 700 }}>成功</div>,
          },
          {
            key: "cancel",
            label: <div style={{ backgroundColor: "white", width: "80px", textAlign: "center", padding: "4px 4px", fontWeight: 700 }}>取消</div>,
            disabled: !(infoEnable || warningEnable || errorEnable || successEnable),
          },
        ],
        onClick: (info) => {
          if (info.key == "cancel") {
            if (infoEnable) {
              toggleCallout({ type: "info" });
            } else if (warningEnable) {
              toggleCallout({ type: "warning" });
            } else if (errorEnable) {
              toggleCallout({ type: "error" });
            } else if (successEnable) {
              toggleCallout({ type: "success" });
            }
          } else if (infoEnable || warningEnable || errorEnable || successEnable) {
            updateCallout({ type: info.key });
          } else {
            toggleCallout({ type: info.key });
          }
        },
      }} >
        <Button type="text" style={{ backgroundColor: hover ? "#d0d0d0" : "inherit", height: "25px", padding: "0px 0px", width: "35px" }}
          onMouseEnter={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(true);
          }}
          onMouseLeave={e => {
            e.stopPropagation();
            e.preventDefault();
            setHover(false);
          }}><ExclamationOutlined /></Button>
      </Dropdown>
    </Tooltip>
  );
}

export interface NewCommItemParam {
  fsId: string;
  thumbWidth: number;
  thumbHeight: number;
  ownerType: fsApi.FILE_OWNER_TYPE;
  ownerId: string;
}


export const newCommItem = (param: NewCommItemParam) => {
  const items = [];
  if (param.fsId != "") {
    items.push(<AddUploadImage
      key="image"
      fsId={param.fsId}
      thumbWidth={param.thumbWidth}
      thumbHeight={param.thumbHeight}
      ownerType={param.ownerType}
      ownerId={param.ownerId}
    />);
    items.push(
      <AddUploadFile key="file" fsId={param.fsId} ownerType={param.ownerType} ownerId={param.ownerId} />
    );
  }
  return (
    <ToolbarGroup
      key="common"
      items={[
        ...items,
        <AddCode key="code" />,
        <AddTable key="table" />,
        <AddKatex key="katex" />,
        <AddCallout key="callout" />,
      ]}
      separator={true} />
  );
};
