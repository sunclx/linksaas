import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import * as prjDocApi from "@/api/project_doc";
import { request } from '@/utils/request';
import { Pagination, Card, Table, Form, Switch, Button } from 'antd';
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from 'moment';
import s from './DocList.module.less';



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
            const res = await request(prjDocApi.list_doc_key({
                session_id: userStore.sessionId,
                project_id: projectStore.curProjectId,
                filter_by_doc_space_id: docSpaceStore.curDocSpaceId != "",
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

    const getSpaceName = () => {
        if (docSpaceStore.recycleBin) {
            return (<h1 className={s.header}><DeleteOutlined /> 文档回收站</h1>);
        } else {
            if (docSpaceStore.curDocSpaceId != "") {
                return (<h1 className={s.header}><FileTextOutlined /> {docSpaceStore.curDocSpace?.base_info.title ?? ""}</h1>);
            } else {
                return (<h1 className={s.header}><FileTextOutlined /> 全部文档</h1>);
            }
        }
    };

    const columns: ColumnsType<prjDocApi.DocKey> = [
        {
            title: "文档标题",
            dataIndex: "title",
            width: 300,
            render: (_, record: prjDocApi.DocKey) => (
                <div className={s.docTitle}>
                    {!docSpaceStore.recycleBin && <span className={record.my_watch ? s.isCollect : s.no_Collect} />}
                    <a onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        docSpaceStore.showDoc(record.doc_id, false);
                    }}>{record.title}</a>
                </div>
            ),
        },
        {
            title: "创建于",
            render: (_, record: prjDocApi.DocKey) => (<>
                <UserPhoto logoUri={record.create_logo_uri} width="24px" height="24px" style={{ marginRight: "10px" }} />
                {record.create_display_name}&nbsp;&nbsp;{moment(record.create_time).format("YYYY-MM-DD HH:mm")}
            </>),
        },
        {
            title: "最后修改",
            render: (_, record: prjDocApi.DocKey) => (<>
                <UserPhoto logoUri={record.update_logo_uri} width="24px" height="24px" style={{ marginRight: "10px" }} />
                {record.update_display_name}&nbsp;&nbsp;{moment(record.update_time).format("YYYY-MM-DD HH:mm")}
            </>),
        },
    ]

    const genExtra = () => (
        <>
            {!docSpaceStore.recycleBin &&
                (<Form layout="inline">
                    <Form.Item label="只看我的关注">
                        <Switch onChange={checked => {
                            if (checked) {
                                setListParam({
                                    filter_by_tag: false,
                                    tag_list: [],
                                    filter_by_watch: true,
                                    watch: true,
                                });
                            } else {
                                setListParam({
                                    filter_by_tag: false,
                                    tag_list: [],
                                    filter_by_watch: false,
                                    watch: false,
                                });
                            }
                        }} />
                    </Form.Item>
                    <Button type="primary" style={{ height: "30px" }} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        docSpaceStore.showDoc("", true);
                    }}>新建文档</Button>
                </Form>)}
        </>
    );

    useEffect(() => {
        loadDocKey();
    }, [projectStore.curProjectId, docSpaceStore.curDocSpaceId, docSpaceStore.recycleBin, listParam]);

    return (
        <Card
            title={getSpaceName()}
            bordered={false}
            extra={genExtra()}
        >
            <div className={s.contentWrap}>
                <Table dataSource={docKeyList} columns={columns} pagination={false} rowKey="doc_id"/>
                {docCount > PAGE_SIZE && (<div className={s.pagingWrap}>
                    <div className={s.paging} >
                        <Pagination current={curPage + 1} total={docCount} pageSize={PAGE_SIZE}
                            onChange={(p: number) => setCurPage(p - 1)} />
                    </div>
                </div>)}
            </div>
        </Card>
    );

}

export default observer(DocList);