import type { FC } from 'react';
import React from 'react';
import s from './EditorWrap.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import classNames from 'classnames';

type EditorWrapProps = {
  onChange?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const EditorWrap: FC<EditorWrapProps> = (props) => {
  const { children, onChange, className } = props;

  return (
    <div>
      <div
        className={classNames(s.editor_wrap, className)}
        style={{ ...props.style}}
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
    </div>
  );
};

export default EditorWrap;
