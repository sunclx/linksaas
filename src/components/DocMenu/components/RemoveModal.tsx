import React from 'react';
import ActionModal from '@/components/ActionModal';
import * as docApi from '@/api/project_doc';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import { message } from 'antd';


type RemoveModalProps = {
    docKey: docApi.DocKey;
    recycleBin: boolean;
    onCancel: () => void,
};

const RemoveModal: React.FC<RemoveModalProps> = (props) => {
    const userStore = useStores('userStore');
    const docStore = useStores('docStore');

    const removeDoc = async (docKey: docApi.DocKey) => {
        const res = await request(
            docApi.remove_doc({
                session_id: userStore.sessionId,
                project_id: docKey.project_id,
                doc_space_id: docKey.doc_space_id,
                doc_id: docKey.doc_id,
            }),
        );
        if (res) {
            docStore.removeDocKey(docKey.doc_id);
            message.success(`删除文档 ${props.docKey.title}`);
        }
    };

    const removeDocInRecycleBin = async (docKey: docApi.DocKey) => {
        const res = await request(
            docApi.remove_doc_in_recycle({
                session_id: userStore.sessionId,
                project_id: docKey.project_id,
                doc_space_id: docKey.doc_space_id,
                doc_id: docKey.doc_id,
            }),
        );
        if (res) {
            docStore.removeFromRecycle(docKey.doc_id);
            message.success(`彻底删除文档 ${props.docKey.title}`);
        }
    };

    return (<ActionModal
        visible
        style={{ textAlign: 'center' }}
        title={`${props.recycleBin ? '彻底' : ''}删除文档`}
        onCancel={() => {
            props.onCancel();
        }}
        width={330}
        onOK={() => {
            if (props.recycleBin) {
                removeDocInRecycleBin(props.docKey);
            } else {
                removeDoc(props.docKey);
            }
        }}
        okText={`${props.recycleBin ? '彻底' : ''}删除`}
    >
        是否确认删除文档 {props.docKey.title}?
        <br />
        {!props.recycleBin && <span>删除后，可以在回收站找到该文档</span>}
        {props.recycleBin && <span>彻底删除后，此文档无法再恢复!</span>}
    </ActionModal>);
};

export default RemoveModal;