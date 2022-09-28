import type { FC } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import s from './EditorWrap.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import classNames from 'classnames';
import { useSize } from 'ahooks';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

type EditorWrapProps = {
  onChange?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  collapse?: boolean;
};

const EditorWrap: FC<EditorWrapProps> = (props) => {
  const { children, onChange, className, collapse } = props;

  const [height, setHeight] = useState('auto');
  const [fold, setFold] = useState(true);
  const [showFold, setShowFold] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const domRefSize = useSize(domRef);

  useEffect(() => {
    if (collapse && fold && domRefSize && domRefSize.height >= 200) {
      setHeight('200px');
      setShowFold(true);
    }
  }, [domRefSize, collapse, fold]);

  return (
    <div>
      <div
        ref={domRef}
        className={classNames(s.editor_wrap, className)}
        style={{ ...props.style, height: height }}
      >
        {onChange && (
          <div
            className={s.delete}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(e);
            }}
          >
            <Deletesvg />
          </div>
        )}
        {children}
      </div>
      {collapse &&
        showFold &&
        (fold ? (
          <div
            className={s.fold}
            onClick={(e) => {
              e.preventDefault();
              setFold(false);
              setHeight('auto');
            }}
          >
            展开
            <DownOutlined />
          </div>
        ) : (
          <div
            className={s.fold}
            onClick={(e) => {
              e.preventDefault();
              setFold(true);
              setHeight('200px');
            }}
          >
            收起 <UpOutlined />
          </div>
        ))}
    </div>
  );
};

export default EditorWrap;
