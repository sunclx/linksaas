import { Card, Checkbox, Descriptions, Divider, Form, Input, InputNumber, List, Modal, Select, message } from "antd";
import React, { useState } from "react";
import { observer } from 'mobx-react';
import * as dataAnnoPrjApi from "@/api/data_anno_project";
import Button from "@/components/Button";
import { uniqId } from "@/utils/utils";
import { request } from "@/utils/request";
import { useStores } from "@/hooks";


interface LabelEditProps {
    formLabel: string;
    labels: dataAnnoPrjApi.AnnoLabel[];
    onChanges: (newLabels: dataAnnoPrjApi.AnnoLabel[]) => void;
}

const LabelEdit = (props: LabelEditProps) => {
    return (
        <Form.Item label={props.formLabel}>
            <Card bordered={false} extra={<Button onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onChanges([...props.labels, {
                    id: uniqId(),
                    display_name: "",
                    desc: "",
                }])
            }}>增加标签</Button>}>
                <List rowKey="id" dataSource={props.labels} renderItem={item => (
                    <List.Item >
                        <Descriptions column={2} labelStyle={{ height: "28px", lineHeight: "28px" }}>
                            <Descriptions.Item label="标签名称">
                                <Input style={{ marginRight: "10px" }} value={item.display_name} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const tmpList = props.labels.slice();
                                    const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                    if (index != -1) {
                                        tmpList[index].display_name = e.target.value;
                                        props.onChanges(tmpList);
                                    }
                                }} />
                            </Descriptions.Item>
                            <Descriptions.Item label="操作">
                                <Button type="link" danger style={{ padding: "0px 0px" }} onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onChanges(props.labels.filter(tmpItem => tmpItem.id != item.id));
                                }}>删除标签</Button>
                            </Descriptions.Item>
                            <Descriptions.Item label="标签描述" span={2}>
                                <Input.TextArea rows={3} value={item.desc} style={{ marginTop: "10px" }} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const tmpList = props.labels.slice();
                                    const index = tmpList.findIndex(tmpItem => tmpItem.id == item.id);
                                    if (index != -1) {
                                        tmpList[index].desc = e.target.value;
                                        props.onChanges(tmpList);
                                    }
                                }} />
                            </Descriptions.Item>
                        </Descriptions>
                    </List.Item>
                )} />
            </Card>
        </Form.Item>
    );
}

export interface CreateAnnoProjectModalProps {
    onCancel: () => void;
    onOk: () => void;
}

