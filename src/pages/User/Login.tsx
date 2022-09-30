import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { useStores } from '@/hooks';
import cls from './index.module.less';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { when } from 'mobx';
import logoPng from '@/assets/allIcon/logo.png';
import Header from '@/components/Header';
import Swiper from './components/Swiper';
import Reset from './components/Reset';

const Login: React.FC = () => {
  const appStore = useStores('appStore');
  const userStore = useStores('userStore');
  const history = useHistory();
  const [loginTab, setLoginTab] = useState(true);

  when(
    () => !!userStore.sessionId,
    () => {
      history.push('/app/workbench');
    },
  );

  const localUserStr = localStorage.getItem("userInfo");
  let localUser = {
    username: "",
    password: "",
    voluntarily: false,
  };
  if (localUserStr != null) {
    localUser = JSON.parse(localUserStr);
  }
  console.log(localUser);
  return (
    <div className={cls.loginBox}>
      <Row>
        <Col span={12}>
          <Swiper />
        </Col>
        <Col span={12}>
          <Header
            type="login"
            style={{
              boxShadow: 'none',
              position: 'fixed',
              left: 0,
              right: 0,
              top: '-1px',
              backgroundColor: 'transparent',
            }}
          />
          {loginTab ? (
            <>
              <div className={cls.logo}>
                <img src={logoPng} alt="" />
              </div>
              <div className={cls.form}>
                <Form
                  onFinish={({
                    username,
                    password,
                    voluntarily,
                  }: {
                    username: string;
                    password: string;
                    voluntarily: boolean;
                  }) => {
                    localStorage.setItem(
                      'userInfo',
                      JSON.stringify({
                        voluntarily,
                        username,
                        password,
                      }),
                    );
                    appStore.loadClientCfg();
                    userStore.callLogin(username, password);
                  }}
                  autoComplete="off"
                  initialValues={localUser}
                >
                  <Form.Item name="username">
                    <Input
                      placeholder="用户名"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </Form.Item>
                  <Form.Item name="password" initialValue={localUser.password}>
                    <Input placeholder="密码" type="password" autoComplete="off" />
                  </Form.Item>
                  <Form.Item>
                    <Form.Item name="voluntarily" valuePropName="checked" noStyle initialValue={localUser.voluntarily}>
                      <Checkbox>
                        <span className={cls.voluntarily}>记录账号密码</span>
                      </Checkbox>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className={cls.button}>
                      登录
                    </Button>
                    <div className={cls.login_form_forgot}>
                      <a onClick={() => setLoginTab(false)}>
                        忘记密码
                      </a>
                      &nbsp;|&nbsp;
                      <a href="https://www.linksaas.pro/register" target="_blank" rel="noreferrer">
                        注册新账号
                      </a>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </>
          ) : (
            <Reset setLoginTab={setLoginTab} />
          )}
        </Col>
      </Row>
    </div>
  );
};
export default observer(Login);
