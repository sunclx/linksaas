import React, { useEffect } from 'react';
import styles from './SetAppraise.module.less';
import ActionModal from '@/components/ActionModal';
import Button from '@/components/Button';
import { observer, useLocalObservable } from 'mobx-react';
import {
  get_my_vote,
  get_vote_draft,
  set_vote_draft,
  vote as save_vote,
} from '@/api/project_appraise';
import type { VoteItem } from '@/api/project_appraise';
import { Rate, message } from 'antd';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import { runInAction } from 'mobx';
import UserPhoto from '@/components/Portrait/UserPhoto';

type SetAppraiseProps = {
  appraiseId: string;
  hasVote: boolean;
  onCancel: () => void;
  onVote: (appraiseId: string) => void;
};

// 发起互评
const SetAppraise: React.FC<SetAppraiseProps> = (props) => {
  const { appraiseId, hasVote, onCancel, onVote } = props;
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    voteCount: 0,
    voteItemList: [] as VoteItem[],
  }));

  const loadVote = async () => {
    const res = await request(
      get_my_vote(userStore.sessionId, projectStore.curProjectId, appraiseId),
    );
    if (res) {
      runInAction(() => {
        localStore.voteItemList = res.vote_info.item_list;
        localStore.voteCount = res.vote_info.item_list.length;
      });
    }
  };

  const loadVoteDraft = async () => {
    const res = await request(
      get_vote_draft(userStore.sessionId, projectStore.curProjectId, appraiseId),
    );
    if (res) {
      runInAction(() => {
        localStore.voteItemList = res.vote_info.item_list;
        localStore.voteCount = res.vote_info.item_list.map((item) => item.score > 0).length;
      });
    }
  };

  useEffect(() => {
    if (hasVote) {
      loadVote();
    } else {
      loadVoteDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appraiseId, hasVote]);

  // 确认事件
  const comfirm = async () => {
    //检查是否所有item都打了分
    let allHasScore = true;
    localStore.voteItemList.forEach((item) => {
      if (item.score <= 0 || item.score > 5) {
        allHasScore = false;
      }
    });
    if (!allHasScore) {
      message.warn('需要给所有成员打分');
      return;
    }
    const res = await request(
      save_vote({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        appraise_id: appraiseId,
        vote_item_list: localStore.voteItemList.map((item) => {
          return {
            target_user_id: item.target_user_id,
            score: item.score,
          };
        }),
      }),
    );
    if (res) {
      message.success('投票成功');
      onVote(appraiseId);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    const res = await request(
      set_vote_draft({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        appraise_id: appraiseId,
        vote_item_list: localStore.voteItemList.map((item) => {
          return {
            target_user_id: item.target_user_id,
            score: item.score,
          };
        }),
      }),
    );
    if (res) {
      message.success('暂存投票成功');
    }
  };

  // 评价列表
  const renderResult = () => {
    const desc = ['有较大的待改进空间', '有待改进空间', '还不错', '非常棒', '无可挑剔'];

    return (
      <div>
        <div className={styles.top_info}>
          <div className={styles.title}>
            请综合考量贡献值、工作态度等维度，为您的小伙伴在本项目中的表现打分吧！
          </div>
          <div className={styles.desc}>*此调查完全匿名，且最终的不记名结果仅项目管理员可见</div>
        </div>

        <h2 className={styles.result_title}>
          评价列表（{localStore.voteCount}/{localStore.voteItemList?.length}）
        </h2>

        {(localStore.voteItemList?.length && (
          <ol className={styles.result_list}>
            {localStore.voteItemList.map((voteItem, voteKey) => {
              return (
                <li className={styles.result_item} key={`${voteKey + 1}`}>
                  <div className={styles.key}>{voteKey + 1}</div>
                  <div className={styles.result_user}>
                    <UserPhoto logoUri={voteItem.target_logo_uri ?? ''} className={styles.img} />
                    <div className={styles.name}>{voteItem.target_display_name}</div>
                  </div>
                  <div className={styles.result_rate}>
                    <Rate
                      tooltips={desc}
                      disabled={hasVote}
                      value={voteItem.score}
                      onChange={(value) => {
                        runInAction(() => {
                          voteItem.score = value;
                        });
                      }}
                    />
                    {voteItem.score ? (
                      <span className={styles.tips}>{desc[voteItem.score - 1]}</span>
                    ) : (
                      <span className={styles.tips + ' ' + styles.warn}>*待改进</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )) ||
          '没有评估'}

        {hasVote == false ? (
          <div className={styles.actions}>
            <Button key="cancel" ghost onClick={() => saveDraft()} className={styles.btn}>
              暂存
            </Button>
            <Button onClick={() => comfirm()} className={styles.btn}>
              匿名提交
            </Button>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button key="cancel" className={styles.btn} onClick={() => onCancel()}>
              关闭
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ActionModal
      visible={true}
      width={560}
      style={{ height: 506, paddingBottom: 60 }}
      onCancel={() => onCancel()}
    >
      {renderResult()}
    </ActionModal>
  );
};

export default observer(SetAppraise);
