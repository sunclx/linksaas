
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import s from './index.module.less';
import { Switch } from 'antd';
import { useStores } from '@/hooks';
import { request } from '@/utils/request';
import { set_local_api_perm, get_local_api_perm } from '@/api/project';

const LocalApiPermInfo = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');

    const [accessChannel, setAccessChannel] = useState(false);

    const loadPerm = async () => {
        const res = await request(get_local_api_perm(userStore.sessionId, projectStore.curProjectId));
        if (res) {
            setAccessChannel(res.perm.access_channel);
        }
    }

    const changeAccessChannel = async (value: boolean) => {
        const res = await request(set_local_api_perm(userStore.sessionId, projectStore.curProjectId, {
            access_channel: value,
        }))
        if (res) {
            setAccessChannel(value);
        }
    }

    useEffect(() => {
        loadPerm();
    }, [projectStore.curProjectId, projectStore.isAdmin]);

    return (
        <div>
            <div className={s.info_wrap}>
                <div className={s.info_label}>沟通频道：</div>
                <Switch checkedChildren="允许" unCheckedChildren="禁止" disabled={!projectStore.isAdmin}
                    checked={accessChannel} onChange={checked => changeAccessChannel(checked)} />
            </div>
        </div>
    );
};

export default observer(LocalApiPermInfo);