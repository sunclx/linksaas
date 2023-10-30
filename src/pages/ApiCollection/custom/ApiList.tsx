import { Tabs } from "antd";
import React from "react";
import ApiDetail from "./ApiDetail";
import { useCustomStores } from "./stores";
import { observer } from 'mobx-react';
import CommentEntry from "@/components/CommentEntry";
import { COMMENT_TARGET_API_COLL } from "@/api/project_comment";


const ApiList = () => {
    const store = useCustomStores();

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'remove') {
            const tmpList = store.api.tabApiIdList.filter(id => id != targetKey);
            store.api.tabApiIdList = tmpList;
        }
    };


    return (
        <Tabs type="editable-card" hideAdd
            onEdit={onEdit}
            items={store.api.tabApiIdList.map(apiItemId => {
                const apiItem = store.api.getApiItem(apiItemId);
                return {
                    key: apiItemId,
                    label: apiItem?.api_item_name ?? "",
                    children: (
                        <>
                            {apiItem != null && (
                                <ApiDetail apiItem={apiItem} />
                            )}
                        </>
                    ),
                }
            })} tabBarExtraContent={
                <div style={{ marginRight: "20px" }}>
                    <CommentEntry projectId={store.api.projectId} targetType={COMMENT_TARGET_API_COLL}
                        targetId={store.api.apiCollId} myUserId={store.api.userId} myAdmin={store.api.canAdmin} />
                </div>
            } />
    );
};

export default observer(ApiList);