import type { ISSUE_TAB_LIST_TYPE } from './constant';
import type { FC } from 'react';
import React from 'react';
import s from './Tabs.module.less';
import filterIcon from '@/assets/image/filterIcon.png';
import noFilterIcon from '@/assets/image/noFilterIcon.png';

type TabsProps = {
  list: { name: string; value: ISSUE_TAB_LIST_TYPE }[];
  activeVal: ISSUE_TAB_LIST_TYPE;
  onChang: (val: ISSUE_TAB_LIST_TYPE) => void;
  isFilter: boolean;
  setIsFilter: (val: boolean) => void;
};

const Tabs: FC<TabsProps> = (props) => {
  const { list, activeVal, onChang, isFilter, setIsFilter } = props;

  return (
    <div className={s.tabs_wrap}>
      {list.map((item) => (
        <div
          key={item.value}
          className={item.value == activeVal ? s.active : ''}
          onClick={() => onChang(item.value)}
        >
          {item.name}
        </div>
      ))}
      <div style={{ opacity: 0.2 }}>|</div>
      <div onClick={() => setIsFilter(!isFilter)} className={isFilter ? s.filter : ''}>
        <img
          src={isFilter ? filterIcon : noFilterIcon}
          alt=""
          style={{ verticalAlign: 'middle' }}
        />
        筛选
      </div>
    </div>
  );
};

export default Tabs;
