import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import s from './index.module.less';

const Nav = (props: { title: string; path: string }) => {
  const history = useHistory();
  const { title, path } = props;
  return (
    <div className={s.nav_wrap}>
      <div className={s.cutBtn} onClick={() => history.push(path)}>
        <LeftOutlined />
        {title}
      </div>
    </div>
  );
};

export default Nav;
