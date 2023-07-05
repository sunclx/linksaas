import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_session } from "@/api/user";
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import { request } from "@/utils/request";
import { Tabs } from "antd";
import s from "./DataAnnoDetail.module.less";
import ResourcePanel from "./components/ResourcePanel";
import Button from "@/components/Button";
import MemberPanel from "./components/MemberPanel";

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

    useEffect(() => {
        loadAnnoProjectInfo();
    }, []);

    useEffect(() => {
        adjustActiveKey();
    }, [annoProjectInfo]);

    return (
        <div style={{ backgroundColor: "white" }}>
            {annoProjectInfo != null && (
                <Tabs type="card" activeKey={activeKey} onChange={key => setActiveKey(key)}
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
                        </div>
                    }>
                    {(annoProjectInfo.my_task_count - annoProjectInfo.my_done_count > 0) && (
                        <Tabs.TabPane tab="未完成标注" key="myTodo">
                            <div className={s.panel_wrap}>xx</div>
                        </Tabs.TabPane>
                    )}
                    {annoProjectInfo.my_done_count > 0 && (
                        <Tabs.TabPane tab="已完成标注" key="myDone">
                            <div className={s.panel_wrap}>xx</div>
                        </Tabs.TabPane>
                    )}
                    {adminStr == "true" && (
                        <>
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
                                            annoType={annoProjectInfo.base_info.config.anno_type} showAddModal={showAddResourceModal}
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
                            <Tabs.TabPane tab="标注设置" key="setting">
                                <div className={s.panel_wrap}>xx</div>
                            </Tabs.TabPane>
                        </>
                    )}
                </Tabs>
            )}

        </div>
    );
};

export default DataAnnoDetail;