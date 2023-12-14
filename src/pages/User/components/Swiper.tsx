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
        <div style={{ marginLeft: "50px" }}>为软件研发人员</div>
        <div style={{ marginLeft: "220px", padding: "10px 0px" }}><b>连接</b></div>
        <div style={{ marginLeft: "230px" }}>先进工具和知识</div>
      </div>
    </div>
  );
};

export default Swiper;
