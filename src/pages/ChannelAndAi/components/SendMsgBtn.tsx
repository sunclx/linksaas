import React from "react";
import { observer } from 'mobx-react';
import { Dropdown } from 'antd';
import styles from './Chat.module.less';
import type { EditorRef } from '@/components/Editor/common';

export enum SEND_ACTION {
    SEND_ACTION_NULL,
    SEND_ACTION_CREATE_REQUIRE_MENT,
    SEND_ACTION_CREATE_TASK,
    SEND_ACTION_CREATE_BUG,
};

interface SendMsgBtnProps {
    editorRef: React.MutableRefObject<EditorRef | null>,
    onSend: (action: SEND_ACTION) => void;
}

const SendMsgBtn: React.FC<SendMsgBtnProps> = (props) => {
    return (
        <div className={styles.chatBtnWrap}>
            <Dropdown.Button type="primary" onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onSend(SEND_ACTION.SEND_ACTION_NULL);
            }} menu={{
                items: [
                    {
                        label: "发送并创建需求",
                        key: "req",
                    },
                    {
                        label: "发送并创建任务",
                        key: "task",
                    },
                    {
                        label: "发送并创建缺陷",
                        key: "bug",
                    },
                ],
                onClick: e => {
                    if (e.key == "req") {
                        props.onSend(SEND_ACTION.SEND_ACTION_CREATE_REQUIRE_MENT);
                    } else if (e.key == "task") {
                        props.onSend(SEND_ACTION.SEND_ACTION_CREATE_TASK);
                    } else if (e.key == "bug") {
                        props.onSend(SEND_ACTION.SEND_ACTION_CREATE_BUG);
                    }
                },
            }}>
                发送
            </Dropdown.Button>
        </div>

    );
};

export default observer(SendMsgBtn);