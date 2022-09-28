import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import { Button, Col, Form, Input, Row } from 'antd';

import s from './reset.module.less';
import { CheckCircleFilled, LeftOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { useHistory } from 'react-router-dom';
import { RESET_TEXT, WORKBENCH_PATH } from '@/utils/constant';
import { request } from '@/utils/request';
import { gen_captcha, pre_reset_password } from '@/api/user';
import { useStores } from '@/hooks';

type ResetProps = {
  setLoginTab: (boo: boolean) => void;
};

export type ResetPasswordType = {
  user_name: string;
  captcha_value: string;
  captcha_id: string;
  auth_code: string;
};

const Reset: FC<ResetProps> = ({ setLoginTab }) => {
  const [hasFeedback, setHasFeedback] = useSetState({
    user_name: false,
    imgcode: false,
    code: false,
  });

  const [step, setStep] = useState(0);
  const { push } = useHistory();
  const userStore = useStores('userStore');
  const [imageCode, setImageCode] = useState('');
  const [formValue, setFormValue] = useSetState<ResetPasswordType>({
    user_name: '',
    captcha_value: '',
    captcha_id: '',
    auth_code: '',
  });

  const getImageCode = async () => {
    const res = await request(gen_captcha());
    console.log(res);
    if (res) {
      setImageCode(res.base64_image);
      setFormValue({ captcha_id: res.captcha_id });
    }
  };

  useEffect(() => {
    getImageCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.reset_wrap}>
      <h1 className={s.title}>重置密码</h1>
      <Form
        className={s.resetform}
        onFinish={async (values) => {
          // 第一步 step 为 0
          if (!step) {
            const { user_name, imgcode } = values;
            try {
              await request(pre_reset_password(user_name, formValue.captcha_id, imgcode));
              setFormValue((val) => {
                return {
                  ...val,
                  captcha_value: imgcode,
                  user_name: user_name,
                };
              });
              setStep((num) => num + 1);
            } catch (error) {}
            return;
          } else {
            setFormValue((val) => {
              return {
                ...val,
                auth_code: values.code,
              };
            });
            userStore.setIsResetPassword(true);
            push({
              pathname: WORKBENCH_PATH,
              search: `type=${RESET_TEXT}`,
              state: { ...formValue, auth_code: values.code },
            });
          }
        }}
      >
        {step === 0 ? (
          <>
            <Form.Item
              name="user_name"
              rules={[
                { required: true, message: '' },
                {
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }
                    // const phone = /^1[3456789]\d{9}$/;
                    // const email = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
                    // if ( !phone.test(value) && !email.test(value)) {
                    //   setHasFeedback({ user_name: false });
                    //   return Promise.reject();
                    // }
                    setHasFeedback({ user_name: true });
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="请输入您注册的邮箱/手机号"
                suffix={
                  hasFeedback.user_name ? (
                    <CheckCircleFilled style={{ color: '#52c41a' }} />
                  ) : (
                    <span />
                  )
                }
              />
            </Form.Item>
            <Row>
              <Col span={16}>
                <Form.Item
                  name="imgcode"
                  rules={[
                    { required: true, message: '' },
                    {
                      validator: (rule, value) => {
                        if (!/^([A-Za-z0-9]{4})+$/.test(value)) {
                          setHasFeedback({ imgcode: false });
                          return Promise.reject();
                        }
                        setHasFeedback({ imgcode: true });
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入验证码"
                    suffix={
                      hasFeedback.imgcode ? (
                        <CheckCircleFilled style={{ color: '#52c41a' }} />
                      ) : (
                        <span />
                      )
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={s.verification} onClick={getImageCode}>
                  <img src={imageCode} alt="" />
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Form.Item
            name="code"
            rules={[
              { required: true, message: '' },
              {
                validator: (rule, value) => {
                  if (!/^(\d{6})*$/.test(value)) {
                    setHasFeedback({ code: false });
                    return Promise.reject();
                  }
                  setHasFeedback({ code: true });
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="请输入您收到的验证码"
              suffix={
                hasFeedback.code ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <span />
              }
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={s.button}
            disabled={
              step === 0 ? !(hasFeedback.user_name && hasFeedback.imgcode) : !hasFeedback.code
            }
          >
            {step === 0 ? ' 下一步' : '重置密码'}
          </Button>
        </Form.Item>
        <Form.Item>
          <a type="primary" onClick={() => setLoginTab(true)}>
            <LeftOutlined />
            返回登录
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Reset;
