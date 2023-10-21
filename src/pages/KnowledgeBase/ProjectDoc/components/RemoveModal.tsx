import React from 'react';
import ActionModal from '@/components/ActionModal';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import { message } from 'antd';


type RemoveModalProps = {
    onCancel: () => void,
    onOk: () => void,
};

const RemoveModal: React.FC<RemoveModalProps> = (props) => {
    const userStore = useStores('userStore');
    const docSpaceStore = useStores('docSpaceStore');

    const removeDoc = async () => {
        const res = await request(
            docApi.remove_doc({
                session_id: userStore.sessionId,
                project_id: docSpaceStore.curDoc?.project_id ?? "",
                doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
                doc_id: docSpaceStore.curDocId,
            }),
        );
        if (res) {
            message.success(`删除文档 ${docSpaceStore.curDoc?.base_info.title ?? ""}`);
            props.onOk();
        }
    };

    const removeDocInRecycleBin = async () => {
        const res = await request(
            docApi.remove_doc_in_recycle({
                session_id: userStore.sessionId,
                project_id: docSpaceStore.curDoc?.project_id ?? "",
                doc_space_id: docSpaceStore.curDoc?.doc_space_id ?? "",
                doc_id: docSpaceStore.curDocId,
            }),
        );
        if (res) {
            message.success(`彻底删除文档 ${docSpaceStore.curDoc?.base_info.title ?? ""}`);
            props.onOk();
        }
    };

    return (<ActionModal
        open
        style={{ textAlign: 'center' }}
        title={`${docSpaceStore.recycleBin ? '彻底' : ''}删除文档`}
        onCancel={() => {
            props.onCancel();
        }}
        width={330}
        onOK={() => {
            if (docSpaceStore.recycleBin) {
                removeDocInRecycleBin();
            } else {
                removeDoc();
            }
        }}
        okText={`${docSpaceStore.recycleBin ? '彻底' : ''}删除`}
    >
        是否确认删除文档 {docSpaceStore.curDoc?.base_info.title ?? ""}?
        <br />
        {!docSpaceStore.recycleBin && <span>删除后，可以在回收站找到该文档</span>}
        {docSpaceStore.recycleBin && <span>彻底删除后，此文档无法再恢复!</span>}
    </ActionModal>);
};

export default RemoveModal;
