import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { List, Modal } from "antd";
import type { KbSpaceInfo } from "@/api/user_kb";
import { list_space, move_doc } from "@/api/user_kb";

import { request } from "@/utils/request";
import { useStores } from "@/hooks";

interface MoveDocModalProps {
    spaceId: string;
    docId: string;
    onCancel: () => void;
    onOk: (spaceId: string) => void;
}

const MoveDocModal: React.FC<MoveDocModalProps> = (props) => {
    const userStore = useStores('userStore');

    const [kbSpaceList, setKbSpaceList] = useState<KbSpaceInfo[]>([]);

    const loadKbSpace = async () => {
        const res = await request(list_space(userStore.sessionId));
        const tmpList = res.info_list.filter(item => {
            if (item.ssh_pub_key != "") {
                return false;
            }
            if (item.space_id == props.spaceId) {
                return false;
            }
            return true;
        })
        setKbSpaceList(tmpList);
    };

    const moveToSpace = async (toSpaceId: string) => {
        await request(move_doc({
            session_id: userStore.sessionId,
            doc_id: props.docId,
            from_space_id: props.spaceId,
            to_space_id: toSpaceId,
        }));
        props.onOk(toSpaceId);
    };

    useEffect(() => {
        loadKbSpace();
    }, [props.spaceId]);
    return (
        <Modal open title="移动文档"
            style={{ maxWidth: "200px" }}
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <div style={{ height: "calc(100vh - 400px)", overflow: "scroll" }}>
                <List>
                    {kbSpaceList.map(item => (
                        <List.Item key={item.space_id}>
                            <a style={{ margin: "0px 20px" ,width:"100%"}} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                moveToSpace(item.space_id);
                            }}>{item.basic_info.space_name}</a>
                        </List.Item>
                    ))}
                </List>
            </div>
        </Modal>
    );
};

export default observer(MoveDocModal);