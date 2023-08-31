import { request } from "@/utils/request";
import { Form, Modal, Select, message } from "antd";
import React, { useState } from "react";
import { set_crawler_run_time } from "@/api/rss_admin"
import { get_admin_session } from "@/api/admin_auth";

export interface UpdateCrawlerTimeModalProps {
    crawlerId: string,
    hourList: number[];
    onCancel: () => void;
    onOk: () => void;
}

const UpdateCrawlerTimeModal = (props: UpdateCrawlerTimeModalProps) => {
    const [hourList, setHourList] = useState(props.hourList);

    const updateTime = async () => {
        const sessionId = await get_admin_session();
        await request(set_crawler_run_time({
            admin_session_id: sessionId,
            crawler_id: props.crawlerId,
            run_time_of_day_list: hourList,
        }));
        props.onOk();
        message.info("更新成功")
    };
    return (
        <Modal open title="更新资讯爬虫执行时间"
            okText="更新" okButtonProps={{ disabled: hourList.length == 0 }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                updateTime();
            }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            <Form>
                <Form.Item label="执行时间">
                    <Select mode="multiple" value={hourList} onChange={value => setHourList(value)}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(
                            hour => (
                                <Select.Option key={hour} value={hour}>每天{hour}点</Select.Option>
                            )
                        )}

                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default UpdateCrawlerTimeModal;