import React, {useState } from 'react';
import CardWrap from '@/components/CardWrap';
import { Tabs } from 'antd';
import s from './index.module.less';
import MemberList from './components/MemberList';
import { useLocation } from 'react-router-dom';
import GoalList from './components/GoalList';

const ProjectMember: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  let defaultTab = urlParams.get("tab");
  if (defaultTab == null || defaultTab == "") {
    defaultTab = "member";
  }

  const [tab, setTab] = useState(defaultTab);

  return (
    <CardWrap title="项目成员" halfContent>
      <div className={s.member_wrap}>
        <Tabs
          activeKey={tab}
          type="card"
          tabPosition="left"
          onChange={key => {
            setTab(key);
          }} items={[
            {
              label: <div className={s.tab}>成员列表</div>,
              key: "member",
              children: <MemberList />
            },
            {
              label: <div className={s.tab}>成员目标</div>,
              key: "goal",
              children: <GoalList />
            },
          ]} />

      </div>
    </CardWrap>
  );
};

export default ProjectMember;
