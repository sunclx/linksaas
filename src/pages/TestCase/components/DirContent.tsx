import { useStores } from "@/hooks";
import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { Entry } from '@/api/project_test_case';
import { ENTRY_TYPE_DIR, ENTRY_TYPE_TC, list_entry, update_entry_title } from '@/api/project_test_case';
import type { ColumnsType } from 'antd/lib/table';
import Button from "@/components/Button";
import { useHistory } from "react-router-dom";
import Table from "antd/lib/table";
import { request } from "@/utils/request";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { EditText } from "@/components/EditCell/EditText";
import { Space } from "antd";
import moment from 'moment';

interface DirContentProps {
    entryId: string;
    childCount: number;
}

const DirContent: React.FC<DirContentProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const linkAuxStore = useStores('linkAuxStore');

    const history = useHistory();

    const [entryList, setEntryList] = useState<Entry[]>([]);

    const loadEntryList = async () => {
        const res = await request(list_entry({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            entry_id: props.entryId,
        }));
        setEntryList(res.entry_list);
    };

    useEffect(() => {
        loadEntryList();
    }, [props.childCount, props.entryId])

    const columns: ColumnsType<Entry> = [
        {
            title: "名称",
            width: 300,
            render: (_, record: Entry) => (
                <Space>
                    {record.entry_type == ENTRY_TYPE_DIR ? <FolderOutlined /> : <FileOutlined />}
                    {record.entry_type == ENTRY_TYPE_TC && <span>TC-{record.test_case_index}</span>}
                    <EditText editable={true} content={record.title} onChange={async (content: string) => {
                        try {
                            const res = await update_entry_title({
                                session_id: userStore.sessionId,
                                project_id: projectStore.curProjectId,
                                entry_id: record.entry_id,
                                title: content,
                            });
                            if (res.code == 0) {
                                return true;
                            }
                        } catch (e) {
                            console.log(e);
                            return false;
                        }
                        return false;
                    }} showEditIcon={true} />
                </Space>
            ),
        },
        {
            title: "操作",
            width: 100,
            render: (_, record: Entry) => (
                <Button type="link"
                    style={{ minWidth: "10px", padding: "0px 0px" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        linkAuxStore.goToTestCaseList({ entryId: record.entry_id }, history);
                    }}>
                    查看{record.entry_type == ENTRY_TYPE_DIR ? "目录" : "用例"}
                </Button>
            ),
        },
        {
            title: "创建人",
            dataIndex: "create_display_name"
        },
        {
            title: "创建时间",
            render: (_, record: Entry) => <span>{moment(record.create_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
        {
            title: "最后更新人",
            dataIndex: "update_display_name",
        },
        {
            title: "最后更新时间",
            render: (_, record: Entry) => <span>{moment(record.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        },
    ]

    return (
        <Table rowKey="entry_id" columns={columns} dataSource={entryList} pagination={false} />
    );
};

export default observer(DirContent);