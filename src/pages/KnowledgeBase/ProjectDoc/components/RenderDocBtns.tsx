import React from 'react';
import { ReactComponent as Historysvg } from '@/assets/svg/history.svg';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { Popover, Space } from 'antd';
import DocHistory from './DocHistory';
import Button from '@/components/Button';
import { LinkIdeaPageInfo } from '@/stores/linkAux';
import { useHistory } from 'react-router-dom';
import { BulbFilled } from '@ant-design/icons';
import CommentEntry from '@/components/CommentEntry';
import { COMMENT_TARGET_ENTRY } from '@/api/project_comment';

export interface RenderDocBtnsProps {
  keyWordList?: string[];
}

const RenderDocBtns = (props: RenderDocBtnsProps) => {
  const history = useHistory();

  const appStore = useStores('appStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const linkAuxStore = useStores('linkAuxStore');
  const entryStore = useStores('entryStore');

  return (
    <Space>
      <CommentEntry projectId={projectStore.curProjectId} targetType={COMMENT_TARGET_ENTRY}
        targetId={entryStore.curEntry?.entry_id ?? ""} myUserId={userStore.userInfo.userId} myAdmin={projectStore.isAdmin} />
      {(props.keyWordList ?? []).length > 0 && (
        <Popover placement='bottom'
          title="相关知识点"
          overlayStyle={{ width: 150 }}
          content={
            <div style={{ maxHeight: "calc(100vh - 300px)", padding: "10px 10px" }}>
              {(props.keyWordList ?? []).map(keyword => (
                <Button key={keyword} type="link" style={{ minWidth: 0 }} onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  linkAuxStore.goToLink(new LinkIdeaPageInfo("", projectStore.curProjectId, "", [keyword]), history);
                }}>{keyword}</Button>
              ))}
            </div>
          }>
          <Button type="text" style={{ padding: "0px 0px", minWidth: 0 }}>
            <BulbFilled style={{ color: "orange", fontSize: "28px" }} />
          </Button>
        </Popover>
      )}

      <Popover
        placement="bottom"
        content={() => <DocHistory />}
        onOpenChange={(v) => {
          docStore.showDocHistory = v;
        }}
        trigger="click"
      >
        <Button type="text" style={{ padding: "0px 0px", minWidth: 0 }}>
          <Historysvg style={{ fontSize: "24px" }} />
        </Button>
      </Popover>

      <Button
        type="primary"
        style={{ marginLeft: "40px", padding: "0px 0px" }}
        disabled={projectStore.isClosed || !(entryStore.curEntry?.can_update ?? false)}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          appStore.inEdit = true;
        }}
      >
        编辑
      </Button>
    </Space>
  );
};

export default observer(RenderDocBtns);
