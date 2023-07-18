import { Button, Form, Input, Modal, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import type { DockerComposeTemplateSchema, VariableSchema, FileSchema } from "./dockerTemplate/schema";
import { useStores } from "@/hooks";
import { readTextFile } from '@tauri-apps/api/fs';
import SelectFeature from "./dockerTemplate/SelectFeature";
import VairableSetting from "./dockerTemplate/VairableSetting";
import { FolderOpenOutlined } from "@ant-design/icons";
import { save as save_dialog } from '@tauri-apps/api/dialog';
import { genResult } from "./dockerTemplate/gen";

export interface DockerTemplateModalProps {
    templatePath: string;
    onCancel: () => void;
}

const DockerTemplateModal = (props: DockerTemplateModalProps) => {
    const appStore = useStores('appStore');

    const [destPath, setDestPath] = useState("");

    const [config, setConfig] = useState<DockerComposeTemplateSchema | null>(null);
    const [featureMap, setFeatureMap] = useState<Map<string, boolean>>(new Map());

    const [envCfgList, setEnvCfgList] = useState<VariableSchema[]>([]);
    const [envMap, setEnvMap] = useState<Map<string, string | number>>(new Map());

    const [fileCfgList, setFileCfgList] = useState<FileSchema[]>([]);
    const [fileValMap, setFileValMap] = useState<Map<string, Map<string, string | number>>>(new Map());

    const loadConfig = async () => {
        let configFile = `${props.templatePath}/config.json`;
        if (appStore.isOsWindows) {
            configFile = `${props.templatePath}\\config.json`;
        }
        const configText = await readTextFile(configFile);
        try {
            const tmpCfg = JSON.parse(configText) as DockerComposeTemplateSchema;
            setConfig(tmpCfg);
            const tmpFeatMap: Map<string, boolean> = new Map();
            for (const feat of (tmpCfg.features ?? [])) {
                tmpFeatMap.set(feat.id, false);
            }
            setFeatureMap(tmpFeatMap);
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    const calcEnvCfgList = () => {
        if (config == null) {
            return;
        }
        const tmpCfgList: VariableSchema[] = [];
        for (const envCfg of (config.envs ?? [])) {
            let trueCount = 0;
            for (const feat of (envCfg.features ?? [])) {
                if (featureMap.get(feat) == true) {
                    trueCount += 1;
                }
            }
            if (trueCount == (envCfg.features ?? []).length) {
                tmpCfgList.push(envCfg);
            }
        }
        const idList = tmpCfgList.map(item => item.id);
        const tmpEnvMap: Map<string, string | number> = new Map();
        envMap.forEach((value, key) => {
            if (idList.includes(key)) {
                tmpEnvMap.set(key, value);
            }
        });
        for (const envCfg of tmpCfgList) {
            if (envCfg.defaultValue !== undefined) {
                if (!tmpEnvMap.has(envCfg.id)) {
                    tmpEnvMap.set(envCfg.id, envCfg.defaultValue);
                }
            }
        }
        setEnvMap(tmpEnvMap);
        setEnvCfgList(tmpCfgList);
    };

    const calcFileCfgList = () => {
        if (config == null) {
            return;
        }
        const tmpCfgList: FileSchema[] = [];
        for (const fileCfg of (config.files ?? []).slice()) {
            //计算文件是否需要生成
            let trueCount = 0;
            for (const feat of (fileCfg.features ?? [])) {
                if (featureMap.get(feat) == true) {
                    trueCount += 1;
                }
            }
            if (trueCount != (fileCfg.features ?? []).length) {
                continue;
            }

            //计算变量
            const tmpValCfgList: VariableSchema[] = [];
            for (const varCfg of (fileCfg.variables ?? [])) {
                let trueCount2 = 0;
                for (const feat of (varCfg.features ?? [])) {
                    if (featureMap.get(feat) == true) {
                        trueCount2 += 1;
                    }
                }
                if (trueCount2 == (varCfg.features ?? []).length) {
                    tmpValCfgList.push(varCfg);
                }
            }
            fileCfg._variables = tmpValCfgList;
            tmpCfgList.push(fileCfg);
        }
        //计算变量默认值
        const tmpfileValMap: Map<string, Map<string, string | number>> = new Map();
        for (const fileCfg of tmpCfgList) {
            const tmpValMap: Map<string, string | number> = fileValMap.get(fileCfg.name) ?? new Map();
            for (const varCfg of (fileCfg._variables ?? [])) {
                if (varCfg.defaultValue !== undefined) {
                    if (!tmpValMap.has(varCfg.id)) {
                        tmpValMap.set(varCfg.id, varCfg.defaultValue);
                    }
                }
            }
            tmpfileValMap.set(fileCfg.name, tmpValMap);
        }
        setFileValMap(tmpfileValMap);
        setFileCfgList(tmpCfgList);
    };

    const choicePath = async () => {
        const selected = await save_dialog({
            title: "选择保存目录"
        });
        if (selected == null) {
            return;
        }
        setDestPath(selected);
    };

    const runExport = async () => {
        try {
            await genResult(props.templatePath, destPath, appStore.isOsWindows, featureMap, envCfgList, envMap, fileCfgList, fileValMap);
            props.onCancel();
            message.info("生成成功");
        } catch (e) {
            console.log(e);
            message.error(`${e}`);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    useEffect(() => {
        if (config == null) {
            return;
        }
        calcEnvCfgList();
        calcFileCfgList();
    }, [config, featureMap]);

    return (
        <Modal open title="配置模板参数"
            okText="生成" okButtonProps={{ disabled: destPath == "" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                props.onCancel();
            }}
            onOk={e => {
                e.stopPropagation();
                e.preventDefault();
                runExport();
            }}>
            {config !== null && (
                <Tabs defaultActiveKey="destPath">
                    <Tabs.TabPane tab="保存目录" key="destPath">
                        <div style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}>
                            <Form labelCol={{ span: 6 }}>
                                <Form.Item label="保存目录">
                                    <Input value={destPath} onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setDestPath(e.target.value);
                                    }}
                                        addonAfter={<Button type="link" style={{ height: 20 }} icon={<FolderOpenOutlined />} onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            choicePath();
                                        }} />} />
                                </Form.Item>
                            </Form>
                        </div>
                    </Tabs.TabPane>
                    {(config.features ?? []).length > 0 && (
                        <Tabs.TabPane tab="特性" key="feature">
                            <div style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}>
                                <SelectFeature featureList={config.features ?? []} onChange={featMap => setFeatureMap(featMap)} />
                            </div>
                        </Tabs.TabPane>
                    )}
                    {envCfgList.length > 0 && (
                        <Tabs.TabPane tab="环境变量" key="env">
                            <div style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}>
                                <VairableSetting valCfgList={envCfgList} valueMap={envMap} onChange={newValueMap => setEnvMap(newValueMap)} />
                            </div>
                        </Tabs.TabPane>
                    )}
                    {fileCfgList.filter(fileCfg => (fileCfg._variables ?? []).length > 0).map(fileCfg => (
                        <Tabs.TabPane key={`file:${fileCfg.name}`} tab={fileCfg.name}>
                            <div style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}>
                                <VairableSetting valCfgList={fileCfg._variables ?? []} valueMap={fileValMap.get(fileCfg.name) ?? (new Map())} onChange={newValueMap => {
                                    const tmpMap = fileValMap;
                                    tmpMap.set(fileCfg.name, newValueMap);
                                    setFileValMap(tmpMap);
                                }} />
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            )}

        </Modal>
    );
};


export default DockerTemplateModal;
