import { Modal } from 'antd';
import React from 'react';
import MemberInfo from './MemberInfo';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';

interface MemberInfoModalProps {
    memberId: string;

}

const MemberInfoModal: React.FC<MemberInfoModalProps> = (props) => {
    const memberStore = useStores('memberStore');

    return (
        <Modal
            title="成员信息"
            width={250}
            open
            footer={null}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                memberStore.floatMemberUserId = "";
            }}
        >
            <MemberInfo memberId={props.memberId} showLink={true} hideMemberInfo={() => memberStore.floatMemberUserId = ""} />
        </Modal>
    );
}

export default observer(MemberInfoModal);

