import React from "react";
import { observer } from 'mobx-react';
import { ENTRY_TYPE_BOARD, ENTRY_TYPE_DOC, ENTRY_TYPE_FILE, ENTRY_TYPE_PAGES, ENTRY_TYPE_SPRIT, type EntryInfo, remove_file, remove_pages } from "@/api/project_entry";
import { Modal, message } from "antd";
import { getEntryTypeStr } from "./common";
import { useStores } from "@/hooks";
import { remove_doc } from "@/api/project_doc";
import { remove as remove_sprit } from "@/api/project_sprit";
import { request } from "@/utils/request";
import { remove_board } from "@/api/project_board";

export interface RemoveEntryModalProps {
    entryInfo: EntryInfo;
    onRemove: () => void;
    onCancel: () => void;
}

const RemoveEntryModal = (props: RemoveEntryModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const entryStore = useStores('entryStore');

    const removeEntry = async () => {
        if (props.entryInfo.entry_type == ENTRY_TYPE_SPRIT) {
            await request(remove_sprit(userStore.sessionId, projectStore.curProjectId, props.entryInfo.entry_id));
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_DOC) {
            await request(remove_doc({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                doc_id: props.entryInfo.entry_id,
            }));
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_PAGES) {
            await request(remove_pages({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: props.entryInfo.entry_id,
            }));
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_BOARD) {
            await request(remove_board({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                board_id: props.entryInfo.entry_id,
            }));
        } else if (props.entryInfo.entry_type == ENTRY_TYPE_FILE) {
            await request(remove_file({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                entry_id: props.entryInfo.entry_id,
            }));
        }
        if (entryStore.curEntry != null && entryStore.curEntry.entry_id == props.entryInfo.entry_id) {
            entryStore.curEntry = null;
        }
        props.onRemove();
        message.info("删除成功");
    };

    return (
        <Modal open title={`删除${getEntryTypeStr(props.entryInfo.entry_type)}`}
            okText="删除" okButtonProps={{ danger: true }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                removeEntry();
            }}>
            <p>
                是否删除&nbsp;{getEntryTypeStr(props.entryInfo.entry_type)}&nbsp;{props.entryInfo.entry_title}&nbsp;?
            </p>
            <p style={{ color: "red" }}>
                删除后数据将不可恢复!!!
            </p>
        </Modal>
    );
};

export default observer(RemoveEntryModal);