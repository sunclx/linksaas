import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { useStores } from '@/hooks';
import * as vcApi from '@/api/project_vc';
import ActionModal from '@/components/ActionModal';
import { request } from '@/utils/request';
import { Input } from 'antd';


interface UpdateBlockProps {
    block: vcApi.Block;
    onOk: () => void;
    onCancel: () => void;
}

const UpdateBlock: React.FC<UpdateBlockProps> = (props) => {
    const userStore = useStores('userStore');
    const [blockName, setBlockName] = useState(props.block.base_info.title);

    const updateBlock = async () => {
        const res = await request(vcApi.update_block({
            session_id: userStore.sessionId,
            project_id: props.block.project_id,
            block_coll_id: props.block.block_coll_id,
            block_id: props.block.block_id,
            base_info: {
                title: blockName,
            },
        }));
        if (res) {
            props.onOk();
        }
    };

    return (
        <ActionModal
            visible={true}
            title="重命名可变内容块"
            okText={'完成'}
            width={416}
            onOK={() => updateBlock()}
            onCancel={() => props.onCancel()}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '100px', fontWeight: '500', color: '#2F3338', lineHeight: '17px' }}>
                    <span style={{ color: 'red' }}>*</span> 内容块名称
                </label>
                <Input
                    defaultValue={blockName}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setBlockName(e.target.value);
                    }}
                />
            </div>
        </ActionModal>
    );
};

export default observer(UpdateBlock);