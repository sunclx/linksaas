import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import ReactDiffViewer from 'react-diff-viewer';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import * as docApi from '@/api/project_doc';
import s from './DocHistory.module.less';
import moment from 'moment';

interface DocDiffProps {
  historyId: string;
  onCancel: () => void;
  onRecover: () => void;
}

const DocDiff: React.FC<DocDiffProps> = (props) => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const entryStore = useStores('entryStore');


  const [oldData, setOldData] = useState('');
  const [newData, setNewData] = useState('');
  const [oldUpdateTime, setOldUpdateTime] = useState<number | null>(null);

  const loadData = async () => {
    const docRes = await request(
      docApi.get_doc({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
      }),
    );
    if (docRes) {
      const obj = JSON.parse(docRes.doc.base_info.content);
      setNewData(JSON.stringify(obj, null, 2));
    }
    const historyRes = await request(
      docApi.get_doc_in_history({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
        history_id: props.historyId,
      }),
    );
    if (historyRes) {
      const obj = JSON.parse(historyRes.doc.base_info.content);
      setOldData(JSON.stringify(obj, null, 2));
      setOldUpdateTime(entryStore.curEntry?.update_time ?? 0);
    }
  };

  const recoverDoc = async () => {
    const res = await request(
      docApi.recover_doc_in_history({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        doc_id: entryStore.curEntry?.entry_id ?? "",
        history_id: props.historyId,
      }),
    );
    if (!res) {
      return;
    }
    docStore.loadDoc();
    props.onRecover();
  };

  useEffect(() => {
    loadData();
  }, [entryStore.curEntry, props.historyId]);

  return (
    <Modal
      open
      title="历史版本对比"
      onCancel={() => props.onCancel()}
      width="80%"
      footer={null}
      wrapClassName={s.docdiff_wrap}
    >
      <div className={s.top}>
        <div>当前版本</div>
        <div>
          历史版本
          <div className={s.title}>{oldUpdateTime != null && moment(oldUpdateTime).format("YYYY-MM-DD HH:mm:ss")}</div>
          {projectStore.isClosed == false && (entryStore.curEntry?.can_update ?? false) == true && (
            <div
              className={s.btn}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (projectStore.isClosed) {
                  return;
                }
                recoverDoc();
              }}
            >
              恢复
            </div>
          )}
        </div>
      </div>
      <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        <ReactDiffViewer
          oldValue={newData}
          newValue={oldData}
          splitView={true}
          showDiffOnly={true}
        />
      </div>
    </Modal>
  );
};

export default observer(DocDiff);
