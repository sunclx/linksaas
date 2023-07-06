import { Form, Input, Modal, Select, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";
import { getDefaultConfig } from "./defaultConfig";

export interface CreateAnnoProjectModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateAnnoProjectModal = (props: CreateAnnoProjectModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [annoName, setAnnoName] = useState("");
    const [annoType, setAnnoType] = useState(dataAnnoPrjApi.ANNO_TYPE_AUDIO_CLASSIFI);
    const [annoDesc, setAnnoDesc] = useState("");

    const createAnnoProject = async () => {
        await request(dataAnnoPrjApi.create({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            base_info: {
                name: annoName,
                anno_type: annoType,
                desc: annoDesc,
                config: getDefaultConfig(annoType),
            },
        }));
        message.info("创建成功");
        props.onOk();
    };

    return (
        <Modal open title="创建数据标注项目" bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
            okText="创建" okButtonProps={{ disabled: annoName.trim() == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                createAnnoProject();
            }}>
            <Form labelCol={{ span: 5 }}>
                <Form.Item label="标注类型">
                    <Select value={annoType} onChange={value => setAnnoType(value)}>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_CLASSIFI}>音频分类</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG}>音频分割</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS}>音频翻译</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG_TRANS}>音频分段翻译</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI}>图像分类</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT}>矩形对象检测</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_BRUSH_SEG}>画笔分割</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT}>圆形对象检测</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_KEYPOINT}>图像关键点</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_POLYGON_SEG}>多边形分割</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI}>文本分类</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_NER}>文本命名实体识别</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_SUMMARY}>文本摘要</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="标注项目名称">
                    <Input value={annoName} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAnnoName(e.target.value.trim());
                    }} />
                </Form.Item>
                <Form.Item label="标注描述">
                    <Input.TextArea rows={3} value={annoDesc} onChange={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAnnoDesc(e.target.value);
                    }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default observer(CreateAnnoProjectModal);