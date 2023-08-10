import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_session } from "@/api/user";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import * as dataAnnoTaskApi from "@/api/data_anno_task";
import { request } from "@/utils/request";
import { Form, Select, Tabs } from "antd";
import s from "./DataAnnoDetail.module.less";
import ResourcePanel from "./components/ResourcePanel";
import Button from "@/components/Button";
import MemberPanel from "./components/MemberPanel";
import AnnoPanel from "./components/AnnoPanel";
import SettingPanel from "./components/SettingPanel";

const DataAnnoDetail = () => {
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") ?? "";
    const annoProjectId = urlParams.get("annoProjectId") ?? "";
    const adminStr = urlParams.get("admin") ?? "false";
    const fsId = urlParams.get("fsId") ?? "";

    const [annoProjectInfo, setAnnoProjectInfo] = useState<dataAnnoPrjApi.AnnoProjectInfo | null>(null);
    const [activeKey, setActiveKey] = useState("");

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showAddResourceModal, setShowAddResourceModal] = useState(false);

    const [auditMemberUserId, setAuditMemberUserId] = useState("");
    const [memberInfoList, setMemberInfoList] = useState<dataAnnoTaskApi.MemberInfo[]>([]);

    const loadAnnoProjectInfo = async () => {
        const sessionId = await get_session();
        const res = await request(dataAnnoPrjApi.get({
            session_id: sessionId,
            project_id: projectId,
            anno_project_id: annoProjectId,
        }));
        setAnnoProjectInfo(res.info);
    };

    const adjustActiveKey = () => {
        if (annoProjectInfo == null) {
            return;
        }
        const validKeyList = [];
        if (annoProjectInfo.my_task_count - annoProjectInfo.my_done_count > 0) {
            validKeyList.push("myTodo");
        }
        if (annoProjectInfo.my_done_count > 0) {
            validKeyList.push("myDone");
        }
        if (adminStr == "true") {
            validKeyList.push("adminMember");
            validKeyList.push("adminResource");
            validKeyList.push("setting");
        }
        if (validKeyList.includes(activeKey)) {
            return;
        }
        if (validKeyList.length > 0) {
            setActiveKey(validKeyList[0]);
        }
    };

    const loadMemberList = async () => {
        const sessionId = await get_session();
        const res = await request(dataAnnoTaskApi.list_member({
            session_id: sessionId,
            project_id: projectId,
            anno_project_id: annoProjectId,
        }));
        const tmpList = res.info_list.filter(item => item.done_count > 0);
        setMemberInfoList(tmpList);
        if (tmpList.length > 0) {
            setAuditMemberUserId(tmpList[0].member_user_id);
        }
    };

    useEffect(() => {
        loadAnnoProjectInfo();
    }, []);

    useEffect(() => {
        adjustActiveKey();
    }, [annoProjectInfo]);

    return (
        <div style={{ backgroundColor: "white" }}>
            {annoProjectInfo != null && (
                <Tabs type="card" activeKey={activeKey} onChange={key => {
                    setActiveKey(key);
                    setMemberInfoList([]);
                    setAuditMemberUserId("");
                    if (key == "audit") {
                        loadMemberList();
                    }
                }}
                    tabBarStyle={{ height: "50px" }} tabBarExtraContent={
                        <div style={{ marginRight: "20px" }}>
                            {activeKey == "adminMember" && (
                                <Button onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowAddMemberModal(true);
                                }}>增加标注成员</Button>
                            )}
                            {activeKey == "adminResource" && (
                                <Button onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowAddResourceModal(true);
                                }}>增加标注资源</Button>
                            )}
                            {activeKey == "audit" && (
                                <Form style={{ paddingTop: "10px" }}>
                                    <Form.Item label="标注成员">
                                        <Select style={{ width: "150px" }} value={auditMemberUserId} onChange={value => setAuditMemberUserId(value)}>
                                            {memberInfoList.map(item => (
                                                <Select.Option key={item.member_user_id} value={item.member_user_id}>{item.display_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            )}
                        </div>
                    }>
                    {(annoProjectInfo.my_task_count - annoProjectInfo.my_done_count > 0) && (
                        <Tabs.TabPane tab={`未完成标注(${annoProjectInfo.my_task_count - annoProjectInfo.my_done_count})`} key="myTodo">
                            <div className={s.panel_wrap}>
                                {activeKey == "myTodo" && (
                                    <AnnoPanel projectId={projectId} annoProjectId={annoProjectId} fsId={fsId}
                                        annoType={annoProjectInfo.base_info.anno_type} predictUrl={annoProjectInfo.base_info.predict_url}
                                        config={annoProjectInfo.base_info.config} done={false}
                                        onChange={() => loadAnnoProjectInfo()} />
                                )}
                            </div>
                        </Tabs.TabPane>
                    )}
                    {annoProjectInfo.my_done_count > 0 && (
                        <Tabs.TabPane tab={`已完成标注(${annoProjectInfo.my_done_count})`} key="myDone">
                            <div className={s.panel_wrap}>
                                {activeKey == "myDone" && (
                                    <AnnoPanel projectId={projectId} annoProjectId={annoProjectId} fsId={fsId}
                                        annoType={annoProjectInfo.base_info.anno_type} predictUrl={annoProjectInfo.base_info.predict_url}
                                        config={annoProjectInfo.base_info.config} done={true}
                                        onChange={() => loadAnnoProjectInfo()} />
                                )}
                            </div>
                        </Tabs.TabPane>
                    )}
                    {adminStr == "true" && (
                        <>
                            {annoProjectInfo.done_task_count > 0 && (<Tabs.TabPane tab={`审核`} key="audit">
                                <div className={s.panel_wrap}>
                                    {activeKey == "audit" && auditMemberUserId != "" && (
                                        <AnnoPanel projectId={projectId} annoProjectId={annoProjectId} fsId={fsId}
                                            annoType={annoProjectInfo.base_info.anno_type} predictUrl={annoProjectInfo.base_info.predict_url}
                                            config={annoProjectInfo.base_info.config} done={true}
                                            memberUserId={auditMemberUserId}
                                            onChange={() => loadAnnoProjectInfo()} />
                                    )}
                                </div>
                            </Tabs.TabPane>)}
                            <Tabs.TabPane tab={`成员管理(${annoProjectInfo.member_count})`} key="adminMember">
                                <div className={s.panel_wrap}>
                                    {activeKey == "adminMember" && (
                                        <MemberPanel projectId={projectId} annoProjectId={annoProjectId}
                                            showAddModal={showAddMemberModal} resourceCount={annoProjectInfo.resource_count}
                                            onChange={memberCount => {
                                                if (annoProjectInfo.member_count != memberCount) {
                                                    setAnnoProjectInfo({ ...annoProjectInfo, member_count: memberCount });
                                                }
                                                setShowAddMemberModal(false);
                                            }} onCancelAdd={() => setShowAddMemberModal(false)}
                                            onSetTask={() => loadAnnoProjectInfo()}
                                            onRemove={() => loadAnnoProjectInfo()} />
                                    )}
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={`资源管理(${annoProjectInfo.resource_count})`} key="adminResource">
                                <div className={s.panel_wrap}>
                                    {activeKey == "adminResource" && (
                                        <ResourcePanel projectId={projectId} annoProjectId={annoProjectId} fsId={fsId}
                                            annoType={annoProjectInfo.base_info.anno_type} showAddModal={showAddResourceModal}
                                            onChange={resourceCount => {
                                                if (annoProjectInfo.resource_count != resourceCount) {
                                                    setAnnoProjectInfo({ ...annoProjectInfo, resource_count: resourceCount });
                                                }
                                                setShowAddResourceModal(false);
                                            }} onCancelAdd={() => setShowAddResourceModal(false)}
                                            onRemove={() => loadAnnoProjectInfo()} />
                                    )}
                                </div>
                            </Tabs.TabPane>
                        </>
                    )}
                    <Tabs.TabPane tab="标注设置" key="setting">
                        <div className={s.panel_wrap}>
                            {activeKey == "setting" && (
                                <SettingPanel projectId={projectId} annoProjectInfo={annoProjectInfo} admin={adminStr == "true"}
                                    onChange={() => loadAnnoProjectInfo()} />
                            )}
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            )}

        </div>
    );
};

export default DataAnnoDetail;