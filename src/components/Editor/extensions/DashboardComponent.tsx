import { useCommands, type NodeViewComponentProps } from "@remirror/react";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import style from './common.module.less';
import GridLayout from "react-grid-layout";
import { useSize } from "ahooks";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import type { BoardItem } from "./DashboardExtension";
import { Card, Form, Input, Modal, message } from "antd";
import Button from "@/components/Button";
import { uniqId } from "@/utils/utils";
import type { Layout } from "react-grid-layout";



interface EditDashboardItemProps {
    item: BoardItem;
    readOnly: boolean;
    onRemove?: () => void;
}

const EditDashboardItem: React.FC<EditDashboardItemProps> = (props) => {
    const [hover, setHover] = useState(false);

    return (
        <Card title={<h2 style={{ lineHeight: "30px" }}>{props.item.name}</h2>} bordered={false}
            style={{ height: "100%" }}
            onMouseEnter={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(true);
            }}
            onMouseLeave={e => {
                e.stopPropagation();
                e.preventDefault();
                setHover(false);
            }}
            bodyStyle={{ height: "calc(100% - 40px)", overflow: "hidden" }}
            extra={
                <>
                    {hover == true && props.readOnly == false && (
                        <Button type="text" style={{ minWidth: 0, padding: "4px 4px", backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", borderRadius: "4px" }}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (props.onRemove != undefined) {
                                    props.onRemove();
                                }
                            }}>
                            <Deletesvg />
                        </Button>
                    )}
                </>
            }>
            <iframe src={props.item.url} width="100%" height="100%" />
        </Card>
    );
};

export type EditDashboardProps = NodeViewComponentProps & {
    itemList: BoardItem[];
};

export const EditDashboard: React.FC<EditDashboardProps> = (props) => {

    const { deleteDashboard } = useCommands();

    const [hasWidth, setHasWidth] = useState(false);


    const removeNode = () => {
        deleteDashboard((props.getPosition as () => number)());
    };

    const [itemList, setItemList] = useState(props.itemList);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const domRef = useRef<HTMLDivElement>(null);
    const domRefSize = useSize(domRef);

    const addBoardItem = () => {
        const nameValue = newName.trim();
        const urlValue = newUrl.trim();
        if (nameValue.length == 0) {
            message.error("组件名称不能为空");
            return;
        }
        if (!urlValue.startsWith("https://")) {
            message.error("组件地址必须以https://开头");
            return;
        }
        const tmpList = itemList.slice();
        tmpList.push({
            i: uniqId(),
            x: 0,
            y: Infinity,
            w: 4,
            h: 4,
            minW: 4,
            minH: 4,
            name: nameValue,
            url: urlValue,
        });
        setItemList(tmpList);
        setNewName("");
        setNewUrl("");
        setShowAdd(false);
    };

    const onLayoutChange = (layout: Layout[]) => {
        const tmpList: BoardItem[] = [];
        let hasChange = false;
        itemList.forEach(item => {
            const index = layout.findIndex(layoutItem => layoutItem.i == item.i);
            if (index != -1) {
                const layoutItem = layout[index];
                if (layoutItem.x != item.x || layoutItem.y != item.y || layoutItem.w != item.w || layoutItem.h != item.h) {
                    hasChange = true;
                    item.x = layoutItem.x;
                    item.y = layoutItem.y;
                    item.w = layoutItem.w;
                    item.h = layoutItem.h;
                }
            }
            tmpList.push(item);
        })

        if (hasChange) {
            setItemList(tmpList);
        }
    };

    const removeBoardItem = (key: string) => {
        const tmpList = itemList.filter(item => item.i != key);
        setItemList(tmpList);
    }

    useEffect(() => {
        setHasWidth(false);
        setTimeout(() => {
            setHasWidth(true);
        }, 200);
    }, [domRefSize?.width])

    useEffect(() => {
        props.updateAttributes({
            itemList: itemList,
        });
    }, [itemList]);

    return (
        <ErrorBoundary>
            <div className={style.dashboard} ref={domRef}>
                <Card title="信息面板" extra={
                    <Button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setNewName("");
                        setNewUrl("");
                        setShowAdd(true);
                    }}>添加信息组件</Button>
                }>
                    {hasWidth == true && (
                        <GridLayout
                            layout={itemList}
                            cols={12}
                            rowHeight={50}
                            width={domRefSize?.width}
                            onLayoutChange={layout => onLayoutChange(layout)}

                        >
                            {itemList.map(item => (
                                <div key={item.i} style={{ border: "1px solid #e4e4e8", overflow: "hidden" }}>
                                    <EditDashboardItem item={item} onRemove={() => removeBoardItem(item.i)} readOnly={false} />
                                </div>
                            ))}
                        </GridLayout>
                    )}

                    <div
                        className={style.delete}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeNode();
                        }}
                    >
                        <Deletesvg />
                    </div>
                </Card>
                {showAdd == true && (
                    <Modal title="添加信息组件" open
                        okText="添加"
                        okButtonProps={{ disabled: newName.trim().length == 0 || !newUrl.trim().startsWith("https://") }}
                        onCancel={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            setNewName("");
                            setNewUrl("");
                            setShowAdd(false);
                        }} onOk={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            addBoardItem();
                        }}>
                        <Form>
                            <Form.Item label="组件名称">
                                <Input value={newName} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setNewName(e.target.value);
                                }} />
                            </Form.Item>
                            <Form.Item label="组件地址" help={
                                <>
                                    {newUrl.startsWith("https://".substring(0, newUrl.length)) == false && (
                                        <span style={{ color: "red" }}>地址必须以https://开头</span>
                                    )}
                                </>
                            }>
                                <Input value={newUrl} onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setNewUrl(e.target.value);
                                }} />
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
            </div>
        </ErrorBoundary>
    );
};


export type ViewDashboardProps = NodeViewComponentProps & {
    itemList: BoardItem[];
};

export const ViewDashboard: React.FC<ViewDashboardProps> = (props) => {
    const [hasWidth, setHasWidth] = useState(false);

    const domRef = useRef<HTMLDivElement>(null);
    const domRefSize = useSize(domRef);

    useEffect(() => {
        setHasWidth(false);
        setTimeout(() => {
            setHasWidth(true);
        }, 200);
    }, [domRefSize?.width]);

    return (
        <div className={style.dashboard} ref={domRef}>
            <Card title="信息面板">
                {hasWidth == true && (
                    <GridLayout
                        layout={props.itemList.map(item => ({ ...item, static: true }))}
                        cols={12}
                        rowHeight={50}
                        width={domRefSize?.width}

                    >
                        {props.itemList.map(item => (
                            <div key={item.i} style={{ border: "1px solid #e4e4e8", overflow: "hidden" }}>
                                <EditDashboardItem item={item} readOnly={true} />
                            </div>
                        ))}
                    </GridLayout>
                )}
            </Card>
        </div>);
};