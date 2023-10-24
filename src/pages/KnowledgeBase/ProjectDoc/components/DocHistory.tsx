import { useStores } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import UserPhoto from '@/components/Portrait/UserPhoto';
import DocDiff from './DocDiff';
import s from './DocHistory.module.less';
import moment from 'moment';
import * as prjDocApi from '@/api/project_doc';
import { request } from '@/utils/request';

const DocHistory: React.FC = () => {
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const docStore = useStores('docStore');
  const entryStore = useStores('entryStore');

  const [historyId, setHistoryId] = useState('');
  const [historyList, setHistoryList] = useState<prjDocApi.DocHistory[]>([]);

  const loadHistory = async () => {
    const res = await request(prjDocApi.list_doc_history({
      session_id: userStore.sessionId,
      project_id: projectStore.curProjectId,
      doc_id: entryStore.curEntry?.entry_id ?? "",
    }));
    if (res) {
      setHistoryList(res.history_list);
    }
  };

  const onRecover = async () => {
    loadHistory();
  };

  useEffect(() => {
    if (!docStore.showDocHistory) {
      setHistoryList([]);
      return;
    }
    loadHistory();
  }, [docStore.showDocHistory, entryStore.curEntry]);

  return (
    <div className={s.history_wrap}>
      <div className={s.title}>历史版本</div>
      <ul>
        {historyList.map((item, index) => (
          <li key={item.history_id}>
            <div className={s.top}>
              <UserPhoto logoUri={item.update_logo_uri} width="20px" height="20px" />
              {item.update_display_name}
            </div>
            <div className={s.time}>{moment(item.time_stamp).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className={s.des}>更新了此文档</div>
            {index > 0 && (
              <div
                className={s.btn}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setHistoryId(item.history_id);
                }}
              >
                查看
              </div>
            )}
            {index == 0 && <div className={s.mostNew}>当前版本</div>}
          </li>
        ))}
      </ul>
      {historyId != '' && (
        <DocDiff
          historyId={historyId}
          onCancel={() => setHistoryId('')}
          onRecover={() => onRecover()}
        />
      )}
    </div>
  );
};

export default observer(DocHistory);
