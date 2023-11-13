import React, { useEffect, useState } from 'react';
import { SAVE_WIDGET_NOTICE, type WidgetProps } from './common';
import SwaggerUI from 'swagger-ui-react';
import { Tabs, Input, Card, Form } from 'antd';
import 'swagger-ui-react/swagger-ui.css';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';
import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import YAML from 'yaml';
import { appWindow } from "@tauri-apps/api/window";
import { observer } from 'mobx-react';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
    spec: string;
}

export const swaggerWidgetInitData: WidgetData = {
    spec: '',
};

const EditSwagger: React.FC<WidgetProps> = observer((props) => {
    const data = props.initData as WidgetData;

    const localStore = useLocalObservable(() => ({
        spec: data.spec,
        setSpec(val: string) {
            runInAction(() => {
                this.spec = val;
            });
        }
    }));

    useEffect(() => {
        const unListenFn = appWindow.listen(SAVE_WIDGET_NOTICE, () => {
            props.writeData({
                spec: localStore.spec,
            });
        });
        return () => {
            unListenFn.then(unListen => unListen());
        };
    }, []);

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <Tabs defaultActiveKey="1" tabBarExtraContent={
                    <a href="https://swagger.io/docs/" target="_blank" rel="noreferrer"><QuestionCircleOutlined style={{ marginLeft: "10px" }} /></a>
                } type='card'>
                    <Tabs.TabPane tab="编辑" key="1">
                        <div style={{}}>
                            <Input.TextArea
                                rows={10}
                                value={localStore.spec}
                                placeholder="请输入swagger内容"
                                onChange={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log(e.target.value);
                                    localStore.setSpec(e.target.value);
                                }}
                                style={{
                                    height: "calc(100vh - 400px)", marginRight: "20px", overflowY: "scroll"
                                }}
                            />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="预览" key="2">
                        <div style={{ height: "calc(100vh - 400px)", marginRight: "20px", overflowY: "scroll" }}>
                            <SwaggerUI spec={localStore.spec} />
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </EditorWrap>
        </ErrorBoundary>
    );
});

const ViewSwagger: React.FC<WidgetProps> = (props) => {
    const data = props.initData as WidgetData;

    const [addr, setAddr] = useState("");

    const adjustSepc = (apiSpec: string, apiAddr: string) => {
        if (apiAddr == "") {
            return apiSpec;
        }
        let tmpSpec: object | null = null;
        try {
            tmpSpec = JSON.parse(apiSpec);
        } catch (e) {
            console.log(e);
        }
        if (tmpSpec == null) {
            try {
                tmpSpec = YAML.parse(apiSpec)
            } catch (e) {
                console.log(e);
            }
        }
        (tmpSpec as any).servers = [
            {
                url: apiAddr,
            }
        ];
        return JSON.stringify(tmpSpec);
    };

    return (
        <ErrorBoundary>
            <EditorWrap>
                <Card bordered={false} bodyStyle={{ height: "calc(100vh - 400px)", marginRight: "20px", overflowY: "scroll" }}
                    extra={
                        <Form>
                            <Form.Item label="服务地址">
                                <Input value={addr} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setAddr(e.target.value.trim());
                                }}  style={{width:200}}/>
                            </Form.Item>
                        </Form>
                    }>
                    <SwaggerUI spec={adjustSepc(data.spec, addr)} />
                </Card>
            </EditorWrap>
        </ErrorBoundary>
    );
};

export const SwaggerWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditSwagger {...props} />;
    } else {
        return <ViewSwagger {...props} />;
    }
};
