import { Card, Input, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import Button from "@/components/Button";
import s from "./WriteDoc.module.less";
import { useCommonEditor } from "@/components/Editor";
import { useStores } from "@/hooks";
import { FILE_OWNER_TYPE_USER_DOC } from "@/api/fs";
import { useHistory } from "react-router-dom";
import { create_doc, encrypt, get_doc, decrypt, update_doc } from "@/api/user_kb";
import { request } from "@/utils/request";
import type { UserDocState } from "../UserDoc";
import { WORKBENCH_KB_DOC_SUFFIX, WORKBENCH_PATH } from "@/utils/constant";
import { LeftOutlined } from "@ant-design/icons";

interface WriteDocProps {
    spaceId: string;
    sshPubKey: string;
    docId: string;
}

const WriteDoc: React.FC<WriteDocProps> = (props) => {
    const history = useHistory();

    const userStore = useStores('userStore');

    const [title, setTitle] = useState("");

    const { editor, editorRef } = useCommonEditor({
        content: "",
        fsId: props.sshPubKey == "" ? userStore.userInfo.userFsId : "",
        ownerType: FILE_OWNER_TYPE_USER_DOC,
        ownerId: userStore.userInfo.userId,
        historyInToolbar: false,
        clipboardInToolbar: false,
        widgetInToolbar: true,
        showReminder: false,
    });

    const encContent = async (content: string) => {
        const end = content.length;
        const encList = [];
        for (let i = 0; i < end; i += 256) {
            let j = i + 256;
            if (j >= end) {
                j = end;
            }
            if (i != j) {
                const part = content.substring(i, j);
                const encStr = await encrypt(props.sshPubKey, part);
                encList.push(encStr);
            }
        }
        return encList.join("\t");
    };

    const createDoc = async () => {
        const titleValue = title.trim();
        if (titleValue == "") {
            message.error("请输入文档标题");
            return;
        }
        if (editorRef.current == null) {
            return;
        }
        let content = JSON.stringify(editorRef.current.getContent());
        if (props.sshPubKey != "") {
            content = await encContent(content);
        }
        const res = await request(create_doc({
            session_id: userStore.sessionId,
            basic_info: {
                space_id: props.spaceId,
                title: titleValue,
                content: content,
            },
        }));
        const state: UserDocState = {
            spaceId: props.spaceId,
            sshPubKey: props.sshPubKey,
            docId: res.doc_id,
            readMode: true,
        };
        history.push(WORKBENCH_KB_DOC_SUFFIX, state);
    };

    const updateDoc = async () => {
        const titleValue = title.trim();
        if (titleValue == "") {
            message.error("请输入文档标题");
            return;
        }
        if (editorRef.current == null) {
            return;
        }
        let content = JSON.stringify(editorRef.current.getContent());
        if (props.sshPubKey != "") {
            content = await encContent(content);
        }
        await request(update_doc({
            session_id: userStore.sessionId,
            doc_id: props.docId,
            basic_info: {
                space_id: props.spaceId,
                title: titleValue,
                content: content,
            },
        }));
        const state: UserDocState = {
            spaceId: props.spaceId,
            sshPubKey: props.sshPubKey,
            docId: props.docId,
            readMode: true,
        };
        history.push(WORKBENCH_KB_DOC_SUFFIX, state);
    };

    const loadDoc = async () => {
        const res = await request(get_doc(userStore.sessionId, props.spaceId, props.docId));
        setTitle(res.info.basic_info.title);
        let contentValue = res.info.basic_info.content;
        if (props.sshPubKey != "") {
            const encList = contentValue.split("\t");
            const decList = [];
            for (const encStr of encList){
                const  decStr = await decrypt(encStr);
                decList.push(decStr);
            }
            contentValue = decList.join("");
        }
        setTimeout(() => {
            editorRef.current?.setContent(contentValue);
        }, 100);
    };

    useEffect(() => {
        if (props.docId != "") {
            loadDoc();
        }
    }, [props.docId]);

    return (
        <Card title={
            <span style={{ fontSize: "16px", fontWeight: 800, paddingLeft: "8px" }}>
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.docId == "") {
                        history.push(`${WORKBENCH_PATH}?tab=userDoc&spaceId=${props.spaceId}`)
                    } else {
                        history.goBack();
                    }
                }}><LeftOutlined /></a>
                &nbsp;{props.docId == "" ? "创建文档" : "修改文档"}
            </span>} extra={
                <Space size="large">
                    <Button type="default" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (props.docId == "") {
                            history.push(`${WORKBENCH_PATH}?tab=userDoc&spaceId=${props.spaceId}`);
                        } else {
                            history.goBack();
                        }
                    }}>取消</Button>
                    <Button
                        disabled={title.trim() == ""}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.docId != "") {
                                updateDoc();
                            } else {
                                createDoc();
                            }
                        }}>保存</Button>
                </Space>
            }>
            <div className={s.content_wrap}>
                <Input
                    allowClear
                    bordered={false}
                    value={title}
                    placeholder={`请输入文档标题`}
                    style={{ marginBottom: '12px', borderBottom: "1px solid #e4e4e8" }}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                />
                <div className="_userDocContext">{editor}</div>
            </div>
        </Card>
    );
};
export default observer(WriteDoc);