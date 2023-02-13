import {
  useCommands,
  useAttrs,
  useActive,
  useRemirrorContext,
  useCurrentSelection,
  useEditorState,
} from '@remirror/react';

import React, { useEffect, useState } from 'react';
import { Dropdown, Select, Menu, Tooltip } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { DownOutlined } from '@ant-design/icons';
import { open as open_dialog } from '@tauri-apps/api/dialog';
import { uniqId } from '@/utils/utils';
import { request } from '@/utils/request';
import * as fsApi from '@/api/fs';
import * as vcApi from '@/api/project_vc';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import {
  WIDGET_TYPE_FUNNEL,
  WIDGET_TYPE_REQUIRE_MENT_REF,
  WIDGET_TYPE_TASK_REF,
  WIDGET_TYPE_BUG_REF,
  WIDGET_TYPE_5W2H,
  WIDGET_TYPE_MEMBER_DUTY,
  WIDGET_TYPE_OTSW,
  WIDGET_TYPE_SOAR,
  WIDGET_TYPE_SWAGGER,
  WIDGET_TYPE_SWOT,
  WIDGET_TYPE_TECH_COMPARE,
  WIDGET_TYPE_TIME_RANGE,
  WIDGET_TYPE_MERMAID,
  WIDGET_TYPE_MARK_MAP,
  // WIDGET_TYPE_MYSQL_QUERY,
  // WIDGET_TYPE_MONGO_QUERY,
  WIDGET_TYPE_GITLAB_LIST_GROUP,
  WIDGET_TYPE_GITLAB_LIST_PROJECT,
  WIDGET_TYPE_GITLAB_LIST_WIKI,
  WIDGET_TYPE_GITLAB_LIST_COMMIT,
  WIDGET_TYPE_GITLAB_LIST_ISSUE,
  WIDGET_TYPE_SURVEY_CHOICE,
  WIDGET_TYPE_SURVEY_TRUE_OR_FALSE,
  WidgetTypeList,
  WIDGET_TYPE_SPRIT_REF,
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


const ContentWidget = () => {
  const commands = useCommands();
  const menu = (
    <Menu
      subMenuCloseDelay={0.05}
      onClick={(value) => {
        const index = WidgetTypeList.findIndex((item) => item == value.key);
        if (index != -1) {
          commands.insertWidget(value.key);
        }
      }}
      items={[
        {
          key: 'manager',
          label: '项目管理',
          children: [
            {
              key: WIDGET_TYPE_TIME_RANGE,
              label: '时间区间',
            },
            {
              key: WIDGET_TYPE_MEMBER_DUTY,
              label: '人员职责',
            },
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
              label: '引用迭代'
            }
          ],
        },
        {
          key: 'analyse',
          label: '项目分析',
          children: [
            {
              key: WIDGET_TYPE_TECH_COMPARE,
              label: '技术对比',
            },
            {
              key: WIDGET_TYPE_SWOT,
              label: 'SWOT分析',
            },
            {
              key: WIDGET_TYPE_OTSW,
              label: 'OTSW分析',
            },
            {
              key: WIDGET_TYPE_SOAR,
              label: 'SOAR分析',
            },
            {
              key: WIDGET_TYPE_5W2H,
              label: '七问分析',
            },
            {
              key: WIDGET_TYPE_FUNNEL,
              label: '漏斗模型',
            },
          ],
        },
        {
          key: 'design',
          label: '软件设计',
          children: [
            {
              key: WIDGET_TYPE_MARK_MAP,
              label: 'markmap',
            },
            {
              key: WIDGET_TYPE_MERMAID,
              label: 'mermaid',
            },
            {
              key: WIDGET_TYPE_SWAGGER,
              label: 'swagger',
            },
          ],
        },
        {
          key: 'data',
          label: '数据获取',
          children: [
            {
              key: 'gitlab',
              label: 'gitlab',
              children: [
                {
                  key: WIDGET_TYPE_GITLAB_LIST_GROUP,
                  label: '列出项目组',
                },
                {
                  key: WIDGET_TYPE_GITLAB_LIST_PROJECT,
                  label: '列出项目',
                },
                {
                  key: WIDGET_TYPE_GITLAB_LIST_WIKI,
                  label: '列出WIKI',
                },
                {
                  key: WIDGET_TYPE_GITLAB_LIST_COMMIT,
                  label: '列出COMMIT',
                },
                {
                  key: WIDGET_TYPE_GITLAB_LIST_ISSUE,
                  label: '列出工单',
                },
              ],
            },
          ],
        },
        {
          key: 'survey',
          label: '知识巩固',
          children: [
            {
              key: WIDGET_TYPE_SURVEY_CHOICE,
              label: '选择题',
            },
            {
              key: WIDGET_TYPE_SURVEY_TRUE_OR_FALSE,
              label: '对错题',
            },
          ],
        },
      ]}
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
};

export const contentWidgetItem = (
  <ToolbarGroup
    key="widget"
    items={[<ContentWidget key="widget" />]}
    separator={false} />
);


const VcWidget = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const commands = useCommands();
  const [items, setItems] = useState<ItemType[]>([]);

  const loadItems = async () => {
    const res = await request(
      vcApi.list_all({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
      }),
    );
    if (!res) {
      return;
    }
    const menuItemList = res.coll_list.map((coll) => {
      return {
        key: coll.block_coll_id,
        label: coll.title,
        children: coll.block_list.map((block) => {
          return {
            key: block.block_id,
            label: block.title,
          };
        }),
      };
    });
    setItems(menuItemList);
  };

  useEffect(() => {
    if (items.length > 0) {
      return;
    }
    loadItems();
  }, []);

  const menu = (
    <Menu
      subMenuCloseDelay={0.05}
      onClick={(value) => {
        if (value.keyPath.length != 2) {
          return;
        }
        commands.insertVariableContent(projectStore.curProjectId, value.keyPath[1], value.key);
      }}
      items={items}
    />
  );
  return (
    <Dropdown overlay={menu}>
      <Tooltip title="可变内容块">
        <div className="vc-btn">
          <DownOutlined />
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export const vcWidgetItem = (
  <ToolbarGroup
    key="vc"
    items={[<VcWidget key="vc" />]}
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

const AddExcaliDraw = () => {
  const commands = useCommands();

  return (
    <Tooltip title="白板">
      <div className="draw-btn" onClick={() => commands.insertExcaliDraw()} />
    </Tooltip>
  );
};

const AddCode = () => {
  const commands = useCommands();

  return (
    <Tooltip title="代码">
      <div className="code-btn" onClick={() => commands.insertCode()} />
    </Tooltip>
  );
};

const AddFortuneSheet = () => {
  const commands = useCommands();

  return <div className="table-btn" onClick={() => commands.insertFortuneSheet()} />;
};

export interface NewCommItemParam {
  fsId: string;
  thumbWidth: number;
  thumbHeight: number;
  ownerType: fsApi.FILE_OWNER_TYPE;
  ownerId: string;
}


export const newCommItem = (param: NewCommItemParam) => {
  return (
    <ToolbarGroup
      key="common"
      items={[
        <AddUploadImage
          key="image"
          fsId={param.fsId}
          thumbWidth={param.thumbWidth}
          thumbHeight={param.thumbHeight}
          ownerType={param.ownerType}
          ownerId={param.ownerId}
        />,
        <AddUploadFile key="file" fsId={param.fsId} ownerType={param.ownerType} ownerId={param.ownerId} />,
        <AddCode key="code" />,
        <AddExcaliDraw key="excaliDraw" />,
        <AddFortuneSheet key="sheet" />,
      ]}
      separator={true} />
  );
};
