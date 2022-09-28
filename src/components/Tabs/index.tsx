import type { TAB_LIST_ENUM } from '@/utils/constant';
import type { FC } from 'react';
import React from 'react';
import s from './index.module.less';
import filterIcon from '@/assets/image/filterIcon.png';
import noFilterIcon from '@/assets/image/noFilterIcon.png';

type TabsProps = {
  list: { name: string; value: string }[];
  activeVal: string;
  onChang: (val: TAB_LIST_ENUM) => void;
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
          onClick={() => onChang(item.value as TAB_LIST_ENUM)}
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
