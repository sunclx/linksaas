import React, { useEffect } from 'react';
import s from './EditDoc.module.less';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';


const DocTocPanel = () => {
    const editorStore = useStores('editorStore');

    useEffect(()=>{
        return ()=>{
            editorStore.tocList = [];
        };
    },[]);
    
    return (
        <div className={s.toc}>
            <h1>标题列表</h1>
            {editorStore.tocList.map((toc, index) => (
                <div key={index} title={toc.title} style={{ paddingLeft: 20 * toc.level, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        toc.scrollView();
                    }}>{toc.title}</a>
                </div>
            ))}
        </div>
    );
};

export default observer(DocTocPanel);