import React from "react";
import { Collapse, Descriptions, Modal, Table, Tabs } from "antd";
import type { EventAttr } from "./eventDesc";
import { eventGroupList } from "./eventDesc";
import type { ColumnsType } from 'antd/lib/table';
import s from "./EventDescModal.module.less";

interface EventDescModalProps {
    onCancel: () => void;
}

const EventDescModal: React.FC<EventDescModalProps> = (props) => {
    const columns: ColumnsType<EventAttr> = [
        {
            title: "key",
            dataIndex: "key",
            width: 150
        },
        {
            title: "备注",
            dataIndex: "desc",
        }
    ];

    return (
        <Modal open title="研发事件大全" footer={null} width="600px"
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Tabs type="card" defaultActiveKey="ProjectEvent" popupClassName={s.popup}>
                {eventGroupList.map(eventGroup => (
                    <Tabs.TabPane key={eventGroup.id} tab={eventGroup.name}>
                        <div key={eventGroup.id} style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}>
                            <p>事件分组ID:&nbsp;{eventGroup.id}</p>
                            <Collapse accordion defaultActiveKey={eventGroup.eventDescList[0].id}>
                                {eventGroup.eventDescList.map(eventDesc => (
                                    <Collapse.Panel key={eventDesc.id} header={eventDesc.name == "" ? eventDesc.id : eventDesc.name}>
                                        <Descriptions key={eventDesc.id} bordered column={1}
                                            style={{ paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #e4e4e8" }}>
                                            <Descriptions.Item label="id" labelStyle={{ width: "80px" }}>{eventDesc.id}</Descriptions.Item>
                                            {eventDesc.attrList.length > 0 && (
                                                <Descriptions.Item label="属性">
                                                    <Table rowKey="key" dataSource={eventDesc.attrList} columns={columns} pagination={false} />
                                                </Descriptions.Item>
                                            )}
                                        </Descriptions>
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        </div>
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </Modal>
    );
};

export default EventDescModal;