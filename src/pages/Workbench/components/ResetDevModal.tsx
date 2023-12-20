import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin, message } from "antd";
import React, { useState } from "react";
import { Command } from '@tauri-apps/api/shell';


export interface ResetDevModalProps {
    onClose: () => void;
};


const ResetDevModal = (props: ResetDevModalProps) => {
    const [inReset, setInReset] = useState(false);

    const runReset = async () => {
        setInReset(true);
        try {
            const cmd = Command.sidecar("bin/devc", ["reset"]);
            const output = await cmd.execute();
            const obj = JSON.parse(output.stdout);
            if (obj.success) {
                message.info("重置成功");
                props.onClose();
            } else {
                message.error(obj.errMsg);
                setInReset(false);
            }
        } catch (e) {
            console.log(e);
            message.error("出错了");
            setInReset(false);
        }
    };
    return (
        <Modal open title="重置研发环境"
            okText="重置" okButtonProps={{ disabled: inReset }} cancelButtonProps={{ disabled: inReset }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onClose();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                runReset();
            }}>
            <p>重置研发环境将进行如下操作:</p>
            <p>1. 清除研发环境容器</p>
            <p>2. 清除研发容器镜像</p>
            {inReset && (
                <p>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    重置中...
                </p>
            )}
        </Modal>
    );
};

export default ResetDevModal;