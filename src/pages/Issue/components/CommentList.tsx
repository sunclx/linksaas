import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import type { Comment } from '@/api/project_issue';
import { list_comment } from '@/api/project_issue';
import { useStores } from '@/hooks';
import { ReadOnlyEditor } from '@/components/Editor';
import Pagination from '@/components/Pagination';
import { useSetState } from 'ahooks';
import type { PageOptType } from '../../Project/Task';
import UserPhoto from '@/components/Portrait/UserPhoto';
import moment from 'moment';
import { Card } from 'antd';
import Button from '@/components/Button';

export type CommentListProp = {
  issueId: string;
};

export const CommentList: React.FC<CommentListProp> = (props) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const [commentList, setCommentList] = useState([] as Comment[]);
  const [pageOpt, setPageOpt] = useSetState<Partial<PageOptType>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
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
        offset: (pageOpt.pageNum! - 1) * pageOpt.pageSize!,
        limit: pageOpt.pageSize!,
      }),
    );
    if (res) {
      setCommentList(res.comment_list);
      setPageOpt({
        total: res.total_count,
      });
    }
  };

  useEffect(() => {
    loadComment();
  }, [props.issueId, pageOpt.pageNum]);

  return (
    <Card title={<h2>评论列表</h2>} bordered={false} extra={<Button>新增评论</Button>}>
      <div style={{ borderTop: '1px solid  #f0f0f5', marginTop: '20px' }}>
        {commentList.map((item) => {
          return (
            <div key={item.comment_id}>
              <UserPhoto logoUri={item.sender_logo_uri} width="32px" height="32px" style={{ borderRadius: "20px" }} />
              <span>{item.sender_display_name}</span>
              <span>&nbsp;&nbsp;{moment(item.send_time).format('YYYY-MM-DD HH:mm:ss')}</span>
              <div style={{ width: '90%', paddingBottom: "10px", paddingTop: "5px",paddingLeft:"32px" }}>
                <ReadOnlyEditor content={item.basic_comment.comment_data} />
              </div>
            </div>
          );
        })}
        <Pagination
          total={pageOpt.total!}
          pageSize={pageOpt.pageSize!}
          current={pageOpt.pageNum}
          onChange={(page: number) => setPageOpt({ pageNum: page })}
        />
      </div>
    </Card>
  );
};
