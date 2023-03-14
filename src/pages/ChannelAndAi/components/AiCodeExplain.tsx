import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { gen_ai_token } from "@/api/project";
import { explainCode } from "@/api/ai";
import { Card, Form, List, Select, message } from "antd";
import s from "./AiCodeConvert.module.less";
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from "@/components/Button";

const AiCodeExplain = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    
    const [lang,setLang] = useState("");
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

    const callExplainCode = async () => {
        setDestContentList([]);
        try {
            const res = await explainCode(projectStore.curProject?.ai_gateway_addr ?? "", token, lang, srcContent);
            setDestContentList(res);
        } catch (e) {
            message.error(JSON.stringify(e));
        }
    };

    useEffect(() => {
        if (projectStore.projectAiCap != null && projectStore.projectAiCap.coding.explainLangList.length > 0) {
            setLang(projectStore.projectAiCap.coding.explainLangList[0]);
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
        <Card title="代码解释" bordered={false} extra={
            <Form layout="inline">
                <Form.Item label="编程语言">
                    <Select style={{ width: "100px" }} value={lang} onChange={value => setLang(value)}>
                        {projectStore.projectAiCap?.coding.explainLangList.map(item => (
                            <Select.Option key={item} value={item}>{item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button 
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            callExplainCode();
                        }}>
                        解析代码
                    </Button>
                </Form.Item>
            </Form>
        }>
            <div className={s.editor_wrap}>
                <CodeEditor
                    language={lang}
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
                <Card title="解释结果" className={s.dest_editor_wrap} bordered={false}>
                    <List
                        dataSource={destContentList}
                        renderItem={(destContent, index) => (
                            <CodeEditor
                                key={index}
                                value={destContent}
                                language={lang}
                                placeholder="解释结果"
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

export default observer(AiCodeExplain);