import React, { useState } from 'react';
import CardWrap from '@/components/CardWrap';
import s from './index.module.less';
import { useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import ProjectInfoPanel from './components/ProjectInfoPanel';
import LocalApi from './components/LocalApi';


const Home: React.FC = () => {
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  let defaultTab = urlParams.get("tab");
  if (defaultTab == null || defaultTab == "") {
    defaultTab = "info";
  }

  const [tab, setTab] = useState(defaultTab);

  const getTabName = () => {
    if (tab == "info"){
      return "项目信息";
    }else if (tab == "api"){
      return "项目接口";
    }
    return "";
  };

  return (
    <CardWrap title={getTabName()} halfContent>
      <div className={s.home_wrap}>
        <Tabs
          activeKey={tab}
          type="card"
          tabPosition="left"
          onChange={key => {
            setTab(key);
          }} items={[
            {
              label: <div className={s.tab}>项目信息</div>,
              key: "info",
              children: (
                <>
                  {tab == "info" && <ProjectInfoPanel />}
                </>
              ),
            },
            {
              label: <div className={s.tab}>项目接口</div>,
              key: "api",
              children: (
                <>
                  {tab == "api" && <LocalApi />}
                </>
              ),
            }
          ]} />
      </div>
    </CardWrap>
  )
};
export default Home;
