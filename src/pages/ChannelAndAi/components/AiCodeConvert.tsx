import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Form, List, Select, message } from "antd";
import { useStores } from "@/hooks";
import s from "./AiCodeConvert.module.less";
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from "@/components/Button";
import { request } from "@/utils/request";
import { gen_ai_token } from "@/api/project";
import { convertCode } from "@/api/ai";

const AiCodeConvert = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [srcLang, setSrcLang] = useState("");
    const [destLang, setDestLang] = useState("");
    const [srcContent, setSrcContent] = useState("");
    const [destContentList, setDestContentList] = useState<string[]>([]);
    const [token, setToken] = useState("");

    const genToken = async () => {
        const res = await request(gen_ai_token({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        setToken(res.token);
    };

    const callConvertCode = async () => {
        setDestContentList([]);
        try {
            const res = await convertCode(projectStore.curProject?.ai_gateway_addr ?? "", token, srcLang, destLang, srcContent);
            setDestContentList(res);
        } catch (e) {
            message.error(JSON.stringify(e));
        }
    };

    useEffect(() => {
        if (projectStore.projectAiCap != null && projectStore.projectAiCap.coding.convertLangList.length >= 2) {
            setSrcLang(projectStore.projectAiCap.coding.convertLangList[0]);
            setDestLang(projectStore.projectAiCap.coding.convertLangList[1]);
        }
    }, [projectStore.projectAiCap]);

    useEffect(() => {
        genToken();
        const timer = setInterval(() => genToken(), 1800 * 1000);
        return () => {
            clearInterval(timer);
        };
    }, [projectStore.curProjectId, projectStore.projectAiCap]);

    return (
        <Card title="代码翻译" bordered={false} extra={
            <Form layout="inline">
                <Form.Item label="源语言">
                    <Select style={{ width: "100px" }} value={srcLang} onChange={value => setSrcLang(value)}>
                        {projectStore.projectAiCap?.coding.convertLangList.map(item => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="目标语言">
                    <Select style={{ width: "100px" }} value={destLang} onChange={value => setDestLang(value)}>
                        {projectStore.projectAiCap?.coding.convertLangList.map(item => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button disabled={!(srcContent != "" && srcLang != "" && destLang != "" && srcLang != destLang)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            callConvertCode();
                        }}>
                        翻译代码
                    </Button>
                </Form.Item>
            </Form>
        }>
            <div className={s.editor_wrap}>
                <CodeEditor
                    language={srcLang}
                    placeholder="请输入代码"
                    autoFocus={true}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSrcContent(e.target.value)
                    }}
                    className={s.src_editor}
                />
                <div className={s.divider} />
                <Card title="翻译结果" className={s.dest_editor_wrap} bordered={false}>
                    <List
                        dataSource={destContentList}
                        renderItem={(destContent, index) => (
                            <CodeEditor
                                key={index}
                                value={destContent}
                                language={destLang}
                                placeholder="翻译结果"
                                readOnly
                                className={s.dest_editor}
                            />
                        )}
                    />
                </Card>

            </div>
        </Card>
    );
};

export default observer(AiCodeConvert);