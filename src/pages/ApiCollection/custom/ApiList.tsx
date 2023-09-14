import { Empty, Tabs } from "antd";
import React from "react";
import ApiDetail from "./ApiDetail";
import { useCustomStores } from "./stores";
import { observer } from 'mobx-react';


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
        <>
            {store.api.tabApiIdList.length == 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {store.api.tabApiIdList.length > 0 && (
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
                    })} />
            )}
        </>

    );
};

export default observer(ApiList);