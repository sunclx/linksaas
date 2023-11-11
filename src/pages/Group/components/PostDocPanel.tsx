import React, { useEffect, useState } from 'react';
import type { TocInfo } from '@/components/Editor/extensions/index';
import s from '../PostEdit.module.less';

interface PostTocPanelProps {
    tocList: TocInfo[];
}

const PostTocPanel: React.FC<PostTocPanelProps> = (props) => {
    const [tocList, setTocList] = useState<TocInfo[]>([]);

    useEffect(() => {
        setTocList([]);
        setTimeout(() => {
            setTocList(props.tocList);
        }, 100);
    }, [props.tocList]);

    return (
        <div className={s.toc}>
            {tocList.map((toc, index) => (
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

export default PostTocPanel;