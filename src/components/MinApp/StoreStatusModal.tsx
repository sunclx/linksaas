import { Button, Descriptions, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import type { StoreStatus } from "@/api/min_app_store";
import { clear_data, get_status } from "@/api/min_app_store";

export interface StoreStatusModalProps {
    minAppId: string;
    onCancel: () => void;
}

const StoreStatusModal: React.FC<StoreStatusModalProps> = (props) => {

    const [status, setStatus] = useState<StoreStatus | null>(null);

    const loadStatus = async () => {
        const res = await get_status("minApp:" + props.minAppId);
        setStatus(res);
    };

    const getSizeStr = () => {
        if (status == null) {
            return "0 B";
        }
        let size = status.total_size;
        if (size < 1024) {
            return `${size} B`;
        }
        size = size / 1024;
        if (size < 1024) {
            return `${size.toFixed(1)} K`;
        }
        size = size / 1024;
        if (size < 1024) {
            return `${size.toFixed(1)} M`;
        }
        size = size / 1024;
        return `${size.toFixed(1)} G`;
    };

    useEffect(() => {
        loadStatus();
    }, [props.minAppId]);

    return (
        <Modal open title="微应用存储情况" footer={null} width={650}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}>
            {status != null && (
                <Descriptions column={3} bordered>
                    <Descriptions.Item label="存储大小">{getSizeStr()}</Descriptions.Item>
                    <Descriptions.Item label="记录数量">{status.key_count}</Descriptions.Item>
                    <Descriptions.Item label="操作">
                        <Button type="link" danger disabled={status.key_count == 0} onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            clear_data("minApp:" + props.minAppId).then(() => {
                                message.info("已清空存储");
                                loadStatus();
                            })
                        }}>清空存储</Button>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
};

export default StoreStatusModal;