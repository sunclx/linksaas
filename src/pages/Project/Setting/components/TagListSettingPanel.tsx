import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { PanelProps } from "./common";
import { Button, Card, Checkbox, Input, Space, Table, message } from "antd";
import type { TagInfo } from "@/api/project";
import { TAG_SCOPRE_ALL, add_tag, list_tag, remove_tag, update_tag } from "@/api/project";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import type { ColumnsType } from 'antd/lib/table';
import { uniqId } from "@/utils/utils";
import moment from "moment";
import randomColor from 'randomcolor';


interface ExTagInfo {
    tag_id: string;
    info: TagInfo;
    hasUpdate: boolean;
    hasRemove: boolean;
}

const TagListSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [origTagList, setOrigTagList] = useState<TagInfo[]>([]);
    const [tagList, setTagList] = useState<ExTagInfo[]>([]);

    const [hasChange, setHasChange] = useState(false);

    const loadTagList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_ALL,
        }));
        setOrigTagList(res.tag_info_list);
        setTagList(res.tag_info_list.map(tag => (
            {
                tag_id: tag.tag_id,
                info: tag,
                hasUpdate: false,
                hasRemove: false,
            }
        )));
    };

    const resetConfig = () => {
        setTagList(origTagList.map(tag => (
            {
                tag_id: tag.tag_id,
                info: tag,
                hasUpdate: false,
                hasRemove: false,
            }
        )));
        setHasChange(false);
    };

    const updateConfig = async () => {
        for (const tagInfo of tagList.filter(tag => !tag.hasRemove).filter(tag => tag.hasUpdate)) {
            if (tagInfo.info.tag_name.trim() == "") {
                message.error("便签名称不能为空");
                return;
            }
        }
        //新增
        for (const tagInfo of tagList.filter(tag => !tag.hasRemove).filter(tag => tag.hasUpdate).filter(tag => tag.info.tag_id == "")) {
            try {
                await request(add_tag({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    tag_name: tagInfo.info.tag_name.trim(),
                    bg_color: tagInfo.info.bg_color,
                    use_in_doc: tagInfo.info.use_in_doc,
                    use_in_task: tagInfo.info.use_in_task,
                    use_in_bug: tagInfo.info.use_in_bug,
                    use_in_req: tagInfo.info.use_in_req,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        //修改
        for (const tagInfo of tagList.filter(tag => !tag.hasRemove).filter(tag => tag.hasUpdate).filter(tag => tag.info.tag_id != "")) {
            try {
                await request(update_tag({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    tag_id: tagInfo.info.tag_id,
                    tag_name: tagInfo.info.tag_name.trim(),
                    bg_color: tagInfo.info.bg_color,
                    use_in_doc: tagInfo.info.use_in_doc,
                    use_in_task: tagInfo.info.use_in_task,
                    use_in_bug: tagInfo.info.use_in_bug,
                    use_in_req: tagInfo.info.use_in_req,
                }));
            } catch (e) {
                console.log(e);
            }
        }
        //删除
        for (const tagInfo of tagList.filter(tag => tag.hasRemove).filter(tag => tag.info.tag_id != "")) {
            try {
                await request(remove_tag({
                    session_id: userStore.sessionId,
                    project_id: projectStore.curProjectId,
                    tag_id: tagInfo.info.tag_id,
                }))
            } catch (e) {
                console.log(e);
            }
        }
        await loadTagList();
        setHasChange(false);
        projectStore.incTagVersion(projectStore.curProjectId);
        message.info("保存成功");
    };

    const colums: ColumnsType<ExTagInfo> = [
        {
            title: "标签",
            width: 80,
            render: (_, row: ExTagInfo) => (
                <Input value={row.info.tag_name} onChange={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].info.tag_name = e.target.value;
                        tmpList[index].hasUpdate = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "背景色",
            width: 40,
            render: (_, row: ExTagInfo) => (
                <div style={{ width: "20px", backgroundColor: row.info.bg_color, cursor: "pointer" }}
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const tmpList = tagList.slice();
                        const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                        if (index != -1) {
                            tmpList[index].info.bg_color = randomColor({ luminosity: "light", format: "rgba", alpha: 0.8 });
                            tmpList[index].hasUpdate = true;
                            setTagList(tmpList);
                            setHasChange(true);
                        }
                    }}>&nbsp;</div>
            ),
        },
        {
            title: "文档",
            width: 20,
            render: (_, row: ExTagInfo) => (
                <Checkbox checked={row.info.use_in_doc} onChange={e => {
                    e.stopPropagation();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].info.use_in_doc = e.target.checked;
                        tmpList[index].hasUpdate = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "需求",
            width: 20,
            render: (_, row: ExTagInfo) => (
                <Checkbox checked={row.info.use_in_req} onChange={e => {
                    e.stopPropagation();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].info.use_in_req = e.target.checked;
                        tmpList[index].hasUpdate = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "任务",
            width: 20,
            render: (_, row: ExTagInfo) => (
                <Checkbox checked={row.info.use_in_task} onChange={e => {
                    e.stopPropagation();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].info.use_in_task = e.target.checked;
                        tmpList[index].hasUpdate = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "缺陷",
            width: 20,
            render: (_, row: ExTagInfo) => (
                <Checkbox checked={row.info.use_in_bug} onChange={e => {
                    e.stopPropagation();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].info.use_in_bug = e.target.checked;
                        tmpList[index].hasUpdate = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }} />
            ),
        },
        {
            title: "操作",
            width: 40,
            render: (_, row: ExTagInfo) => (
                <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} danger onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = tagList.slice();
                    const index = tmpList.findIndex(tag => tag.tag_id == row.tag_id);
                    if (index != -1) {
                        tmpList[index].hasRemove = true;
                        setTagList(tmpList);
                        setHasChange(true);
                    }
                }}>删除</Button>
            ),
        }
    ];

    useEffect(() => {
        loadTagList();
    }, []);

    useEffect(() => {
        props.onChange(hasChange);
    }, [hasChange]);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }} extra={
            <Space>
                <Button onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    const tmpList = tagList.slice();
                    tmpList.unshift({
                        tag_id: uniqId(),
                        info: {
                            tag_id: "",
                            tag_name: "",
                            create_time: moment().valueOf(),
                            bg_color: randomColor({ luminosity: "light", format: "rgba", alpha: 0.8 }),
                            use_in_doc: true,
                            use_in_task: true,
                            use_in_bug: true,
                            use_in_req: true,
                        },
                        hasUpdate: true,
                        hasRemove: false,
                    });
                    setTagList(tmpList);
                    setHasChange(true);
                }}>增加标签</Button>
                <Button disabled={!hasChange} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    resetConfig();
                }}>取消</Button>
                <Button type="primary" disabled={!hasChange} onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateConfig();
                }}>保存</Button>
            </Space>
        }>
            <Table rowKey="tag_id" dataSource={tagList.filter(tag => !tag.hasRemove)} columns={colums} />
        </Card>

    );
};

export default observer(TagListSettingPanel);