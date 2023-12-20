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
        <div style={{ marginLeft: "80px" }}><b>为</b>软件研发人员</div>
        <div style={{ marginLeft: "120px",marginTop:"10px" }}><b>连接</b>先进工具和知识</div>
      </div>
    </div>
  );
};

export default Swiper;
