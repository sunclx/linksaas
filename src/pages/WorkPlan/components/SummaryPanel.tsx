import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { SUMMARY_STATE, SummaryItemInfo } from "@/api/project_sprit";
import { Card, Checkbox, Form, Input, List, Modal, Popover, Radio, Select, Space } from "antd";
import { SUMMARY_COLLECT, SUMMARY_SHOW, set_summary_state, list_summary_item, add_summary_item, remove_summary_item, update_summary_item, group_summary_item } from "@/api/project_sprit";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import Button from "@/components/Button";
import type { TagInfo } from "@/api/project";
import { list_tag, TAG_SCOPRE_SPRIT_SUMMARY } from "@/api/project";
import { CheckOutlined, CloseOutlined, EditOutlined, ExportOutlined, LeftOutlined, MoreOutlined, RightOutlined } from "@ant-design/icons";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { PROJECT_SETTING_TAB } from "@/utils/constant";

interface SummaryGroup {
    groupId: string;
    timeStamp: number; //组内最早时间
    summaryList: SummaryItemInfo[];
    checked: boolean;
}

interface AddModalProps {
    tagDefList: TagInfo[];
    onCancel: () => void;
    onCreate: () => void;
}

const AddModal: React.FC<AddModalProps> = observer((props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');

    const [tagId, setTagId] = useState("");
    const [content, setContent] = useState("");

    const addSummaryItem = async () => {
        await request(add_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sprit_id: spritStore.curSpritId,
            tag_id: tagId,
            content: content,
        }));
        props.onCreate();
    };

    return (
        <Modal title="增加建议" open okText="增加" okButtonProps={{ disabled: content.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addSummaryItem();
            }}>
            <Form>
                {props.tagDefList.length > 0 && (
                    <Form.Item label="建议类型">
                        <Select value={tagId} onChange={value => setTagId(value ?? "")} allowClear>
                            {props.tagDefList.map(tagDef => (
                                <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                                    <span style={{ padding: "4px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item label="建议内容">
                    <Input.TextArea value={content} autoSize={{ minRows: 5, maxRows: 5 }}
                        onChange={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setContent(e.target.value);
                        }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});

interface SummaryCardProps {
    tagDefList: TagInfo[];
    summaryItem: SummaryItemInfo;
    onChange: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = observer((props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');

    const [inEdit, setInEdit] = useState(false);
    const [tagId, setTagId] = useState(props.summaryItem.tag_info.tag_id);
    const [content, setContent] = useState(props.summaryItem.content);
    const [hasChange, setHasChange] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const removeSummaryItem = async () => {
        await request(remove_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            summary_item_id: props.summaryItem.summary_item_id,
            sprit_id: spritStore.curSpritId,
        }));
        props.onChange();
    };

    const updateSummaryItem = async () => {
        await request(update_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            summary_item_id: props.summaryItem.summary_item_id,
            sprit_id: spritStore.curSpritId,
            tag_id: tagId,
            content: content,
        }));
        setInEdit(false);
        setHasChange(false);
        props.onChange();
    };

    return (
        <Card bodyStyle={{ height: "200px", overflowY: "scroll" }}
            style={{
                width: "200px", border: showRemoveModal ? "2px solid red" : undefined,
                backgroundColor: inEdit ? "white" : (props.summaryItem.tag_info.bg_color == "" ? "snow" : props.summaryItem.tag_info.bg_color)
            }}
            headStyle={{ border: "none" }}
            title={props.summaryItem.tag_info.tag_name} extra={
                <Space size="middle">
                    {inEdit == false && (
                        <>
                            <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setInEdit(true);
                                }}><EditOutlined /></Button>
                            <Popover trigger="click" placement="bottom" content={
                                <div style={{ padding: "10px 10px" }}>
                                    <Button type="link" danger onClick={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowRemoveModal(true);
                                    }}>删除建议</Button>
                                </div>
                            }>
                                <MoreOutlined />
                            </Popover>
                        </>
                    )}
                    {inEdit == true && (
                        <>
                            <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setInEdit(false);
                                setHasChange(false);
                                setContent(props.summaryItem.content);
                                setTagId(props.summaryItem.tag_info.tag_id);
                            }}><CloseOutlined /></Button>
                            <Button type="link" style={{ minWidth: 0, padding: "0px 0px" }} disabled={!hasChange} onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                updateSummaryItem();
                            }}><CheckOutlined /></Button>
                        </>
                    )}
                </Space>
            }>
            {inEdit == false && (
                <pre style={{ wordBreak: "break-all", fontSize: "24px", whiteSpace: "pre-line" }}>
                    {content}
                </pre>
            )}
            {inEdit == true && (
                <Form>
                    {props.tagDefList.length > 0 && (
                        <Form.Item label="建议类型">
                            <Select value={tagId} onChange={value => {
                                setTagId(value ?? "");
                                setHasChange(true);
                            }} allowClear>
                                {props.tagDefList.map(tagDef => (
                                    <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                                        <span style={{ padding: "4px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item >
                        <Input.TextArea value={content} autoSize={{ minRows: 5, maxRows: 5 }}
                            onChange={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setContent(e.target.value);
                                setHasChange(true);
                            }} />
                    </Form.Item>
                </Form>
            )}
            {showRemoveModal == true && (
                <Modal title="删除建议" open
                    okText="删除" okButtonProps={{ danger: true }}
                    onCancel={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowRemoveModal(false);
                    }}
                    onOk={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeSummaryItem();
                    }}>
                    是否删除建议?
                </Modal>
            )}
        </Card>
    );
});

interface GroupCardProps {
    groupItem: SummaryGroup;
    onChange: () => void;
    onSelect: (groupId: string, selected: boolean) => void;
}

const GroupCard: React.FC<GroupCardProps> = observer((props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');

    const [curSummaryIndex, setCurSummaryIndex] = useState(0);
    const [bgColor, setBgColor] = useState(props.groupItem.summaryList[0].tag_info.bg_color);

    const splitSummary = async () => {
        await request(group_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sprit_id: spritStore.curSpritId,
            summary_item_id_list: [props.groupItem.summaryList[curSummaryIndex].summary_item_id],
        }));
        setCurSummaryIndex(0);
        setBgColor(props.groupItem.summaryList[0].tag_info.bg_color);
        props.onChange();
    };

    useEffect(() => {
        setCurSummaryIndex(0);
        setBgColor(props.groupItem.summaryList[0].tag_info.bg_color);
    }, [props.groupItem.summaryList[0].tag_info.bg_color]);

    return (
        <Card
            title={<Checkbox value={props.groupItem.checked} onChange={e => {
                e.stopPropagation();
                props.onSelect(props.groupItem.groupId, e.target.checked);
            }} />}
            headStyle={{ overflow: "hidden" }}
            bodyStyle={{ height: "200px", overflowY: "scroll", backgroundColor: bgColor == "" ? "snow" : bgColor }}
            style={{
                width: "200px",
            }}
            extra={
                <Space size="middle">
                    {props.groupItem.summaryList.length > 1 && (
                        <Space>
                            <Button type="link" disabled={curSummaryIndex <= 0} style={{ minWidth: "0px", padding: "0px 0px", height: "20px" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const newIndex = curSummaryIndex - 1;
                                    setCurSummaryIndex(newIndex);
                                    setBgColor(props.groupItem.summaryList[newIndex].tag_info.bg_color);
                                }}>
                                <LeftOutlined />
                            </Button>
                            <span>{curSummaryIndex + 1}/{props.groupItem.summaryList.length}</span>
                            <Button type="link" disabled={curSummaryIndex >= (props.groupItem.summaryList.length - 1)} style={{ minWidth: "0px", padding: "0px 0px", height: "20px" }}
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const newIndex = curSummaryIndex + 1;
                                    setCurSummaryIndex(newIndex);
                                    setBgColor(props.groupItem.summaryList[newIndex].tag_info.bg_color);
                                }}>
                                <RightOutlined />
                            </Button>
                        </Space>
                    )}
                </Space>
            }>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <UserPhoto logoUri={props.groupItem.summaryList[curSummaryIndex].create_logo_uri} style={{ width: "20px", borderRadius: "10px", marginRight: "10px" }} />
                <h3 style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1, margin: "0px 0px" }}>
                    {props.groupItem.summaryList[curSummaryIndex].create_display_name}
                </h3>
                {props.groupItem.summaryList.length > 1 && (
                    <Button type="text" style={{ minWidth: "0px", padding: "0px 0px", height: "20px", fontSize: "14px", marginBottom: "6px" }} title="拆分当前建议"
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            splitSummary();
                        }}><ExportOutlined /></Button>
                )}
            </div>
            <pre style={{ wordBreak: "break-all", fontSize: "24px", whiteSpace: "pre-line" }}>
                {props.groupItem.summaryList[curSummaryIndex].content}
            </pre>
        </Card>
    );
});

