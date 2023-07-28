import React, { useState } from 'react';
import { Table, Pagination, Empty, Modal } from 'antd';
import { useStores } from '@/hooks';
import moment from 'moment';
import type { WebUserScoreInfo } from '@/stores/appraise';
import { observer, useLocalObservable } from 'mobx-react';
import { request } from '@/utils/request';
import { list_score, MY_VOTE_STATE_DONE, remove as remove_appraise, update as update_appraise } from '@/api/project_appraise';
import styles from './AppraiseRecordList.module.less';
import SetAppraise from "./SetAppraise";
import { runInAction } from "mobx";
import UserPhoto from '@/components/Portrait/UserPhoto';
import Button from '@/components/Button';
import { EditText } from '@/components/EditCell/EditText';


type AppraiseRecordListProps = {
  adminMode: boolean;
};

const AppraiseRecordList: React.FC<AppraiseRecordListProps> = (props) => {
  const appraiseStore = useStores('appraiseStore');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    curAppraiseId: "",
    showVote: false,
    voteAppraiseId: "",
    hasVoted: false,
    dataSource: [] as WebUserScoreInfo[],
    setCurAppraiseId(id: string) {
      this.curAppraiseId = this.curAppraiseId === id ? '' : id;
    },
    setShowVote(id: string, hasVoted: boolean) {
      this.voteAppraiseId = id;
      this.hasVoted = hasVoted;
      this.showVote = true;
    },
  }));

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const getCurAppraise = () => {
    const recordList = props.adminMode ? appraiseStore.allrecordList : appraiseStore.myRecordList;
    return recordList.find(item => item.appraise_id == localStore.curAppraiseId);
  };

  const removeAppraise = async () => {
    if (localStore.curAppraiseId == "") {
      return;
    }
    await request(remove_appraise(userStore.sessionId, projectStore.curProjectId, localStore.curAppraiseId));
    appraiseStore.removeAppraise(localStore.curAppraiseId);
    localStore.setCurAppraiseId("");
  }

  const updateTitle = async (appraiseId: string, title: string) => {
    try {
      const res = await update_appraise({
        session_id: userStore.sessionId,
        appraise_id: appraiseId,
        basic_info: {
          project_id: projectStore.curProjectId,
          title: title,
        },
      });
      return res.code == 0;
    } catch (_) {
      return false;
    }
  }

  // 表
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
    title: '最高分',
    dataIndex: 'max_score',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.max_score - b.max_score;
    }
  }, {
    title: '最低分',
    dataIndex: 'min_score',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.min_score - b.min_score;
    }
  }, {
    title: '平均分',
    dataIndex: 'avg_score',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.avg_score - b.avg_score;
    }
  }, {
    title: '投票次数',
    dataIndex: 'vote_count',
    sorter(a: WebUserScoreInfo, b: WebUserScoreInfo) {
      return a.vote_count - b.vote_count;
    }
  }];

  const loadApprasiseScore = (appraiseId: string) => {
    runInAction(() => {
      localStore.setCurAppraiseId(appraiseId);
      localStore.dataSource = [];
    });

    (async () => {
      const res = await request(list_score({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        use_appraise_id: true,
        appraise_id: appraiseId,
      }));
      if (res) {
        runInAction(() => {
          localStore.dataSource = res.score_info_list.map(item => {
            if (item.min_score > item.max_score) {
              item.min_score = 0;
            }
            let avgScore = 0;
            if (item.vote_count > 0) {
              avgScore = Math.round(item.total_score / item.vote_count * 10) / 10;
            }
            return {
              ...item,
              avg_score: avgScore,
            }
          });
        });
      }
    })();
  };

  const appraiseRecordList = props.adminMode ? appraiseStore.allrecordList : appraiseStore.myRecordList;
  const pageCount = props.adminMode ? appraiseStore.allPageCount : appraiseStore.myPageCount;
  const curPage = props.adminMode ? appraiseStore.allCurPage : appraiseStore.myCurPage;
  if (appraiseRecordList.length == 0) {
    return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />);
  }

  return (
    <div className={styles.list}>
      <div className={styles.list_cont}>
        {appraiseRecordList.length && appraiseRecordList.map((item) => {
          const isCurrent = localStore.curAppraiseId === item.appraise_id;
          const hasVoted = item.my_vote_state == MY_VOTE_STATE_DONE;
          return <div className={styles.list_item} key={item.appraise_id}>
            <div className={styles.list_hd}>
              <div className={styles.list_title}>
                <EditText editable={projectStore.isAdmin} content={item.basic_info?.title || ' '} showEditIcon={true} onChange={async (value) => {
                  return await updateTitle(item.appraise_id, value);
                }} />
              </div>
              {item.has_my_vote_state && (
                <a
                  className={styles.list_tag + ' ' + (hasVoted ? styles.done : '')}
                  onClick={() => {
                    localStore.setShowVote(item.appraise_id, hasVoted);
                  }}
                >
                  {hasVoted ? '已投票' : '去投票'}
                </a>
              )}
              <div className={styles.list_info} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (isCurrent) {
                  runInAction(() => {
                    localStore.setCurAppraiseId("");
                    localStore.dataSource = [];
                  });
                } else {
                  loadApprasiseScore(item.appraise_id);
                }
              }}>
                <div className={styles.list_info_item}>
                  来自：{item.create_display_name}
                </div>
                <div className={styles.list_info_item}>
                  参评人数：{item.member_list.length}
                </div>
                {item.un_vote_member_count && (<div className={styles.list_info_item}>未投票人数：{item.un_vote_member_count}</div>)}
                <div className={styles.list_info_item}>
                  发起日期：{moment(item.create_time).format('YYYY-MM-DD')}
                </div>
                <a
                  className={styles.list_expand}
                  onClick={() => {
                    if (isCurrent) {
                      runInAction(() => {
                        localStore.setCurAppraiseId("");
                        localStore.dataSource = [];
                      });
                    } else {
                      loadApprasiseScore(item.appraise_id);
                    }
                  }}>
                  {isCurrent ? '收起' : '展开'}
                </a>
              </div>

            </div>

            {/* 数据 */}
            {isCurrent && !!localStore.dataSource.length && (
              <div>
                {projectStore.isAdmin && (
                  <div className={styles.action_bar}>
                    <div className={styles.remove_btn_wrap}>
                      <Button danger onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(true);
                      }}>删除互评</Button>
                    </div>
                  </div>
                )}
                <Table
                  dataSource={localStore.dataSource}
                  columns={columns}
                  pagination={false}
                  rowClassName={styles.row}
                  className={styles.table}
                  rowKey="user_id"
                />
              </div>
            )}
          </div>
        })
        }
      </div>
      {pageCount > 1 && <Pagination
        className={styles.pagination}
        showTotal={total => `共${total}页`}
        current={curPage + 1}
        onChange={(page: number) => {
          if (props.adminMode) {
            appraiseStore.loadAllRecord(page - 1);
          } else {
            appraiseStore.loadMyRecord(page - 1);
          }
        }}
        total={pageCount}
      />}
      {localStore.showVote && (<SetAppraise appraiseId={localStore.voteAppraiseId} hasVote={localStore.hasVoted}
        onCancel={() => { localStore.showVote = false }}
        onVote={(appraiseId: string) => {
          if (appraiseId == localStore.curAppraiseId) {
            loadApprasiseScore(appraiseId);
          }
          appraiseStore.updateAppraise(appraiseId);
          localStore.showVote = false;
        }} />)}

      {showRemoveModal == true && localStore.curAppraiseId != "" && (
        <Modal
          title={`删除评估 ${getCurAppraise()?.basic_info.title ?? ""}`}
          open
          onCancel={e => {
            e.stopPropagation();
            e.preventDefault();
            setShowRemoveModal(false);
          }}
          onOk={e => {
            e.stopPropagation();
            e.preventDefault();
            removeAppraise();
          }}>
          是否删除评估 {getCurAppraise()?.basic_info.title ?? ""}?<br />
          删除后当前评估将不可访问,并且相关投票会撤回。
        </Modal>
      )}
    </div>
  );
};

export default observer(AppraiseRecordList);
