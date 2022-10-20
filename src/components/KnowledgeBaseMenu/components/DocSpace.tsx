import React, { useEffect } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";


const DocSpace = () => {
    const docSpaceStore = useStores('docSpaceStore');
    const projectStore = useStores('projectStore');

    useEffect(() => {
        docSpaceStore.loadDocSpace();
    }, [projectStore.curProjectId]);

    return <div>
        <ul>
            {docSpaceStore.docSpaceList.map(docSpace => (
                <li key={docSpace.doc_space_id}>
                    <div
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '85%',
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            docSpaceStore.showDocList(docSpace.doc_space_id, false);
                        }}
                    >
                        {docSpace.base_info.title}
                    </div>
                </li>
            ))}
        </ul>
    </div>;
};

export default observer(DocSpace);
