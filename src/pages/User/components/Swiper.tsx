import React from 'react';
import s from './swiper.module.less';
import logo from '@/assets/image/logo.png';

const Swiper = () => {
  return (
    <div className={s.swiper_wrap}>
      {/* <div> */}
      <div className={s.logo}>
        <img src={logo} />
        凌鲨
      </div>
      <div className={s.info}>
        软件研发团队<b>信息枢纽</b>
      </div>
    </div>
  );
};

export default Swiper;