const CreateAnnoProjectModal = (props: CreateAnnoProjectModalProps) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [annoName, setAnnoName] = useState("");
    const [annoType, setAnnoType] = useState(dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI);
    const [annoDesc, setAnnoDesc] = useState("");

    const [audioEntityIdentiCfg, setAudioEntityIdentiCfg] = useState<dataAnnoPrjApi.AudioEntityIdentiConfig>({
        label_list: [],
        transcribe: false,
        only_use_words_in_phrase_bank: false,
        transcription_type: "simple",
    });

    const [audioTransCfg, setAudioTransCfg] = useState<dataAnnoPrjApi.AudioTransConfig>({
        only_use_words_in_phrase_bank: false,
        transcription_type: "simple",
    });

    const [imageClassifiCfg, setImageClassifiCfg] = useState<dataAnnoPrjApi.ImageClassifiConfig>({
        label_list: [],
    });


    const [imagePixelSegCfg, setImagePixelSegCfg] = useState<dataAnnoPrjApi.ImagePixelSegConfig>({
        label_list: [],
    });

    const [imageSegCfg, setImageSegCfg] = useState<dataAnnoPrjApi.ImageSegConfig>({
        label_list: [],
        region_types_allowed: ["bounding-box", "polygon", "point"],
        region_description: "",
        multiple_region_labels: false,
        multiple_regions: true,
        minimum_region_size: 0.01,
        overlapping_regions: true,
        region_min_acceptable_difference: 0.1,
    });

    const [textClassifiCfg, setTextClassifiCfg] = useState<dataAnnoPrjApi.TextClassifiConfig>({
        label_list: [],
        multiple: false,
    });

    const [textEntityRecCfg, setTextEntityRecCfg] = useState<dataAnnoPrjApi.TextEntityRecConfig>({
        label_list: [],
        overlap_allowed: false,
    });

    const [textEntityRelCfg, setTextEntityRelCfg] = useState<dataAnnoPrjApi.TextEntityRelConfig>({
        entity_label_list: [],
        rel_label_list: [],
    });

    const calcValid = () => {
        if (annoName == "") {
            return false;
        }
        if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI) {
            if (audioEntityIdentiCfg.label_list.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS) {
            return true;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI) {
            if (imageClassifiCfg.label_list.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_PIXEL_SEG) {
            if (imagePixelSegCfg.label_list.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_SEG) {
            if (imageSegCfg.label_list.length == 0) {
                return false;
            }
            if (imageSegCfg.region_types_allowed.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI) {
            if (textClassifiCfg.label_list.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REC) {
            if (textEntityRecCfg.label_list.length == 0) {
                return false;
            }
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REL) {
            if (textEntityRelCfg.entity_label_list.length == 0) {
                return false;
            }
            if (textEntityRelCfg.rel_label_list.length == 0) {
                return false;
            }
        }
        return true;
    };

    const createAnnoProject = async () => {
        const cfg: dataAnnoPrjApi.Config = {};
        if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI) {
            cfg.AudioEntityIdenti = audioEntityIdentiCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS) {
            cfg.AudioTrans = audioTransCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI) {
            cfg.ImageClassifi = imageClassifiCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_PIXEL_SEG) {
            cfg.ImagePixelSeg = imagePixelSegCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_SEG) {
            cfg.ImageSeg = imageSegCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI) {
            cfg.TextClassifi = textClassifiCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REC) {
            cfg.TextEntityRec = textEntityRecCfg;
        } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REL) {
            cfg.TextEntityRel = textEntityRelCfg;
        }
        await request(dataAnnoPrjApi.create({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            base_info: {
                name: annoName,
                config: {
                    anno_type: annoType,
                    desc: annoDesc,
                    config: cfg,
                },
            },
        }));
        message.info("创建成功");
        props.onOk();
    };

    return (
        <Modal open title="创建数据标注项目" bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
            okText="创建" okButtonProps={{ disabled: !calcValid() }}
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
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI}>音频实体识别</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS}>音频翻译</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI}>图片分类</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_PIXEL_SEG}>图片像素分割</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_IMAGE_SEG}>图片分割</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI}>文本分类</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REC}>文本命名实体识别</Select.Option>
                        <Select.Option value={dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REL}>文本实体关系</Select.Option>
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
                <Divider orientation="left">相关配置</Divider>
                {annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_ENTITY_IDENTI && (
                    <>
                        <LabelEdit formLabel="标签定义" labels={audioEntityIdentiCfg.label_list} onChanges={newLabels => {
                            setAudioEntityIdentiCfg(oldValue => {
                                return { ...oldValue, label_list: newLabels };
                            });
                        }} />
                        <Form.Item label="转译文本">
                            <Checkbox checked={audioEntityIdentiCfg.transcribe} onChange={e => {
                                e.stopPropagation();
                                setAudioEntityIdentiCfg(oldValue => {
                                    return { ...oldValue, transcribe: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="转译模型">
                            <Select value={audioEntityIdentiCfg.transcription_type} disabled={!audioEntityIdentiCfg.transcribe}
                                onChange={value => {
                                    setAudioEntityIdentiCfg(oldValue => {
                                        return { ...oldValue, transcription_type: value };
                                    });
                                }}>
                                <Select.Option value="simple">simple</Select.Option>
                                <Select.Option value="proper">proper</Select.Option>
                            </Select>
                        </Form.Item>
                    </>
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS && (
                    <Form.Item label="转译模型">
                        <Select value={audioTransCfg.transcription_type}
                            onChange={value => {
                                setAudioTransCfg(oldValue => {
                                    return { ...oldValue, transcription_type: value };
                                });
                            }}>
                            <Select.Option value="simple">simple</Select.Option>
                            <Select.Option value="proper">proper</Select.Option>
                        </Select>
                    </Form.Item>
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI && (
                    <LabelEdit formLabel="标签定义" labels={imageClassifiCfg.label_list} onChanges={newLabels => {
                        setImageClassifiCfg(oldValue => {
                            return { ...oldValue, label_list: newLabels };
                        });
                    }} />
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_PIXEL_SEG && (
                    <LabelEdit formLabel="标签定义" labels={imagePixelSegCfg.label_list} onChanges={newLabels => {
                        setImagePixelSegCfg(oldValue => {
                            return { ...oldValue, label_list: newLabels };
                        });
                    }} />
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_SEG && (
                    <>
                        <LabelEdit formLabel="标签定义" labels={imageSegCfg.label_list} onChanges={newLabels => {
                            setImageSegCfg(oldValue => {
                                return { ...oldValue, label_list: newLabels };
                            });
                        }} />
                        <Form.Item label="标记类型">
                            <Select mode="multiple" value={imageSegCfg.region_types_allowed} onChange={value => {
                                setImageSegCfg(oldValue => {
                                    return { ...oldValue, region_types_allowed: value };
                                });
                            }}>
                                <Select.Option value="bounding-box">矩形</Select.Option>
                                <Select.Option value="polygon">多边形</Select.Option>
                                <Select.Option value="point">点</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="单区域多标签">
                            <Checkbox checked={imageSegCfg.multiple_region_labels} onChange={e => {
                                e.stopPropagation();
                                setImageSegCfg(oldValue => {
                                    return { ...oldValue, multiple_region_labels: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="多区域标记">
                            <Checkbox checked={imageSegCfg.multiple_regions} onChange={e => {
                                e.stopPropagation();
                                setImageSegCfg(oldValue => {
                                    return { ...oldValue, multiple_regions: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                        <Form.Item label="最小区域大小">
                            <InputNumber value={imageSegCfg.minimum_region_size * 100}
                                style={{ width: "100%" }}
                                precision={0} controls={false} min={1} max={100} onChange={value => {
                                    if (value != null) {
                                        setImageSegCfg(oldValue => {
                                            return { ...oldValue, minimum_region_size: value / 100 };
                                        });
                                    }
                                }} addonAfter="%" />
                        </Form.Item>
                        <Form.Item label="允许区域重叠">
                            <Checkbox checked={imageSegCfg.overlapping_regions} onChange={e => {
                                e.stopPropagation();
                                setImageSegCfg(oldValue => {
                                    return { ...oldValue, overlapping_regions: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                    </>
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI && (
                    <>
                        <LabelEdit formLabel="标签定义" labels={textClassifiCfg.label_list} onChanges={newLabels => {
                            setTextClassifiCfg(oldValue => {
                                return { ...oldValue, label_list: newLabels };
                            });
                        }} />
                        <Form.Item label="多标签">
                            <Checkbox checked={textClassifiCfg.multiple} onChange={e => {
                                e.stopPropagation();
                                setTextClassifiCfg(oldValue => {
                                    return { ...oldValue, multiple: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                    </>
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REC && (
                    <>
                        <LabelEdit formLabel="标签定义" labels={textEntityRecCfg.label_list} onChanges={newLabels => {
                            setTextEntityRecCfg(oldValue => {
                                return { ...oldValue, label_list: newLabels };
                            });
                        }} />
                        <Form.Item label="允许重叠">
                            <Checkbox checked={textEntityRecCfg.overlap_allowed} onChange={e => {
                                e.stopPropagation();
                                setTextEntityRecCfg(oldValue => {
                                    return { ...oldValue, overlap_allowed: e.target.checked };
                                });
                            }} />
                        </Form.Item>
                    </>
                )}
                {annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_ENTITY_REL && (
                    <>
                        <LabelEdit formLabel="标签定义" labels={textEntityRelCfg.entity_label_list} onChanges={newLabels => {
                            setTextEntityRelCfg(oldValue => {
                                return { ...oldValue, entity_label_list: newLabels };
                            });
                        }} />
                        <LabelEdit formLabel="关系定义" labels={textEntityRelCfg.rel_label_list} onChanges={newLabels => {
                            setTextEntityRelCfg(oldValue => {
                                return { ...oldValue, rel_label_list: newLabels };
                            });
                        }} />
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default observer(CreateAnnoProjectModal);