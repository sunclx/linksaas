import React from "react";
import { Empty, Button } from 'antd';
import { useStores } from "@/hooks";


const EmptyDoc: React.FC = () => {
    const docStore = useStores('docStore');

    return (<div style={{ position: "relative" }}>
        <Button type="primary" style={{ position: "absolute",right:"20px"}} onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            docStore.setCurDoc('', true, false);
        }}>新建文档</Button>
        <Empty style={{paddingTop:"60px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>);
};

export default EmptyDoc;