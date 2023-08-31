import { request } from "@/utils/request";
import { Form, Modal, Select } from "antd";
import React, { useState } from "react";
import { add_crawler } from "@/api/rss_admin";
import { get_admin_session } from "@/api/admin_auth";
import { uniqId } from "@/utils/utils";

export interface AddCrawlerModalProps {
    onCancel: () => void;
    onOk: () => void;
};


const AddCrawlerModal = (props: AddCrawlerModalProps) => {

    const [hourList, setHourList] = useState<number[]>([]);

    const addCrawler = async () => {
        const sessionId = await get_admin_session();
        await request(add_crawler({
            admin_session_id: sessionId,
            crawler: {
                crawler_id: uniqId(),
                token: uniqId(),
                run_time_of_day_list: hourList,
            },
        }));
        props.onOk();
    };

    return (
        <Modal open title="新增资讯爬虫"
            okText="新增" okButtonProps={{ disabled: hourList.length == 0 }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                addCrawler();
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

export default AddCrawlerModal;