import { Button, Form, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { gen_captcha, pre_register, register } from "@/api/user";
import { request } from "@/utils/request";

const PHONE_REG = /^\d{11}$/;

export interface RegisterProps {
    onCancel: () => void;
    onOk: (name: string) => void;
}

const Register = (props: RegisterProps) => {
    const [userName, setUserName] = useState("");
    const [captchaId, setCaptchaId] = useState("");
    const [captchaData, setCaptchaData] = useState("");
    const [captchaValue, setCaptchaValue] = useState("");
    const [regCode, setRegCode] = useState("");
    const [countDown, setCountDown] = useState(0);
    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const isValieUserName = () => {
        if (PHONE_REG.test(userName)) {
            return true;
        } else {
            const parts = userName.split("@");
            if (parts.length == 2 && parts[0].length > 0 && parts[1].length > 0) {
                return true;
            }
        }
        return false;
    };

    const refreshCaptcha = async () => {
        const res = await request(gen_captcha());
        setCaptchaId(res.captcha_id);
        setCaptchaData(res.base64_image);
        setCaptchaValue("");
    };

    const preRegister = async () => {
        await request(pre_register(userName, captchaId, captchaValue));
        setCountDown(60);
        const t = setInterval(() => {
            setCountDown(oldValue => {
                if (oldValue > 0) {
                    return oldValue - 1;
                } else {
                    clearInterval(t);
                    return oldValue;
                }
            })
        }, 1000);
    };

    const processRegister = async () => {
        await request(register({
            user_name: userName,
            basic_info: {
                display_name: nickName,
                logo_uri: "",
            },
            auth_code: regCode,
            passwd: password,
        }));
        props.onOk(userName);
    };

    useEffect(() => {
        refreshCaptcha();
    }, []);

    return (
        <Form labelCol={{ span: 3 }}>
            <Form.Item label="账号" help={
                <>
                    {isValieUserName() == false && userName != "" && <span style={{ color: "red" }}>账号只支持手机号和邮箱地址</span>}
                </>
            }>
                <Input value={userName} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setUserName(e.target.value);
                }} placeholder="请输入手机号或邮箱地址" />
            </Form.Item>
            {captchaData != "" && (
                <Form.Item style={{ position: "relative", marginBottom: "30px" }}>
                    <Space style={{ position: "absolute", right: "10px" }}>
                        <img src={captchaData} height={32} style={{ cursor: "pointer" }} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            refreshCaptcha();
                        }} />
                        <Input value={captchaValue} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCaptchaValue(e.target.value.trim());
                        }} placeholder="请输入左侧字符" />
                        <Button type="primary" disabled={captchaValue.length != 4 || isValieUserName() == false || countDown > 0} onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            preRegister();
                        }}>获取注册码{countDown > 0 ? `(${countDown})` : ""}</Button>
                    </Space>
                </Form.Item>
            )}
            <Form.Item label="注册码">
                <Input value={regCode} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRegCode(e.target.value.trim());
                }} placeholder="请输入注册码(请等待接收注册码)" />
            </Form.Item>
            <Form.Item label="昵称">
                <Input value={nickName} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setNickName(e.target.value.trim());
                }} placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item label="密码" help={
                <>
                    {password.length > 0 && (password.length < 6 || password.length > 12) &&
                        <span style={{ color: "red" }}>
                            密码长度需要在6-12位
                        </span>}
                </>
            }>
                <Input.Password value={password} placeholder="请输入密码" onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPassword(e.target.value.trim());
                }} />
            </Form.Item>
            <Form.Item label="确认密码" help={
                <>
                    {rePassword != password && rePassword.length > 0 &&
                        <span style={{ color: "red" }}>
                            和上面设置的密码不一致
                        </span>}
                </>
            }>
                <Input.Password value={rePassword} placeholder="请重复刚才的密码" onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setRePassword(e.target.value.trim());
                }} />
            </Form.Item>
            <Form style={{ display: "relative", marginBottom: "50px" }}>
                <Space style={{ position: "absolute", right: "10px" }} size="middle">
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        props.onCancel();
                    }}>返回登录</Button>
                    <Button type="primary"
                        disabled={isValieUserName() == false || regCode == "" || nickName == "" || (password.length < 6 || password.length > 12) || password != rePassword}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            processRegister();
                        }}>注册</Button>
                </Space>
            </Form>
        </Form>
    );
};

export default Register;