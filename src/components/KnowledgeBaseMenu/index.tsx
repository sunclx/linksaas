import { useStores } from '@/hooks';
import { APP_PROJECT_KB_CB_PATH, APP_PROJECT_KB_DOC_PATH } from '@/utils/constant';
import { Popover, Modal, Input, message } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import DocSpace from './components/DocSpace';
import s from './index.module.less';
import { ReactComponent as ContentMansvg } from '@/assets/svg/content_man.svg';
import * as prjDocApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';


const KnowledgeBaseMenu = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const memberStore = useStores('memberStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');


  const [showAddModal, setShowAddModal] = useState(false);
  const [spaceTitle, setSpaceTitle] = useState("");

  let isAdmin = false;
  const memberInfo = memberStore.getMember(userStore.userInfo.userId);
  if (memberInfo !== undefined) {
    if (memberInfo.member.can_admin) {
      isAdmin = true;
    }
  }

  const addDocSpace = async () => {
    const title = spaceTitle.trim();
    if (title == "") {
      message.warn("文档空间标题不能为空");
      return;
    }
    const res = await request(prjDocApi.create_doc_space({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      base_info: {
        title: title,
      },
    }));
    if (res) {
      await docSpaceStore.updateDocSpace(res.doc_space_id);
      setShowAddModal(false);
      message.info("创建文档空间成功");
    }
  };

  const docRightTop = () => {
    return (
      <div className={s.submenu_icon_wrap}>
        {isAdmin && (
          <Popover
            placement="bottomLeft"
            trigger="click"
            overlayClassName="popover"
          >
            <a
              className={s.icon_wrap}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setShowAddModal(true);
              }}
            >
              <i className={s.add} />
            </a>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className={s.menu_wrap}>
      <div
        className={classNames(s.content_block, pathname.startsWith(APP_PROJECT_KB_DOC_PATH) && !docSpaceStore.recycleBin && s.active)}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (docSpaceStore.inEdit) {
            docSpaceStore.showCheckLeave(() => {
              docSpaceStore.showDocList(projectStore.curProject?.default_doc_space_id ?? "", false);
              history.push(APP_PROJECT_KB_DOC_PATH);
            });
            return;
          }
          docSpaceStore.showDocList(projectStore.curProject?.default_doc_space_id ?? "", false);
          history.push(APP_PROJECT_KB_DOC_PATH);
        }}
      >
        <FileTextOutlined /> 文档空间{docRightTop()}
      </div>
      <div className={s.doc_space_wrap}>
        <DocSpace />
      </div>
      <div
        className={classNames(s.content_block, pathname.startsWith(APP_PROJECT_KB_DOC_PATH) && docSpaceStore.recycleBin && s.active)}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (docSpaceStore.inEdit) {
            docSpaceStore.showCheckLeave(() => {
              docSpaceStore.showDocList("", true);
              history.push(APP_PROJECT_KB_DOC_PATH);
            });
            return;
          }
          docSpaceStore.showDocList("", true);
          history.push(APP_PROJECT_KB_DOC_PATH);
        }}
      >
        <DeleteOutlined /> 文档回收站
      </div>
      <div
        className={classNames(s.content_block, pathname.startsWith(APP_PROJECT_KB_CB_PATH) && s.active)}
        onClick={() => {
          if (docSpaceStore.inEdit) {
            docSpaceStore.showCheckLeave(() => {
              history.push(APP_PROJECT_KB_CB_PATH);
            });
            return;
          }
          history.push(APP_PROJECT_KB_CB_PATH);
        }}
      >
        <ContentMansvg /> 可变内容块管理
      </div>
      {showAddModal && (
        <Modal
          title="创建文档空间"
          open={showAddModal}
          onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            setShowAddModal(false);
          }}
          onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            addDocSpace();
          }}
        >
          <Input addonBefore="文档空间名称" onChange={e => {
            e.stopPropagation();
            e.preventDefault();
            setSpaceTitle(e.target.value);
          }} />
        </Modal>
      )}
    </div>
  );
};
export default observer(KnowledgeBaseMenu);
