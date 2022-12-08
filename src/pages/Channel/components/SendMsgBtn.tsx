import React from "react";
import { observer } from 'mobx-react';
import { Button } from 'antd';
import styles from './Chat.module.less';
import type { EditorRef } from '@/components/Editor/common';

interface SendMsgBtnProps {
    editorRef: React.MutableRefObject<EditorRef | null>,
    onSend: () => void;
}

const SendMsgBtn: React.FC<SendMsgBtnProps> = (props) => {
    return (
        <div className={styles.chatBtnWrap}>
            <Button type="primary" style={{ height: "36px", width: "60px" }} onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onSend();
            }}>
                发送
            </Button>
        </div>

    );
};

export default observer(SendMsgBtn);