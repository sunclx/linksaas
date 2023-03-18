import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { AwardRecord, AWARD_RELATE_TYPE } from '@/api/project_award';
import { list_record, AWARD_RELATE_TASK, AWARD_RELATE_BUG } from '@/api/project_award';
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { useHistory } from "react-router-dom";
import { LinkTaskInfo, LinkBugInfo } from '@/stores/linkAux';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { Table } from "antd";

const PAGE_SIZE = 10;

interface AwardListProps {
    memberUserId: string;
}

const AwardList: React.FC<AwardListProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');
    const history = useHistory();

    const [recordList, setRecordList] = useState<AwardRecord[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [curPage, setCurPage] = useState(0);

    const loadRecord = async () => {
        const res = await request(list_record({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            member_user_id: props.memberUserId,
            offset: curPage * PAGE_SIZE,
            limit: PAGE_SIZE,
        }));
        if (res) {
            setRecordList(res.record_list);
            setTotalCount(res.total_count);
        }
    };

    const columns: ColumnsType<AwardRecord> = [
        {
            title: "时间",
            dataIndex: "time_stamp",
            width: 150,
            render: (t: number) => {
                return moment(t).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: "贡献类型",
            dataIndex: "relate_type",
            width: 100,
            render: (t: AWARD_RELATE_TYPE) => {
                if (t == AWARD_RELATE_TASK) {
                    return "完成任务贡献";
                } else if (t == AWARD_RELATE_BUG) {
                    return "修复缺陷贡献";
                }
                return ""
            }
        },
        {
            title: "贡献值",
            dataIndex: "point",
            width: 60,
        },
        {
            title: "贡献内容",
            render: (_, record: AwardRecord) => {
                if (record.relate_type == AWARD_RELATE_TASK) {
                    return (<a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(
                            new LinkTaskInfo('', projectStore.curProjectId, record.relate_id),
                            history,
                        );
                    }}>{record.title}</a>);
                } else if (record.relate_type == AWARD_RELATE_BUG) {
                    return (<a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToLink(
                            new LinkBugInfo('', projectStore.curProjectId, record.relate_id),
                            history,
                        );
                    }}>{record.title}</a>);
                }
                return ""
            },
        }
    ];

    useEffect(() => {
        loadRecord();
    }, [props.memberUserId, curPage, projectStore.curProjectId]);

    return (
        <Table
            rowKey={e => `${e.relate_id}${e.relate_type}`}
            style={{ marginLeft: "10px" }}
            dataSource={recordList}
            columns={columns}
            pagination={totalCount <= PAGE_SIZE ? false : {
                current: curPage + 1,
                total: totalCount,
                pageSize: PAGE_SIZE,
                onChange: pageNum => {
                    setCurPage(pageNum - 1);
                },
            }} />
    );
};

export default observer(AwardList);
