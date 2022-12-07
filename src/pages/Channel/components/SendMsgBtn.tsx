import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, Form, Switch, Select } from 'antd';
import styles from './Chat.module.less';
import { get_float_notice_per_day } from '@/api/project_member';
import { request } from '@/utils/request';
import { useStores } from "@/hooks";
import type { EditorRef } from '@/components/Editor/common';
import { get_reminder_info } from "@/components/Editor";

interface SendMsgBtnProps {
    editorRef: React.MutableRefObject<EditorRef | null>,
    onSend: (floatNoticeMinute: number) => void;
}

const SendMsgBtn: React.FC<SendMsgBtnProps> = (props) => {
    const [hover, setHover] = useState(false);
    const [enable, setEnable] = useState(false);
    const [remainCount, setRemainCount] = useState(0);
    const [hasReminder, setHasReminder] = useState(false);
    const [floatMinutes, setFloatMinutes] = useState(5);

    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const loadRemainInfo = async () => {
        //检查内容里面是否有reminder
        if (props.editorRef.current == null) {
            return;
        }
        const content = props.editorRef.current.getContent();
        const reminder = get_reminder_info(content);
        if ((reminder.reminder_all == false) && (reminder.extra_reminder_list.length == 0)) {
            return;
        }
        setHasReminder(true);
        const res = await request(get_float_notice_per_day({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
        }));
        if (res) {
            setRemainCount(res.remain_count);
        }
    };

    useEffect(() => {
        setHasReminder(false);
        setRemainCount(0);
        if (hover) {
            loadRemainInfo();
        }
    }, [hover]);

    return (
        <div className={styles.chatBtnWrap}
            onMouseOver={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(true);
            }}
            onMouseOut={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(false);
            }}
        >

            {hover && hasReminder && (<div className={styles.floatNotice}>
                <Form labelCol={{ span: 12 }} wrapperCol={{ span: 22 }}>
                    <Form.Item label="浮动提示:" className={styles.label} >
                        <Switch style={{ width: "70px" }} disabled={remainCount == 0} onChange={v => setEnable(v)} />
                    </Form.Item>
                    <Form.Item label="浮动时长" className={styles.label}>
                        <Select style={{ width: "70px" }} value={floatMinutes} disabled={!enable} onChange={v => setFloatMinutes(v)}>
                            {[5, 10, 30, 60].map(t => {
                                return (
                                    <Select.Option
                                        key={t}
                                        value={t}>
                                        {t}分钟
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </div>)}
            <div className={styles.chatBtn}>
                <div style={{ height: "24px", backgroundColor: (hover && hasReminder) ? "inherit" : "white" }}>
                    {(hover && hasReminder) ? `剩余${remainCount}次` : ""}
                </div>
                <Button type="primary" style={{ height: "36px", width: "60px" }} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if(enable){
                        props.onSend(floatMinutes);
                    }else{
                        props.onSend(0);
                    }
                }}>
                    发送
                </Button>
            </div>
        </div>
    );
};

export default observer(SendMsgBtn);