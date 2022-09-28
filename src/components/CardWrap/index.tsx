import type { FC } from 'react';
import React from 'react';
import s from './index.module.less';
import { ReactComponent as Packupsvg } from '@/assets/svg/packup.svg';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_PATH } from '@/utils/constant';

type CardWrapProps = {
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  halfContent?: boolean;
  children?: React.ReactNode;
};

const CardWrap: FC<CardWrapProps> = (props) => {
  const { title, className, style, halfContent } = props;
  let cardWrap = s.cardWrap;
  if (className) cardWrap += ' ' + className;
  const history = useHistory();

  const isHalfStyle = halfContent
    ? {
        width: '570px',
        marginLeft: `calc(100% - ${570 + 59}px)`,
      }
    : '';

  return (
    <div className={cardWrap} style={{ ...isHalfStyle, ...style }}>
      <div className={s.packup} onClick={() => history.push(APP_PROJECT_PATH)}>
        <Packupsvg />
      </div>
      {title && (
        <div className={s.title}>
          <h2>{title}</h2>
        </div>
      )}
      <div className={`${s.child} ${title && s.isTitle}`}>{props.children}</div>
    </div>
  );
};

export default CardWrap;
