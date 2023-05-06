import React, { useState } from "react";
import type * as prjBookShelf from '@/api/project_book_shelf';
import type * as userBookShelf from '@/api/user_book_shelf';
import { Button, Empty } from "antd";
import s from './MarkList.module.less';
import { observer } from "mobx-react";
import moment from 'moment';
import ShareModal from "./ShareModal";

interface MarkListProps {
    projectId: string;
    userId: string;
    canShare: boolean;
    markList: prjBookShelf.MarkInfo[] | userBookShelf.MarkInfo[];
    onRemove: (markId: string) => void;
    onClick: (markId: string) => void;
}

const MarkList: React.FC<MarkListProps> = (props) => {

    const [sendMarkId, setSendMarkId] = useState("");

    return (<div className={s.mark_list_wrap}>
        {props.markList.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        <ul>
            {props.markList.map(mark => (
                <li key={mark.mark_id} className={s.mark}>
                    <div className={s.title}>
                        {props.projectId == "" ? "" : (mark as prjBookShelf.MarkInfo).mark_display_name}&nbsp;&nbsp;{moment(mark.time_stamp).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div className={s.content}>{mark.mark_content}</div>

                    <div className={s.links_wrap}>
                        <div className={s.links}>
                            {props.projectId != "" && (
                                <Button type="link"
                                    disabled={!props.canShare}
                                    onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSendMarkId(mark.mark_id);
                                    }}>分享给同事</Button>
                            )}

                            <Button type="link" onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onClick(mark.mark_id);
                            }}>查看</Button>
                            <Button type="link" danger
                                disabled={!(props.projectId == "" || (props.projectId != "" && (mark as prjBookShelf.MarkInfo).mark_user_id == props.userId))}
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
        {sendMarkId != "" && <ShareModal mark={props.markList.find(item => item.mark_id = sendMarkId) as prjBookShelf.MarkInfo | undefined} onClose={() => setSendMarkId("")} projectId={props.projectId} />}
    </div>)
};

export default observer(MarkList);