import React, { useEffect, useState } from "react";
import type { Response } from '@tauri-apps/api/http';
import { Button, Card, Descriptions, Space, Tabs } from "antd";
import { CloseOutlined } from "@ant-design/icons";


export interface ResponsePanelProps {
    response: Response<unknown>,
    onClose: () => void;
}

const ResponsePanel = (props: ResponsePanelProps) => {

    const [contentType, setContentType] = useState("");

    const guessContentType = () => {
        const headers = Object.keys(props.response.headers);
        for (const header of headers) {
            if (header.toLowerCase().includes("content-type")) {
                return props.response.headers[header];
            }
        }
        return "text";
    };

    const getImgSrc = () => {
        const data = Uint8Array.from(props.response.data as number[]);
        const chunk = 8 * 1024;
        let dataStr = "";
        for (let i = 0; i < data.length / chunk; i++) {
            const buf = data.slice(i * chunk, (i + 1) * chunk);
            dataStr += String.fromCharCode(...buf);
        }
        const dataB64 = btoa(dataStr);
        return `data:image/*;base64,${dataB64}`;
    };

    const getText = () => {
        const decoder = new TextDecoder();
        const data = Uint8Array.from(props.response.data as number[]);
        return decoder.decode(data);
    };

    useEffect(() => {
        const ct = guessContentType();
        setContentType(ct);
    }, []);

    return (
        <Card bordered={false}
            title={
                <Space>
                    <span>状态码:{props.response.status}</span>
                </Space>
            }
            extra={
                <Button type="text" title="关闭" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.onClose();
                }}>
                    <CloseOutlined />
                </Button>}>
            <Tabs type="card" items={[
                {
                    key: "body",
                    label: "内容",
                    children: (
                        <>
                            {contentType.includes("image") && (
                                <img src={getImgSrc()} />
                            )}
                            {(contentType.includes("text") || contentType.includes("json") || contentType.includes("xml") || contentType.includes("html")) && (
                                <pre>{getText()}</pre>
                            )}

                        </>
                    )
                },
                {
                    key: "header",
                    label: "响应头",
                    children: (
                        <Descriptions column={1} bordered={true}>
                            {Object.keys(props.response.headers).map(key => (
                                <Descriptions.Item label={key} key={key}>{props.response.headers[key]}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    )
                }
            ]} />
        </Card>
    );
};

export default ResponsePanel;