import React from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import s from './SwitchDocSpace.module.less';
import { move_doc } from '@/api/project_doc';
import { request } from '@/utils/request';
import { runInAction } from "mobx";
import { message } from 'antd';

const SwitchDocSpace: React.FC = () => {
    const userStore = useStores('userStore');
    const docSpaceStore = useStores('docSpaceStore');

    const moveTo = async (destDocSpaceId: string) => {
        const curDoc = docSpaceStore.curDoc;
        const res = await request(move_doc({
            session_id: userStore.sessionId,
            project_id: curDoc?.project_id ?? "",
            doc_space_id: curDoc?.doc_space_id ?? "",
            doc_id: curDoc?.doc_id ?? "",
            dest_doc_space_id: destDocSpaceId,
        }));
        if (res) {
            await docSpaceStore.updateDocSpace(docSpaceStore.curDoc!.doc_space_id);
            await docSpaceStore.updateDocSpace(destDocSpaceId);
            await docSpaceStore.loadCurWatchDocList(docSpaceStore.curDoc!.project_id);
            runInAction(() => {
                docSpaceStore.curDoc!.doc_space_id = destDocSpaceId;
                if(docSpaceStore.curDocSpaceId != ""){
                    docSpaceStore.curDocSpaceId = destDocSpaceId;
                }
            });
            message.info("移动文档成功");
            
        }
    };

    return (
        <div className={s.wrap}>
            <div className={s.title}>移动到</div>
            <ul>
                {docSpaceStore.docSpaceList.filter(docSpace => docSpace.doc_space_id != docSpaceStore.curDoc?.doc_space_id ?? "").map(docSpace => (
                    <li key={docSpace.doc_space_id}>
                        <span>{docSpace.base_info.title}</span>
                        <a onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            moveTo(docSpace.doc_space_id);
                        }}>移动</a>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default observer(SwitchDocSpace);