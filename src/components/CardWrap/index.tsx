import type { FC } from 'react';
import React from 'react';
import s from './index.module.less';
import { ReactComponent as Packupsvg } from '@/assets/svg/packup.svg';
import { useHistory, useLocation } from 'react-router-dom';
import { APP_PROJECT_HOME_PATH, APP_PROJECT_KB_BOARD_PATH, APP_PROJECT_KB_DOC_PATH, APP_PROJECT_MY_WORK_PATH, APP_PROJECT_OVERVIEW_PATH, APP_PROJECT_WORK_PLAN_PATH } from '@/utils/constant';

type CardWrapProps = {
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  halfContent?: boolean;
  children?: React.ReactNode;
  extra?: React.ReactNode;
};

const CardWrap: FC<CardWrapProps> = (props) => {
  const { title, className, style, halfContent } = props;
  let cardWrap = s.cardWrap;
  if (className) cardWrap += ' ' + className;
  const history = useHistory();
  const { pathname } = useLocation();

  const isHalfStyle = halfContent
    ? {
      width: '570px',
      marginLeft: `calc(100% - ${570 + 59}px)`,
    }
    : '';

  let backUrl = "";
  if (pathname.startsWith(APP_PROJECT_HOME_PATH)){
    backUrl = APP_PROJECT_HOME_PATH;
  }else if (pathname.startsWith(APP_PROJECT_WORK_PLAN_PATH)) {
    backUrl = APP_PROJECT_WORK_PLAN_PATH;
  } else if (pathname.startsWith(APP_PROJECT_KB_DOC_PATH)) {
    backUrl = APP_PROJECT_KB_DOC_PATH;
  }else if(pathname.startsWith(APP_PROJECT_KB_BOARD_PATH)){
    backUrl = APP_PROJECT_KB_BOARD_PATH;
  } else if (pathname.startsWith(APP_PROJECT_MY_WORK_PATH)) {
    backUrl = APP_PROJECT_MY_WORK_PATH;
  } else if (pathname.startsWith(APP_PROJECT_OVERVIEW_PATH)) {
    backUrl = APP_PROJECT_OVERVIEW_PATH;
  }

  return (
    <div className={cardWrap} style={{ ...isHalfStyle, ...style }}>
      <div className={s.packup} onClick={() => history.push(backUrl)}>
        <Packupsvg />
      </div>
      {title && (
        <div className={s.title}>
          <h2>{title}</h2>
          {props.extra !== undefined && (
            <>{props.extra}</>
          )}
        </div>
      )}
      <div className={`${s.child} ${title && s.isTitle}`}>{props.children}</div>
    </div>
  );
};

export default CardWrap;
