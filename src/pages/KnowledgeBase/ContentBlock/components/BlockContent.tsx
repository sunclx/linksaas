import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import { Modal } from 'antd';


export interface BlockContentProps {
    blockCollId: string;
    blockId: string;
    blockName: string;
    onCancel: () => void;
}

const BlockContent: React.FC<BlockContentProps> = (props) => {
    const appStore = useStores('appStore');
    const projectStore = useStores('projectStore');

    const url = `/vc.html?projectId=${projectStore.curProjectId}&blockCollId=${props.blockCollId}&blockId=${props.blockId}&osWin=${appStore.isOsWindows}`;
    return (<Modal footer={null} title="查看内容" visible={true} onCancel={() => props.onCancel()}>
        <iframe height="60%" src={url} width="100%" />
    </Modal>);
};

export default observer(BlockContent);