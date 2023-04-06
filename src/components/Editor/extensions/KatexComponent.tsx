import { useCommands, type NodeViewComponentProps } from "@remirror/react";
import React, { useEffect, useState } from "react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import style from './common.module.less';
import { ReactComponent as Deletesvg } from '@/assets/svg/delete.svg';
import { Popover, Input, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";


export type EditKatexProps = NodeViewComponentProps & {
    math: string;
}

export const EditKatex: React.FC<EditKatexProps> = (props) => {

    const { deleteKatex } = useCommands();

    const [math, setMath] = useState(props.math);

    const removeNode = () => {
        deleteKatex((props.getPosition as () => number)());
    };

    useEffect(() => {
        props.updateAttributes({
            math: math,
        });
    }, [math]);

    return (
        <ErrorBoundary>
            <div className={style.katex}>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, textAlign: "center", cursor: "pointer" }}>
                        <Popover placement="top" trigger="click" content={
                            <div style={{ padding: "10px 10px" }}>
                                <h4>使用<a href="https://katex.org/" target="_blank" rel="noreferrer">katex</a>编写数学公式</h4>
                                <Input.TextArea value={math} rows={5} style={{ width: "200px" }}
                                    onChange={e => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setMath(e.target.value);
                                    }} />
                            </div>
                        }>
                            <Space>
                                {math == "" && "空白公式"}
                                <BlockMath>{math}</BlockMath>
                                <a><EditOutlined /></a>
                            </Space>
                        </Popover>
                    </div>
                </div>
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
            </div>
        </ErrorBoundary>
    );
};


export type ViewKatexProps = NodeViewComponentProps & {
    math: string;
}

export const ViewKatex: React.FC<ViewKatexProps> = (props) => {
    return (
        <ErrorBoundary>
            <div className={style.katex}>
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        {props.math == "" && "空白公式"}
                        <BlockMath>{props.math}</BlockMath>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};