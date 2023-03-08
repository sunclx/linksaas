import { Card, Modal, Popover, Space } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { LeftOutlined, MoreOutlined } from "@ant-design/icons";
import { request } from "@/utils/request";
import { get_doc, decrypt, remove_doc } from "@/api/user_kb";
import { useStores } from "@/hooks";
import { ReadOnlyEditor } from "@/components/Editor";
import { useHistory } from "react-router-dom";
import { WORKBENCH_KB_DOC_SUFFIX, WORKBENCH_PATH } from "@/utils/constant";
import Button from "@/components/Button";
import type { UserDocState } from "../UserDoc";
import MoveDocModal from "./MoveDocModal";

interface ReadDocProps {
    spaceId: string;
    sshPubKey: string;
    docId: string;
}

const ReadDoc: React.FC<ReadDocProps> = (props) => {
    const history = useHistory();
    const userStore = useStores('userStore');

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false);

    const loadDoc = async () => {
        const res = await request(get_doc(userStore.sessionId, props.spaceId, props.docId));
        setTitle(res.info.basic_info.title);
        let contentValue = res.info.basic_info.content;
        if (props.sshPubKey != "") {
            const encList = contentValue.split("\t");
            const decList = [];
            for (const encStr of encList) {
                const decStr = await decrypt(encStr);
                decList.push(decStr);
            }
            contentValue = decList.join("");
        }
        setContent(contentValue);
    };

    const removeDoc = async () => {
        await request(remove_doc(userStore.sessionId, props.spaceId, props.docId));
        history.push(`${WORKBENCH_PATH}?tab=userDoc&spaceId=${props.spaceId}`);
    };

    useEffect(() => {
        loadDoc();
    }, [props.docId]);

    return (
        <Card title={<span style={{ fontSize: "14px", fontWeight: 800, paddingLeft: "5px" }}>
            <a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                history.push(`${WORKBENCH_PATH}?tab=userDoc&spaceId=${props.spaceId}&userAction=true`)
            }}><LeftOutlined /></a>
            &nbsp;文档：{title}
        </span>} extra={
            <Space size="large">
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const state: UserDocState = {
                        spaceId: props.spaceId,
                        sshPubKey: props.sshPubKey,
                        docId: props.docId,
                        readMode: false,
                    };
                    history.push(WORKBENCH_KB_DOC_SUFFIX, state);
                }}>修改文档</Button>
                <Popover placement="bottom" content={
                    <div style={{ padding: "10px 10px" }}>
                        <div>
                            <Button type="link"
                                disabled={props.sshPubKey != ""}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowMoveModal(true);
                                }}>移动文档</Button>
                        </div>
                        <div>
                            <Button type="link" danger onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRemoveModal(true);
                            }}>删除文档</Button>
                        </div>
                    </div>
                } trigger="click">
                    <MoreOutlined style={{ paddingRight: "10px" }} />
                </Popover>
            </Space>
        }>
            <div style={{ height: "calc(100vh - 100px)", overflow: "scroll", padding: "0px 20px" }}>
                {content != "" && (
                    <ReadOnlyEditor content={content} />
                )}
            </div>
            {showRemoveModal == true && (
                <Modal open title="删除文档"
                    okButtonProps={{ danger: true }}
                    okText="删除"
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeDoc();
                    }}>
                    是否删除当前文档?
                </Modal>
            )}
            {showMoveModal == true && (
                <MoveDocModal spaceId={props.spaceId} docId={props.docId} onCancel={() => setShowMoveModal(false)}
                    onOk={spaceId => {
                        setShowMoveModal(false);
                        history.push(`${WORKBENCH_PATH}?tab=userDoc&spaceId=${spaceId}`)
                    }} />
            )}
        </Card>
    );
};

export default observer(ReadDoc);