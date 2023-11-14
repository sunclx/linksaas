import React, { useEffect, useState } from 'react';
import { SAVE_WIDGET_NOTICE, type WidgetProps } from './common';
import type { StoreSnapshot, TLRecord, TLUiMenuGroup, Editor } from '@tldraw/tldraw';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { message } from 'antd';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';
import { appWindow } from "@tauri-apps/api/window";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';
import { getAssetUrls } from '@tldraw/assets/selfHosted';

// 为了防止编辑器出错，WidgetData结构必须保存稳定
export interface WidgetData {
    data?: StoreSnapshot<TLRecord>;
}

export const tldrawWidgetInitData: WidgetData = {
    data: undefined,
};

const EditTldraw: React.FC<WidgetProps> = observer((props) => {
    const [initData] = useState((props.initData as WidgetData).data);

    const localStore = useLocalObservable(() => ({
        drawEditor: null as Editor | null,
        setDrawEditor(val: Editor | null) {
            runInAction(() => {
                this.drawEditor = val;
            });
        },
    }));

    useEffect(() => {
        const unListenFn = appWindow.listen(SAVE_WIDGET_NOTICE, () => {
            if (localStore.drawEditor != null) {
                props.writeData({
                    data: localStore.drawEditor.store.getSnapshot(),
                });
            }
        });
        return () => {
            unListenFn.then(unListen => unListen());
        };
    }, []);

    return (
        <ErrorBoundary>
            <EditorWrap onChange={() => props.removeSelf()}>
                <div style={{ height: "calc(100vh - 300px)", marginRight: "20px",marginLeft:"20px"  }}>
                    <Tldraw snapshot={initData}
                        assetUrls={getAssetUrls({ baseUrl: "/tldraw" })}
                        onMount={editor => {
                            localStore.setDrawEditor(editor);
                            editor.updateInstanceState({
                                isDebugMode: false,
                            });
                        }}
                        overrides={{
                            menu(_, menus) {
                                const newMenus = menus.filter(item => item.id != "extras");
                                const menuIndex = menus.findIndex(item => item.id == "menu");
                                if (menuIndex != -1) {
                                    (newMenus[menuIndex] as TLUiMenuGroup).children = (newMenus[menuIndex] as TLUiMenuGroup).children.filter(item => ["file", "edit"].includes(item.id) == false);
                                }
                                return newMenus;
                            },
                            tools(_, tools) {
                                if (tools["asset"] != undefined) {
                                    tools["asset"].onSelect = () => {
                                        message.warn("不能嵌入图片");
                                    };
                                }
                                return tools;
                            }
                        }} />
                </div>
            </EditorWrap>
        </ErrorBoundary>
    );
});

const ViewTldraw: React.FC<WidgetProps> = (props) => {
    return (
        <ErrorBoundary>
            <EditorWrap>
                <div style={{ height: "calc(100vh - 300px)", marginRight: "20px" }}>
                    <Tldraw snapshot={(props.initData as WidgetData).data}
                        assetUrls={getAssetUrls({ baseUrl: "/tldraw" })}
                        onMount={editor => {
                            editor.updateInstanceState({
                                isDebugMode: false,
                                isReadonly: true,
                            });
                        }}
                        overrides={{
                            menu(_, menus) {
                                const newMenus = menus.filter(item => item.id != "extras");
                                const menuIndex = menus.findIndex(item => item.id == "menu");
                                if (menuIndex != -1) {
                                    (newMenus[menuIndex] as TLUiMenuGroup).children = (newMenus[menuIndex] as TLUiMenuGroup).children.filter(item => ["file", "edit"].includes(item.id) == false);
                                }
                                return newMenus;
                            }
                        }} />
                </div>
            </EditorWrap>
        </ErrorBoundary>
    );
}

export const TldrawWidget: React.FC<WidgetProps> = (props) => {
    if (props.editMode) {
        return <EditTldraw {...props} />;
    } else {
        return <ViewTldraw {...props} />;
    }
};