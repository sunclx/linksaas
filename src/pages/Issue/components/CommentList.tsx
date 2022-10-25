import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import type { Comment } from '@/api/project_issue';
import { list_comment, add_comment } from '@/api/project_issue';
import { useStores } from '@/hooks';
import { is_empty_doc, ReadOnlyEditor, useCommonEditor } from '@/components/Editor';
import Pagination from '@/components/Pagination';
import UserPhoto from '@/components/Portrait/UserPhoto';
import moment from 'moment';
import { Card, Modal, message, Empty } from 'antd';
import Button from '@/components/Button';
import { FILE_OWNER_TYPE_ISSUE } from '@/api/fs';


const PAGE_SIZE = 10;

export type CommentListProp = {
  issueId: string;
};

export const CommentList: React.FC<CommentListProp> = (props) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const [commentList, setCommentList] = useState([] as Comment[]);
  const [curPage, setCurPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const { editor, editorRef } = useCommonEditor({
    content: "",
    fsId: projectStore.curProject?.issue_fs_id ?? "",
    ownerType: FILE_OWNER_TYPE_ISSUE,
    ownerId: props.issueId,
    historyInToolbar: false,
    clipboardInToolbar: true,
    widgetInToolbar: true,
    showReminder: false,
    channelMember: false,
  });

  const loadComment = async () => {
    if (props.issueId == '') {
      return;
    }
    const res = await request(
      list_comment({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        issue_id: props.issueId,
        offset: curPage * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    );
    if (res) {
      setCommentList(res.comment_list);
      setTotalCount(res.total_count);
    }
  };

  const addComment = async () => {
    const data = editorRef.current?.getContent() ?? {
      type: 'doc',
    };
    if (is_empty_doc(data)) {
      message.warn("不能发送空的评论");
      return;
    }
    const res = await request(add_comment({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      issue_id: props.issueId,
      comment: {
        comment_data: JSON.stringify(data),
        ref_comment_id: "",
      },
    }));
    if (res) {
      if (curPage != 0) {
        setCurPage(0);
      } else {
        await loadComment();
      }
      editorRef.current?.clearContent();
      setShowAddModal(false);
    }
  }

  useEffect(() => {
    loadComment();
  }, [props.issueId, curPage]);

  return (
    <Card title={<h2>评论列表</h2>} bordered={false} extra={<Button onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      setShowAddModal(true);
    }}>新增评论</Button>}>
      <div style={{ borderTop: '1px solid  #f0f0f5', marginTop: '20px' }}>
        {commentList.map((item) => {
          return (
            <div key={item.comment_id}>
              <UserPhoto logoUri={item.sender_logo_uri} width="24px" height="24px" style={{ borderRadius: "20px",marginRight:"10px" }} />
              <span>{item.sender_display_name}</span>
              <span>&nbsp;&nbsp;{moment(item.send_time).format('YYYY-MM-DD HH:mm:ss')}</span>
              <div style={{ width: '90%', paddingBottom: "10px", paddingTop: "5px", paddingLeft: "32px" }}>
                <ReadOnlyEditor content={item.basic_comment.comment_data} />
              </div>
            </div>
          );
        })}
        {totalCount == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {totalCount > 0 && <Pagination
          total={totalCount}
          pageSize={PAGE_SIZE}
          current={curPage + 1}
          onChange={(page: number) => setCurPage(page - 1)}
        />}
      </div>
      {showAddModal && (
        <Modal
          title="新增评论"
          width="80%"
          open={showAddModal}
          mask={false}
          onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            setShowAddModal(false);
            editorRef.current?.clearContent();
          }}
          onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            addComment();
          }}
        >
          <div className='_editChatContext'>
            {editor}
          </div>
        </Modal>
      )}
    </Card>
  );
};
