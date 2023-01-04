import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Card, Form, Modal, Select,message } from "antd";
import s from './GenCodeModal.module.less';
import { request } from "@/utils/request";
import { list_lang, list_frame_work, gen_test_code } from '@/api/project_test_case';
import { useStores } from "@/hooks";
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from "@/components/Button";
import { writeText } from '@tauri-apps/api/clipboard';

interface GenCodeModalProps {
    entryId: string
    onCancel: () => void;
}

const GenCodeModal: React.FC<GenCodeModalProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [lang, setLang] = useState("");
    const [langList, setLangList] = useState<string[]>([]);
    const [frameWork, setFrameWork] = useState("");
    const [frameWorkList, setFrameWorkList] = useState<string[]>([]);
    const [testCode, setTestCode] = useState<string>("");

    const loadLang = async () => {
        const res = await request(list_lang({}));
        setLangList(res.lang_list);
        if (res.lang_list.length > 0 && lang == "") {
            setLang(res.lang_list[0]);
        }
    }

    const loadFrameWork = async () => {
        if (lang == "") {
            return;
        }
        const res = await request(list_frame_work({ lang: lang }));
        setFrameWorkList(res.frame_work_list);
        if (res.frame_work_list.length > 0) {
            setFrameWork(res.frame_work_list[0]);
        }
    };

    const getTestCode = async () => {
        if (lang == "" || frameWork == "") {
            return;
        }
        const res = await request(gen_test_code({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
            lang: lang,
            frame_work: frameWork,
        }));
        setTestCode(res.gen_code);
    }

    useEffect(() => {
        loadLang();
    }, []);

    useEffect(() => {
        loadFrameWork();
    }, [lang]);

    useEffect(() => {
        getTestCode();
    }, [frameWork])

    return (
        <Modal open footer={null}
            title="生成代码"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Card bordered={false} className={s.content_wrap} extra={
                <div>
                    <Form layout="inline">
                        <Form.Item label="编程语言">
                            <Select value={lang} onChange={value => setLang(value)} className={s.select}>
                                {langList.map(item => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label="测试框架">
                            <Select value={frameWork} onChange={value => setFrameWork(value)} className={s.select}>
                                {frameWorkList.map(item => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="link" onClick={e=>{
                                e.stopPropagation();
                                e.preventDefault();
                                writeText(testCode).then(()=>{
                                    message.info("复制成功");
                                });
                            }}>复制代码</Button>
                        </Form.Item>
                    </Form>
                </div>
            }>
                <CodeEditor
                    value={testCode}
                    language={lang}
                    disabled
                    style={{
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        height: "calc(100vh - 300px)",
                        overflow:"scroll",
                    }}
                />
            </Card>
        </Modal>
    );
}

export default observer(GenCodeModal);