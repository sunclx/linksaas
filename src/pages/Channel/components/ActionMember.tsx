import React, { useEffect } from 'react';
import styles from './ActionMember.module.less';
import ActionModal from '@/components/ActionModal';
import { Input, Checkbox, message } from 'antd';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';

import Button from '@/components/Button';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import type { WebMemberInfo } from '@/stores/member';
import {
  create as create_channel,
  update as update_channel,
  add_member as fetchAddChannelMember,
  remove_member as fetchDeleteChannelMember,
  list_channel_member
} from '@/api/project_channel';
import type { ChannelMemberInfo } from '@/api/project_channel';
import UserPhoto from '@/components/Portrait/UserPhoto';


export enum ActionMemberType {
  ADD = 0,
  DELETE = 1,
  CREATE_CHANNEL = 2,
  UPDATE_CHANNEL = 3,
}

type ActionMemberProps = {
  visible: boolean;
  type: ActionMemberType;
  title: string;
  channelId: string;
  onChange: (boo: boolean) => void;
  onComplete?: () => void;
};

// 添加/删除频道用户
const ActionMember: React.FC<ActionMemberProps> = (props) => {
  const { visible, channelId, onChange, onComplete, type, title } = props;

  const channelStore = useStores('channelStore');
  const memberStore = useStores('memberStore');
  const userStore = useStores('userStore');
  const { sessionId } = useStores('userStore');
  const { curProjectId } = useStores('projectStore');

  const localStore = useLocalObservable(() => ({
    memberList: [] as WebMemberInfo[],
    channelName: '',
    selectList: [] as WebMemberInfo[],
    checkedList: [] as boolean[],
    setMemberList(list: WebMemberInfo[]): void {
      this.memberList = list;
    }
  }));
  const getFilterList = async () => {
    localStore.setMemberList([]);
    let curIdList: string[] = [];
    if (channelId !== "") {
      const res = await request(list_channel_member(sessionId, curProjectId, channelId));
      if (res) {
        res.info_list.forEach((item: ChannelMemberInfo) => curIdList.push(item.member_user_id));
      }
      const chanItem = channelStore.getChannel(channelId);
      if (chanItem !== undefined) {
        localStore.channelName = chanItem.channelInfo.basic_info.channel_name;
      }
    }
    if (type == ActionMemberType.ADD) {
      curIdList.push(userStore.userInfo.userId);
      localStore.setMemberList(memberStore.memberList.filter((item => !curIdList.includes(item.member.member_user_id))));
    } else if (type == ActionMemberType.DELETE) {
      curIdList = curIdList.filter((item => item != userStore.userInfo.userId));
      localStore.setMemberList(memberStore.memberList.filter((item => curIdList.includes(item.member.member_user_id))));
    } else if (type == ActionMemberType.CREATE_CHANNEL) {
      localStore.setMemberList(memberStore.memberList.filter((item) =>
        item.member.member_user_id != userStore.userInfo.userId
      ));
    } else if (type == ActionMemberType.UPDATE_CHANNEL) {
      localStore.setMemberList(memberStore.memberList.filter((item) =>
        item.member.member_user_id != userStore.userInfo.userId
      ));
      localStore.checkedList = localStore.memberList.map(item => curIdList.includes(item.member.member_user_id));
      const tmpSelList = [] as WebMemberInfo[];
      localStore.memberList.forEach(item => {
        if (curIdList.includes(item.member.member_user_id)) {
          tmpSelList.push(item);
        }
      });
      localStore.selectList = tmpSelList;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    getFilterList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, type]);

  // 选择成员
  const selectOneMember = (index: number, value: boolean) => {
    const list = [...localStore.checkedList];
    list[index] = value;
    runInAction(() => {
      localStore.checkedList = list;
      localStore.selectList = localStore.memberList.filter((item, i) => list[i]);
    });
  };

  // 修改频道名称
  const changeChannelName = (value: string) => {
    runInAction(() => {
      localStore.channelName = value;
    });
  };

  // 添加成员
  const addMember = async (chId: string) => {
    await Promise.all(
      localStore.selectList.map(async (item) => {
        await request(fetchAddChannelMember(sessionId, curProjectId, chId, item.member.member_user_id));
      }),
    );
    if (onComplete) {
      onComplete();
    }
    if (onChange) {
      onChange(false);
    }
  };

  // 删除成员
  const deleteMember = async (channelid: string) => {
    await Promise.all(
      localStore.selectList.map(async (item) => {
        await request(fetchDeleteChannelMember(sessionId, curProjectId, channelid, item.member.member_user_id));
      }),
    );
    if (onComplete) {
      onComplete();
    }
    if (onChange) {
      onChange(false);
    }
  };

  const createChannel = async () => {
    if (localStore.channelName == "") {
      message.error("频道名称不能为空");
      return;
    }
    //创建频道
    const res = await request(create_channel({
      session_id: sessionId,
      project_id: curProjectId,
      basic_info: {
        channel_name: localStore.channelName,
        pub_channel: false,
      },
      member_user_id_list: localStore.selectList.map((item) => item.member.member_user_id),
    }));
    await channelStore.updateChannel(res.channel_id);

    if (res) {
      runInAction(() => {
        channelStore.curChannelId = res.channel_id;
      })
      if (onComplete) {
        onComplete();
      }
      if (onChange) {
        onChange(false);
      }
    }
  };

  const updateChannel = async () => {
    if (localStore.channelName == "") {
      message.error("频道名称不能为空");
      return;
    }
    //检查是否需要更新频道
    const preChan = channelStore.getChannel(channelId);
    if (preChan == undefined) {
      return;
    }
    if (preChan.channelInfo.system_channel) {
      return;
    }
    if (preChan.channelInfo.basic_info.channel_name != localStore.channelName) {
      const res = await request(update_channel(sessionId, curProjectId, channelId,
        { channel_name: localStore.channelName, pub_channel: preChan.channelInfo.basic_info.pub_channel }));
      if (res) {
        runInAction(() => {
          channelStore.updateChannel(channelId);
        });
      }
    }
    //获取当前的用户列表
    const curMemberIdList = localStore.selectList.map((item) => item.member.member_user_id);
    curMemberIdList.push(userStore.userInfo.userId);
    //获取之前的用户列表
    const memberRes = await request(list_channel_member(sessionId, curProjectId, channelId));
    if (!memberRes) {
      return;
    }
    const preMemberIdList = memberRes.info_list.map((item: ChannelMemberInfo) => item.member_user_id);
    //移除多余的用户
    await Promise.all(
      preMemberIdList.filter((preMemberId: string) => !curMemberIdList.includes(preMemberId))
        .map(async (memberId: string) => {
          await request(fetchDeleteChannelMember(sessionId, curProjectId, channelId, memberId));
        })
    );
    //增加新增用户
    await Promise.all(
      curMemberIdList.filter((curMemberId) => !preMemberIdList.includes(curMemberId))
        .map(async (memberId) => {
          await request(fetchAddChannelMember(sessionId, curProjectId, channelId, memberId));
        })
    );
    if (onComplete) {
      onComplete();
    }
    if (onChange) {
      onChange(false);
    }
  };

  // 确认事件
  const comfirm = () => {
    if (type == ActionMemberType.ADD) {
      addMember(channelStore.curChannelId);
    } else if (type == ActionMemberType.DELETE) {
      deleteMember(channelStore.curChannelId);
    } else if (type == ActionMemberType.CREATE_CHANNEL) {
      createChannel();
    } else if (type == ActionMemberType.UPDATE_CHANNEL) {
      updateChannel();
    }
  };

  return (
    <ActionModal visible={visible} title={title || ''} width={560} onCancel={() => onChange(false)}>
      <div className={styles.box}>
        <div className={styles.search_box}>
          <ul className={styles.select_list}>
            {localStore.memberList.map((item: WebMemberInfo, key: number) => (
              <li key={item.member.member_user_id} className={styles.item}>
                <Checkbox
                  className="checkbox"
                  checked={localStore.checkedList[key]}
                  onChange={(e) => selectOneMember(key, e.target.checked)}
                >
                  <div className={styles.checkbox_cont}>
                    <UserPhoto logoUri={item.member.logo_uri ?? ""} className={styles.cover} />
                    <div className={styles.name}>{item.member.display_name}</div>
                  </div>
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.select_box}>
          <div className={styles.select_count}>已选择{localStore.selectList.length}人</div>
          <ul className={styles.select_list}>
            {localStore.selectList.map((item) => (
              <li key={item.member.member_user_id} className={styles.item}>
                <UserPhoto logoUri={item.member.logo_uri ?? ""} className={styles.cover} />
                <div className={styles.name}>{item.member.display_name}</div>
                <a className={styles.delete}>
                  <i className={styles.icon_delete} />
                </a>
              </li>
            ))}
          </ul>

          {/* 自定义频道 */}
          {type == ActionMemberType.CREATE_CHANNEL && (
            <div className={styles.add_channel}>
              <div className={styles.title}>频道名称</div>

              <Input
                placeholder="请输入自定义频道名称"
                onChange={(e) => changeChannelName(e.target.value)}
              />
            </div>
          )}
          {type == ActionMemberType.UPDATE_CHANNEL && (
            <div className={styles.add_channel}>
              <div className={styles.title}>频道名称</div>

              <Input
                value={localStore.channelName}
                onChange={(e) => changeChannelName(e.target.value)}
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button key="cancel" ghost onClick={() => onChange(false)} className={styles.btn}>
              取消
            </Button>
            <Button onClick={() => comfirm()} className={styles.btn}>
              确定
            </Button>
          </div>
        </div>
      </div>
    </ActionModal>
  );
};

export default observer(ActionMember);
