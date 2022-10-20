import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import * as prjDocApi from "@/api/project_doc";
import { request } from '@/utils/request';
import { Pagination } from 'antd';

const PAGE_SIZE = 20;

const DocList = () => {
    const docSpaceStore = useStores("docSpaceStore");
    const userStore = useStores('userStore');
    const projectStore = useStores("projectStore");

    const [curPage, setCurPage] = useState(0);
    const [docCount, setDocCount] = useState(0);
    const [docKeyList, setDocKeyList] = useState<prjDocApi.DocKey[]>([]);
    const [listParam, setListParam] = useState<prjDocApi.ListDocParam>({
        filter_by_tag: false,
        tag_list: [],
        filter_by_watch: false,
        watch: false,
    });


    const loadDocKey = async () => {
        if (docSpaceStore.recycleBin) {
            const res = await request(prjDocApi.list_doc_key_in_recycle({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                offset: curPage * PAGE_SIZE,
                limit: PAGE_SIZE,
            }));
            if (res) {
                setDocCount(res.total_count);
                setDocKeyList(res.doc_key_list);
            }
        } else {
            if (docSpaceStore.curDocSpaceId == "") {
                return;
            }
            const res = await request(prjDocApi.list_doc_key({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                filter_by_doc_space_id: true,
                doc_space_id: docSpaceStore.curDocSpaceId,
                list_param: listParam,
                offset: curPage * PAGE_SIZE,
                limit: PAGE_SIZE,
            }));
            if (res) {
                setDocCount(res.total_count);
                setDocKeyList(res.doc_key_list);
            }
        }
    };

    useEffect(() => {
        loadDocKey();
    }, [projectStore.curProjectId, docSpaceStore.curDocSpaceId, docSpaceStore.recycleBin]);

    return (<div>
        <div>
            {docSpaceStore.recycleBin && (<span>回收站</span>)}
            {!docSpaceStore.recycleBin && (<span>{docSpaceStore.curDocSpace?.base_info.title ?? ""}</span>)}
        </div>
        <ul>
            {docKeyList.map(docKey => (
                <li key={docKey.doc_id}>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log("555555555555555555", docKey);
                        docSpaceStore.showDoc(docKey.doc_id, false);
                    }}>{docKey.title}</a>
                </li>
            ))}
        </ul>
        <Pagination current={curPage + 1} total={docCount} pageSize={PAGE_SIZE}
            onChange={(p: number) => setCurPage(p - 1)} />
    </div>);
}

export default observer(DocList);