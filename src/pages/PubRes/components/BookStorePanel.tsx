import React, { useState } from "react";
import { Card, Form, Select } from "antd";

const PAGE_SIZE = 20;

const BookStorePanel = () => {
    const [cateId, setCateId] = useState("");
    return (
        <Card bordered={false}
            bodyStyle={{ height: "calc(100vh - 180px)", overflowY: "scroll" }}
            extra={
                <Form layout="inline">
                    <Form.Item label="书籍类别">
                        <Select value={cateId} style={{ width: "100px" }}>
                            <Select.Option value="">全部</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            }>
            xx
        </Card>
    );
};

export default BookStorePanel;
