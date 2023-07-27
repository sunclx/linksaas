import React, { useEffect, useState } from "react";
import type { MethodWithServiceInfo } from "./types";
import { Button, Card, Checkbox, Form, Input, Space, message } from "antd";
import { Command } from '@tauri-apps/api/shell';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { writeText } from '@tauri-apps/api/clipboard';

export interface MethodCallProps {
    remoteAddr: string;
    secure: boolean;
    protoPath: string;
    method: MethodWithServiceInfo;
}

const MethodCall = (props: MethodCallProps) => {
    const [remoteAddr, setRemoteAddr] = useState(props.remoteAddr);
    const [secure, setSecure] = useState(props.secure);
    const [reqData, setReqData] = useState("{}");
    const [respData, setRespData] = useState("");

    const genReqData = async () => {
        const cmd = Command.sidecar("bin/grpcutil", ["genReq", "--in", props.protoPath, "--service", props.method.serviceName, "--method", props.method.method.methodName]);
        const result = await cmd.execute();
        try {
            const obj = JSON.parse(result.stdout);
            if (obj.error == undefined) {
                setReqData(result.stdout);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const callMethod = async () => {
        setRespData("");
        const args = ["call", "--in", props.protoPath, "--service", props.method.serviceName, "--method", props.method.method.methodName, "--addr", remoteAddr];
        if (secure) {
            args.push("--secure");
        }
        const cmd = Command.sidecar("bin/grpcutil", args);
        cmd.stdout.on("data", line => setRespData(oldValue => {
            if (line.trim() == "") {
                return oldValue;
            }
            if (oldValue == "") {
                return line;
            }
            return oldValue + "\r\n" + line;
        }));
        const child = await cmd.spawn();
        await child.write(reqData + "\n");
    };

    useEffect(() => {
        genReqData();
    }, [props.protoPath]);

    return (
        <div style={{ display: "flex" }}>
            <Card style={{ flex: 1 }} bodyStyle={{ height: "calc(100vh - 70px)", paddingBottom: "10px", overflow: "hidden" }}
                title={<h1 style={{ fontSize: "16px", fontWeight: 700 }}>请求</h1>}
                extra={
                    <Space size="large">
                        <Button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoteAddr(props.remoteAddr);
                            setSecure(props.secure);
                            setRespData("");
                            genReqData();
                        }}>重置请求</Button>
                        <Button type="primary" onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            callMethod();
                        }}>发送请求</Button>
                    </Space>
                }>
                <Form>
                    <Form.Item label="服务地址">
                        <Input value={remoteAddr} onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRemoteAddr(e.target.value.trim());
                        }} />
                    </Form.Item>
                    <Form.Item label="安全模式">
                        <Checkbox checked={secure} onChange={e => {
                            e.stopPropagation();
                            setSecure(e.target.checked);
                        }} />
                    </Form.Item>
                </Form>
                <CodeEditor
                    value={reqData}
                    language="json"
                    minHeight={200}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setReqData(e.target.value);
                    }}
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        height: "calc(100vh - 210px)",
                        overflow: "scroll"
                    }}
                />
            </Card>
            <Card style={{ flex: 1 }}
                title={<h1 style={{ fontSize: "16px", fontWeight: 700 }}>响应</h1>}
                extra={
                    <Button type="primary" disabled={respData == ""} onClick={e=>{
                        e.stopPropagation();
                        e.preventDefault();
                        writeText(respData).then(()=>{
                            message.info("已复制到剪切板");
                        });
                    }}>复制响应</Button>
                }>
                <CodeEditor
                    value={respData}
                    language="json"
                    minHeight={200}
                    readOnly
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        height: "calc(100vh - 124px)",
                        overflow: "scroll"
                    }}
                />
            </Card>
        </div>
    );
}

export default MethodCall;