interface SummaryPanelProps {
    state: SUMMARY_STATE;
}

const SummaryPanel: React.FC<SummaryPanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const spritStore = useStores('spritStore');

    const [groupList, setGroupList] = useState<SummaryGroup[]>([]);
    const [summaryList, setSummaryList] = useState<SummaryItemInfo[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [tagDefList, setTagDefList] = useState<TagInfo[]>([]);
    const [filterTagId, setFilterTagId] = useState<string | null>(null);


    const setSummaryState = async (state: SUMMARY_STATE) => {
        await request(set_summary_state({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sprit_id: spritStore.curSpritId,
            summary_state: state,
        }));
        spritStore.incCurSpritVersion();
    };

    const loadSummaryAndGroup = async () => {
        const res = await request(list_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sprit_id: spritStore.curSpritId,
            filter_by_tag_id: filterTagId != null,
            tag_id: filterTagId ?? "",
        }));
        let tmpGroupList: SummaryGroup[] = [];
        for (const item of res.item_list) {
            const groupIndex = tmpGroupList.findIndex(g => g.groupId == item.group_id);
            if (groupIndex == -1) {
                tmpGroupList.push({
                    groupId: item.group_id,
                    timeStamp: item.create_time,
                    summaryList: [item],
                    checked: false,
                });
            } else {
                tmpGroupList[groupIndex].summaryList.push(item);
            }
        }
        tmpGroupList = tmpGroupList.sort((a, b) => {
            if (a.summaryList.length == b.summaryList.length) {
                return a.timeStamp - b.timeStamp;
            } else {
                return b.summaryList.length - a.summaryList.length;
            }
        });
        setSummaryList(res.item_list);
        setGroupList(tmpGroupList);
    };

    const mergeGroup = async () => {
        const tmpList = groupList.filter(g => g.checked);
        if (tmpList.length < 2) {
            return;
        }
        const summaryItemIdList = [] as string[];
        for (const g of tmpList) {
            for (const item of g.summaryList) {
                summaryItemIdList.push(item.summary_item_id);
            }
        }
        await request(group_summary_item({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            sprit_id: spritStore.curSpritId,
            summary_item_id_list: summaryItemIdList,
        }));
        await loadSummaryAndGroup();
    };

    const loadTagList = async () => {
        const res = await request(list_tag({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tag_scope_type: TAG_SCOPRE_SPRIT_SUMMARY,
        }));
        setTagDefList(res.tag_info_list);
    };

    useEffect(() => {
        loadSummaryAndGroup();
    }, [filterTagId]);

    useEffect(() => {
        loadTagList();
    }, [projectStore.curProjectId, projectStore.curProject?.tag_version]);

    return (
        <Card title={
            <Space>
                <Radio.Group options={[
                    {
                        label: "收集阶段",
                        value: SUMMARY_COLLECT,
                    },
                    {
                        label: "总结阶段",
                        value: SUMMARY_SHOW,
                    }
                ]} value={props.state} optionType="button" buttonStyle="solid" disabled={!projectStore.isAdmin}
                    onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSummaryState(e.target.value);
                    }} />
                {props.state == SUMMARY_SHOW && (
                    <span>总结阶段，不能再提交和修改建议。</span>
                )}
            </Space>
        } bordered={false} extra={
            <Space size="middle">
                {tagDefList.length > 0 && (
                    <Select placeholder="标签:" style={{ width: "100px" }} value={filterTagId} allowClear onChange={value => setFilterTagId(value ?? null)}>
                        <Select.Option value="">空标签</Select.Option>
                        {tagDefList.map(tagDef => (
                            <Select.Option key={tagDef.tag_id} value={tagDef.tag_id}>
                                <span style={{ padding: "4px 4px", backgroundColor: tagDef.bg_color }}>{tagDef.tag_name}</span>
                            </Select.Option>
                        ))}
                    </Select>
                )}
                {props.state == SUMMARY_COLLECT && (
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowAddModal(true);
                    }}>新增建议</Button>
                )}
                {props.state == SUMMARY_SHOW && (
                    <Button disabled={groupList.filter(g => g.checked).length < 2} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        mergeGroup();
                    }}>合并建议</Button>
                )}
                <Popover trigger="click" placement="bottom" content={
                    <div style={{ padding: "10px 10px" }}>
                        <Button type="link" disabled={!projectStore.isAdmin} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            projectStore.showProjectSetting = PROJECT_SETTING_TAB.PROJECT_SETTING_TAGLIST;
                        }}>管理标签</Button>
                    </div>
                }>
                    <MoreOutlined />
                </Popover>
            </Space>
        }>
            {props.state == SUMMARY_COLLECT && (
                <List rowKey="summary_item_id" grid={{ gutter: 16 }} dataSource={summaryList} renderItem={summaryItem => (
                    <List.Item>
                        <SummaryCard tagDefList={tagDefList} summaryItem={summaryItem} onChange={() => loadSummaryAndGroup()} />
                    </List.Item>
                )} />
            )}
            {props.state == SUMMARY_SHOW && (
                <List rowKey="groupId" grid={{ gutter: 16 }} dataSource={groupList} renderItem={groupItem => (
                    <List.Item>
                        <GroupCard groupItem={groupItem} onChange={() => loadSummaryAndGroup()}
                            onSelect={(groupId: string, selected: boolean) => {
                                const tmpList = groupList.slice();
                                const index = tmpList.findIndex(g => g.groupId == groupId);
                                if (index != -1) {
                                    tmpList[index].checked = selected;
                                }
                                setGroupList(tmpList);
                            }} />
                    </List.Item>
                )} />
            )}
            {showAddModal == true && (
                <AddModal tagDefList={tagDefList}
                    onCancel={() => setShowAddModal(false)}
                    onCreate={() => {
                        loadSummaryAndGroup();
                        setShowAddModal(false);
                    }} />
            )}
        </Card>
    );
};

export default observer(SummaryPanel);