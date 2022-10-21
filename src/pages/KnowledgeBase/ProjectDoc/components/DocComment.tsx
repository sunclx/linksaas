import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import UserPhoto from '@/components/Portrait/UserPhoto';
import { Modal } from 'antd';
import { useSimpleEditor, ReadOnlyEditor } from '@/components/Editor';
import * as prjDocApi from '@/api/project_doc';
import { request } from '@/utils/request';
import s from './DocComment.module.less';
import { PlusOutlined } from '@ant-design/icons';
import Pagination from '@/components/Pagination';
import moment from 'moment';

const PAGE_SIZE = 10;

const DocComment: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docSpaceStore = useStores('docSpaceStore');
  const [showModal, setShowModal] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [commentList, setCommentList] = useState<prjDocApi.Comment[]>([]);
  const [curPage, setCurPage] = useState(0);

  const { editor, editorRef } = useSimpleEditor("请写下你的评论");

  const loadComment = async () => {
    const res = await request(prjDocApi.list_comment({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? docSpaceStore.curDocSpaceId,
      doc_id: docSpaceStore.curDocId,
      offset: curPage * PAGE_SIZE,
      limit: PAGE_SIZE,
    }));
    if(res){
      setCommentCount(res.total_count);
      setCommentList(res.comment_list);
    }
  };

  const addComment = async () => {
    const content = editorRef.current?.getContent() ?? {};
    const res = await request(
      prjDocApi.add_comment({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_space_id: docSpaceStore.curDocSpaceId,
        doc_id: docSpaceStore.curDocId,
        comment: {
          comment_data: JSON.stringify(content),
          ref_comment_id: '',
        },
      }),
    );
    if (!res) {
      return;
    }

    setShowModal(false);
    setCurPage(0);
    loadComment();
  };

  useEffect(() => {
    if (!docSpaceStore.showDocComment) {
      setCommentCount(0);
      setCommentList([]);
      setCurPage(0);
      return;
    }
    loadComment();
  }, [docSpaceStore.showDocComment, docSpaceStore.curDocSpaceId, docSpaceStore.curDocId, curPage]);

  return (
    <div className={s.DocComment_wrap}>
      <div className={s.title_wrap}>
        <span>文档评论</span>
        <div
          className={s.btn}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
            setTimeout(() => {
              editorRef?.current?.clearContent();
            }, 100);
          }}
        >
          <PlusOutlined />
          添加评论
        </div>
      </div>

      <ul className={s.item_wrap}>
        {commentList.map((item) => (
          <li key={item.comment_id}>
            <div className={s.top_wrap}>
              <div className={s.top}>
                <UserPhoto logoUri={item.sender_logo_uri} width="20px" height="20px" />

                <span className={s.name}>{item.sender_display_name} </span>
                <span className={s.time}>
                  {moment(item.send_time).format('YYYY-MM-DD hh:mm:ss')}{' '}
                </span>
              </div>
              <div className={s.des}>
                {/* 更新了此文档 */}
                <ReadOnlyEditor content={item.basic_comment?.comment_data} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {commentCount > 0 && (
        <Pagination
          total={commentCount}
          pageSize={PAGE_SIZE}
          current={curPage + 1}
          onChange={(page: number) => setCurPage(page - 1)}
        />
      )}
      {showModal && (
        <Modal
          title="添加文档评论"
          open={showModal}
          okText="发布"
          onCancel={() => setShowModal(false)}
          onOk={() => addComment()}
          bodyStyle={{ paddingTop: '0' }}
        >
          {editor}
        </Modal>
      )}
    </div>
  );
};
export default observer(DocComment);
