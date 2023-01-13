import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { request } from "@/utils/request";
import type { ScriptHistoryKey } from "@/api/robot_script";
import { list_script_history_key } from "@/api/robot_script";
import { useStores } from "@/hooks";
import s from './ContentHistory.module.less';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from 'moment';
import Pagination from "@/components/Pagination";
import ContentDiff from "./ContentDiff";

const PAGE_SIZE = 10;

interface ContentHistoryProps {
    scriptSuiteId: string,
    onRecover: (content: string) => void;
}

const ContentHistory: React.FC<ContentHistoryProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [curPage, setCurPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [historyKeyList, setHistoryKeyList] = useState<ScriptHistoryKey[]>([]);
    const [diffCreateTime, setDiffCreateTime] = useState<number | null>(null);

    const loadHistoryKey = async () => {
        const res = await request(list_script_history_key({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            script_suite_id: props.scriptSuiteId,
            offset: PAGE_SIZE * curPage,
            limit: PAGE_SIZE,
        }));
        setTotalCount(res.total_count);
        setHistoryKeyList(res.history_key_list);
    };

    useEffect(() => {
        loadHistoryKey();
    }, [curPage])

    return (
        <div className={s.history_wrap}>
            <div className={s.title}>历史版本</div>
            <ul>
                {historyKeyList.map((item, index) => (
                    <li key={item.create_time}>
                        <div className={s.top}>
                            <UserPhoto logoUri={item.create_logo_uri} width="20px" height="20px" />
                            {item.create_display_name}
                        </div>
                        <div className={s.time}>{moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                        <div className={s.des}>更新了脚本内容</div>
                        {(index == 0 && curPage == 0) == false && (
                            <div
                                className={s.btn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setDiffCreateTime(item.create_time);
                                }}
                            >
                                查看
                            </div>
                        )}
                        {index == 0 && curPage == 0 && <div className={s.mostNew}>当前版本</div>}
                    </li>
                ))}
            </ul>
            <div className={s.paging}>
                <Pagination total={totalCount} pageSize={PAGE_SIZE} current={curPage + 1}
                    onChange={page => setCurPage(page + 1)} />
            </div>
            {diffCreateTime != null && (
                <ContentDiff
                    scriptSuiteId={props.scriptSuiteId}
                    diffCreateTime={diffCreateTime}
                    onCancel={() => setDiffCreateTime(null)}
                    onRecover={(content) => {
                        props.onRecover(content);
                        setDiffCreateTime(null);
                    }} />
            )}
        </div>
    );
};

export default observer(ContentHistory);