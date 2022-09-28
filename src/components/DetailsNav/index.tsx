import type { FC } from 'react';
import React from 'react';
import s from './index.module.less';
import leftArrow from '@/assets/image/leftArrow.png';
import { useHistory } from 'react-router-dom';

type DetailsNavProps = {
  title: string;
  children?: React.ReactNode;
};

const DetailsNav: FC<DetailsNavProps> = (props) => {
  const history = useHistory();
  return (
    <div className={s.details_nav_wrap}>
      <div className={s.title} onClick={() => history.goBack()}>
        <img src={leftArrow} alt="" /> {props.title}
      </div>
      <div className={s.child}>{props?.children}</div>
    </div>
  );
};

export default DetailsNav;
