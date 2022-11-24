import React, { useState } from "react";
import type { MarkInfo } from '@/api/project_book_shelf';
import { Button, Empty } from "antd";
import s from './MarkList.module.less';
import { observer } from "mobx-react";
import moment from 'moment';
import { useStores } from "@/hooks";
import ShareModal from "./ShareModal";


interface MarkListProps {
    markList: MarkInfo[];
    onRemove: (markId: string) => void;
    onClick: (markId: string) => void;
}

const MarkList: React.FC<MarkListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [sendMarkId, setSendMarkId] = useState("");

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
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSendMarkId(mark.mark_id);
                            }}>分享给同事</Button>
                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onClick(mark.mark_id);
                            }}>查看</Button>
                            <Button type="link" danger
                                disabled={!(projectStore.isAdmin || mark.mark_user_id == userStore.userInfo.userId)}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onRemove(mark.mark_id);
                                }}>删除标注</Button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        {sendMarkId != "" && <ShareModal mark={props.markList.find(item => item.mark_id = sendMarkId)} onClose={() => setSendMarkId("")} />}
    </div>)
};

export default observer(MarkList);