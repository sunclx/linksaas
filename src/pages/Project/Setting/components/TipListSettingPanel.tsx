import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import type { PanelProps } from "./common";
import { Button, Card, Input, Space, message } from "antd";
import { useStores } from "@/hooks";
import { request } from "@/utils/request";
import { update_tip_list } from "@/api/project";

const unixTipList = `模块原则，Modularity：写简单的程序，并用好的接口连接它们
清晰原则，Clarity：清楚透明的算法比“高明”的算法更好
组装原则，Composition：写能够跟其他程序一起工作的程序
隔离原则，Separation：分离接口（使用引擎的方法）和引擎
简单原则，Simplicity：尽量简化算法，不到必要的时候不要增加复杂度
简约原则，Parsimony：只要在必要的时候才写大型程序，通常小程序已经足够了
透明原则，Transparency：写容易测试和纠错的代码
健壮原则，Robustness：这是简单和简约的副产物
表达原则，Representation：用数据结构表达逻辑，而不是用过程表达逻辑
传统原则，Least Surprise：用最常识的方法设计借口
安静原则，Silence：如果程序没什么特别事情要表达，应该保持安静！
经济原则，Economy：程序员的时间比机器的时间更加宝贵
生成原则，Generation：尽量写代码来生成代码，而不是手工输入代码
修复原则，Repair：当程序出现异常，应该明确的抛出异常，而且约早越好！
优化原则，Optimization：先让程序工作，在考虑优化的事情
多样性原则，Diversity：一个问题有很多好的解决方案，没有最好的解决方案！
拓展性原则，Extensible： 设计程序时应该考虑到未来的拓展，因为未来比你想象来的早`;

const pythonZenTipList = `优美胜于丑陋(Beautiful is better than ugly.)
明了胜于晦涩(Explicit is better than implicit.)
简洁胜于复杂(Simple is better than complex.)
复杂胜于凌乱(Complex is better than complicated.)
扁平胜于嵌套(Flat is better than nested.)
间隔胜于紧凑(Sparse is better than dense.)
可读性很重要(Readability counts.)
即便假借特例的实用性之名，也不可违背这些规则(Special cases aren’t special enough to break the rules.Although practicality beats purity.)
不要包容所有错误，除非你确定需要这样做(Errors should never pass silently.Unless explicitly silenced.)
当存在多种可能，不要尝试去猜测,而是尽量找一种，最好是唯一一种明显的解决方案(In the face of ambiguity, refuse the temptation to guess.There should be one– and preferably only one –obvious way to do it.)
`;



const TipListSettingPanel: React.FC<PanelProps> = (props) => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [tipsContent, setTipsContent] = useState((projectStore.curProject?.tip_list ?? []).join("\n"));
    const [hasChange, setHasChange] = useState(false);

    const resetConfig = () => {
        setTipsContent((projectStore.curProject?.tip_list ?? []).join("\n"));
        setHasChange(false);
    };

    const updateConfig = async () => {
        const tipList = tipsContent.split("\n").map(tip => tip.trim()).filter(tip => tip != "");
        await request(update_tip_list({
            session_id: userStore.sessionId,
            project_id: projectStore.curProjectId,
            tip_list: tipList,
        }));
        message.info("保存成功");
        await projectStore.updateProject(projectStore.curProjectId);
        setHasChange(false);
    };

    useEffect(() => {
        props.onChange(hasChange);
    }, [hasChange]);

    return (
        <Card bordered={false} title={props.title} bodyStyle={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
            extra={
                <Space>
                    <Button disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        resetConfig();
                    }}>取消</Button>
                    <Button type="primary" disabled={!hasChange} onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateConfig();
                    }}>保存</Button>
                </Space>
            }>
            <p>可以设置为项目注意事项或研发技巧，比如<a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setTipsContent(unixTipList);
                setHasChange(true);
            }}>unix编程思想</a>或<a onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setTipsContent(pythonZenTipList);
                setHasChange(true);
            }}>python编程思想</a></p>
            <p>每一行会被作为独立单元定期进行提示。</p>
            <Input.TextArea value={tipsContent}  disabled={projectStore.isClosed || !projectStore.isAdmin}
            onChange={e => {
                e.stopPropagation();
                e.preventDefault();
                setTipsContent(e.target.value);
                setHasChange(true);
            }} autoSize={{ minRows: 10 }} />
        </Card>

    );
};

export default observer(TipListSettingPanel);