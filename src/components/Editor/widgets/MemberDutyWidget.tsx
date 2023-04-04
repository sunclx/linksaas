import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import { Input, Popover } from 'antd';
import { useStores } from '@/hooks';
import s from './MemberDutyWidget.module.less';
import UserPhoto from '@/components/Portrait/UserPhoto';
import EditorWrap from '../components/EditorWrap';
import MemberInfo from '@/pages/ChannelAndAi/components/MemberInfo';
import { ErrorBoundary } from '@/components/ErrorBoundary';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface MemberDuty {
  memberUserId: string;
  displayName: string; //默认用memberUserId读取，当成员被删除后读取这个显示名称
  logoUrl: string; //默认用memberUserId读取，当成员被删除后读取这个显示头像
  duty: string; //职责
}

interface WidgetData {
  title?: string; //显示标题
  goal?: string; //目标，可选字段
  dutyList: MemberDuty[]; //多个成员职责列表
}

export const memberDutyWidgetInitData: WidgetData = {
  dutyList: [],
};

const EditMemberDuty: React.FC<WidgetProps> = (props) => {
  const memberStore = useStores('memberStore');
  const widgetData = props.initData as WidgetData;
  const [title, setTitle] = useState(widgetData.title ?? '');
  const [goal, setGoal] = useState(widgetData.goal ?? '');
  const [memberList, setMemberList] = useState([] as MemberDuty[]);

  const saveData = (titleData: string, goalData: string, dutyList: MemberDuty[]) => {
    const tmpList = [] as MemberDuty[];
    dutyList.forEach((item) => {
      if (item.duty != '') {
        tmpList.push(item);
      }
    });
    const data: WidgetData = {
      title: titleData === '' ? undefined : titleData,
      goal: goalData === '' ? undefined : goalData,
      dutyList: tmpList,
    };
    props.writeData(data);
  };

  const updateMember = (memberUserId: string, duty: string) => {
    const tmpList = memberList.slice();
    const index = tmpList.findIndex((item) => item.memberUserId == memberUserId);
    if (index != -1) {
      tmpList[index].duty = duty;
      setMemberList(tmpList);
      saveData(title, goal, tmpList);
    }
  };

  useEffect(() => {
    if (memberList.length > 0) {
      return;
    }
    const tmpList: MemberDuty[] = memberStore.memberList.map((item) => {
      return {
        memberUserId: item.member.member_user_id,
        displayName: item.member.display_name,
        logoUrl: item.member.logo_uri,
        duty: '',
      };
    });
    widgetData.dutyList.forEach((item) => {
      const index = tmpList.findIndex((item2) => item.memberUserId == item2.memberUserId);
      if (index == -1) {
        tmpList.push(item);
      } else {
        tmpList[index].duty = item.duty;
      }
    });
    setMemberList(tmpList);
  });

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <div className={s.item_wrap}>
          <label className={s.title_label}>标题</label>
          <Input
            placeholder="标题为20个字以内"
            defaultValue={title}
            maxLength={20}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setTitle(e.target.value);
              saveData(e.target.value, goal, memberList);
            }}
          />
        </div>
        <div className={s.item_wrap}>
          <label className={s.title_label}>研发目标</label>
          <Input
            placeholder="目标为20个字以内"
            defaultValue={goal}
            maxLength={20}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setGoal(e.target.value);
              saveData(title, e.target.value, memberList);
            }}
          />
        </div>
        <div className={s.content_wrap}>
          <div className={s.content_title}>
            <label className={s.title_member}>成员</label>
            <label>职责安排</label>
          </div>
          <div className={s.list_wrap}>
            {memberList.map((item) => (
              <div className={s.list_item} key={item.memberUserId}>
                <div className={s.item_member_info}>
                  <UserPhoto logoUri={item.logoUrl} />
                  <label>{item.displayName}</label>
                </div>
                <Input
                  placeholder="请输入成员职责(20个字以内)"
                  maxLength={20}
                  defaultValue={item.duty}
                  onChange={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateMember(item.memberUserId, e.target.value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewMemberDuty: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  return (
    <ErrorBoundary>
      <EditorWrap>
        <div className={s.item_wrap}>
          <label className={s.title_label}>{data.title ?? ''}</label>
        </div>
        {data.goal && (
          <div className={s.item_wrap}>
            <label className={s.title_label}>目标</label>
            <span>{data.goal ?? ''}</span>
          </div>
        )}
        <div className={s.content_wrap}>
          <div className={s.content_title}>
            <label className={s.title_member}>成员</label>
            <label>职责安排</label>
          </div>
          <div className={s.list_wrap}>
            {data.dutyList.map((item) => (
              <div className={s.list_item} key={item.memberUserId}>
                <Popover
                  placement="right"
                  content={
                    <MemberInfo
                      memberId={item.memberUserId}
                      showLink={true}
                      hideMemberInfo={() => {}}
                    />
                  }
                >
                  <div className={s.item_member_info}>
                    <UserPhoto logoUri={item.logoUrl} />
                    <label>{item.displayName}</label>
                  </div>
                </Popover>
                <span>{item.duty}</span>
              </div>
            ))}
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const MemberDutyWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditMemberDuty {...props} />;
  } else {
    return <ViewMemberDuty {...props} />;
  }
};
