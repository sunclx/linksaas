import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { useStores } from "@/hooks";
import * as prjDocApi from "@/api/project_doc";
import { request } from '@/utils/request';
import { Pagination, Card, Table, Form, Switch, message, Select } from 'antd';
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import UserPhoto from "@/components/Portrait/UserPhoto";
import moment from 'moment';
import s from './DocList.module.less';
import Button from "@/components/Button";
import type { TagInfo } from "@/api/project";
import { TAG_SCOPRE_DOC, list_tag } from "@/api/project";
import { EditTag } from "@/components/EditCell/EditTag";


const PAGE_SIZE = 10;

const DocList = () => {
    const docSpaceStore = useStores("docSpaceStore");
    const userStore = useStores('userStore');
    const projectStore = useStores("projectStore");

    const [curPage, setCurPage] = useState(0);
    const [docCount, setDocCount] = useState(0);
    const [docKeyList, setDocKeyList] = useState<prjDocApi.DocKey[]>([]);
    const [tagDefList, setTagDefList] = useState<TagInfo[]>([]);
    const [filterTagId, setFilterTagId] = useState("");
    const [filterWatch, setFilterWatch] = useState(false);

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
                list_param: {
                    filter_by_watch: filterWatch,
                    watch: filterWatch,
                    filter_by_tag_id: filterTagId != "",
                    tag_id_list: filterTagId == "" ? [] : [filterTagId],
                },
                offset: curPage * PAGE_SIZE,
                limit: PAGE_SIZE,
            }));
            if (res) {
                setDocCount(res.total_count);
                setDocKeyList(res.doc_key_list);
            }
        }
    };

    const loadTagDefList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_DOC,
        }));
        setTagDefList(res.tag_info_list);
    }

    const unWatchDoc = async (docSpaceId: string, docId: string) => {
        await request(prjDocApi.un_watch_doc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            doc_space_id: docSpaceId,
            doc_id: docId,
        }));
        const tmpList = docKeyList.slice();
        const index = tmpList.findIndex(item => item.doc_id == docId);
        if (index != -1) {
            tmpList[index].my_watch = false;
            setDocKeyList(tmpList);
        }
        await docSpaceStore.loadCurWatchDocList(projectStore.curProjectId);
    }

    const watchDoc = async (docSpaceId: string, docId: string) => {
        await request(prjDocApi.watch_doc({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            doc_space_id: docSpaceId,
            doc_id: docId,
        }));
        const tmpList = docKeyList.slice();
        const index = tmpList.findIndex(item => item.doc_id == docId);
        if (index != -1) {
            tmpList[index].my_watch = true;
            setDocKeyList(tmpList);
        }
        await docSpaceStore.loadCurWatchDocList(projectStore.curProjectId);
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

    const updateTag = async (docSpaceId: string, docId: string, tagIdList: string[]) => {
        await request(prjDocApi.update_tag_id_list({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            doc_space_id: docSpaceId,
            doc_id: docId,
            tag_id_list: tagIdList,
        }));
        const tmpList = docKeyList.slice();
        const index = tmpList.findIndex(item => item.doc_id == docId);
        if (index != -1) {
            tmpList[index].tag_info_list = tagDefList.filter(tagDef => tagIdList.includes(tagDef.tag_id)).map(item => (
                {
                    tag_id: item.tag_id,
                    tag_name: item.tag_name,
                    bg_color: item.bg_color,
                }
            ));
            setDocKeyList(tmpList);
            message.info("更新标签成功");
        }
    }

    const columns: ColumnsType<prjDocApi.DocKey> = [
        {
            title: "",
            width: 20,
            render: (_, record: prjDocApi.DocKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (record.my_watch) {
                        unWatchDoc(record.doc_space_id, record.doc_id);
                    } else {
                        watchDoc(record.doc_space_id, record.doc_id);
                    }
                }}>
                    {!docSpaceStore.recycleBin && <span className={record.my_watch ? s.isCollect : s.noCollect} />}
                </a>
            ),
        },
        {
            title: "文档标题",
            dataIndex: "title",
            width: 200,
            render: (_, record: prjDocApi.DocKey) => (
                <a onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    docSpaceStore.showDoc(record.doc_id, false);
                }}>{record.title}</a>
            ),
        },
        {
            title: "标签",
            width: 200,
            render: (_, record: prjDocApi.DocKey) => (
                <>
                    {tagDefList.length > 0 && (
                        <EditTag editable={projectStore.isAdmin} tagIdList={record.tag_info_list.map(tag => tag.tag_id)}
                            tagDefList={tagDefList} onChange={(tagIdList: string[]) => {
                                updateTag(record.doc_space_id, record.doc_id, tagIdList);
                            }} />
                    )}
                </>
            ),
        },
        {
            title: "最后修改",
            width: 200,
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
                    <Form.Item label="我的关注">
                        <Switch onChange={checked => {
                            setFilterWatch(checked);
                        }} />
                    </Form.Item>
                    {tagDefList.length > 0 && (
                        <Form.Item label="标签">
                            <Select style={{ width: "100px" }} value={filterTagId} onChange={value => setFilterTagId(value ?? "")} allowClear>
                                {tagDefList.map(tagDef => (
                                    <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                                        <span style={{ padding: "2px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

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
    }, [projectStore.curProjectId, docSpaceStore.curDocSpaceId, docSpaceStore.recycleBin, filterWatch, filterTagId]);

    useEffect(() => {
        loadTagDefList();
    }, [projectStore.curProjectId,projectStore.curProject?.tag_version]);

    return (
        <Card
            title={getSpaceName()}
            bordered={false}
            extra={genExtra()}
        >
            <div className={s.contentWrap}>
                <Table dataSource={docKeyList} columns={columns} pagination={false} rowKey="doc_id" />
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