import React from "react";
import type { MarkInfo } from '@/api/project_book_shelf';
import { Button, Empty } from "antd";
import s from './MarkList.module.less';
import { observer } from "mobx-react";
import moment from 'moment';
import { useStores } from "@/hooks";


interface MarkListProps {
    markList: MarkInfo[];
    onRemove: (markId: string) => void;
    onClick: (markId: string) => void;
}

const MarkList: React.FC<MarkListProps> = (props) => {
    const projectStore = useStores('projectStore');
    
    return (<div className={s.mark_list_wrap}>
        {props.markList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <ul>
            {props.markList.map(mark => (
                <li key={mark.mark_id} className={s.mark}>
                    <div className={s.title}>
                        {mark.mark_display_name}&nbsp;&nbsp;{moment(mark.time_stamp).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div className={s.content}>{mark.mark_content}</div>

                    <div className={s.links_wrap}>
                        <div className={s.links}>
                                <Button type="link" onClick={e=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onClick(mark.mark_id);
                                }}>查看</Button>
                                <Button type="link" danger 
                                    disabled={!projectStore.isAdmin}
                                onClick={e=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onRemove(mark.mark_id);
                                }}>删除标注</Button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>)
};

export default observer(MarkList);