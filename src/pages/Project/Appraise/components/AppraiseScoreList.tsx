import React from 'react';
import { Table } from 'antd';
import { observer } from 'mobx-react';

import { useStores } from '@/hooks';
import type { WebUserScoreInfo } from '@/stores/appraise';
import styles from './AppraiseScoreList.module.less';
import UserPhoto from '@/components/Portrait/UserPhoto';



const AppraiseScoreList: React.FC = () => {
  const appraiseStore = useStores('appraiseStore');

  const columns = [{
    title: '成员',
    dataIndex: 'display_name',
    key: 'user_id',
    render: (_: number, record: WebUserScoreInfo) => {
      return <div className={styles.user}>
        <UserPhoto logoUri={record.logo_uri} className={styles.avatar} />
        {record.display_name}
      </div>
    }
  }, {
    title: '总分',
    dataIndex: 'total_score',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.total_score - b.total_score;
    }
  }, {
    title: '参评次数',
    dataIndex: 'vote_count',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.vote_count - b.vote_count;
    },
  }, {
    title: '平均分',
    dataIndex: 'avg_score',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.avg_score - b.avg_score;
    }
  }
  ];

  return (
    <Table
      dataSource={appraiseStore.userScoreList}
      columns={columns}
      rowClassName={styles.row}
      className={styles.table}
      pagination={false}
    />
  );
};

export default observer(AppraiseScoreList);
