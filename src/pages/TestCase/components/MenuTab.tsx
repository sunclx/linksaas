import React from "react";
import { Tabs } from "antd";
import s from './MenuTab.module.less';
import { useHistory } from "react-router-dom";
import { useStores } from "@/hooks";

interface MenuTabProps {
    activeKey: string;
    children?: React.ReactNode;
}

export const MenuTab: React.FC<MenuTabProps> = (props) => {
    const history = useHistory();
    const linkAuxStore = useStores('linkAuxStore');

    const changeTab = (tabKey: string) => {
        if (tabKey == props.activeKey) {
            return;
        }
        if (tabKey == "entryList") {
            linkAuxStore.goToTestCaseList({ entryId: "" }, history);
        } else if (tabKey == "resultList") {
            linkAuxStore.goToTestCaseResultList(history);
        }
    }
    return (
        <Tabs activeKey={props.activeKey} onChange={key => {
            changeTab(key);
        }}
            type="card"
            tabPosition="left"
            items={[
                {
                    label: <div className={s.tab}>测试用例</div>,
                    key: "entryList",
                    children: (<>
                        {props.activeKey == "entryList" && props.children}
                    </>),
                },
                {
                    label: <div className={s.tab}>测试结果</div>,
                    key: "resultList",
                    children: (<>
                        {props.activeKey == "resultList" && props.children}
                    </>),
                },
            ]}
        />

    );
};