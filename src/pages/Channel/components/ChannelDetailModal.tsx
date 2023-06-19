import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';
import type { MemberInfo } from '@/api/project_member';
import { request } from '@/utils/request';
import { list_channel_member } from "@/api/project_channel";
import { Button, Descriptions, List, Modal, Popover, Space } from 'antd';
import UserPhoto from '@/components/Portrait/UserPhoto';
import MemberInfoPanel from './MemberInfo';
import moment from "moment";

const ChannelDetailModal: React.FC = () => {
    const userStore = useStores('userStore');
    const projectStore = useStores('projectStore');
    const channelStore = useStores('channelStore');
    const channelMemberStore = useStores('channelMemberStore');
    const memberStore = useStores('memberStore');

    const [memberList, setMemberList] = useState<MemberInfo[]>([]);
    const [ownerMember, setOwnerMember] = useState<MemberInfo | null>(null);

    const loadMemberList = async () => {
        let channelMemberIdList: string[] = [];
        if (channelStore.showDetailChannelId == channelStore.curChannelId) {
            channelMemberIdList = channelMemberStore.channelMemberList.map(item => item.member_user_id);
        } else {
            const res = await request(list_channel_member(userStore.sessionId, projectStore.curProjectId, channelStore.showDetailChannelId));
            channelMemberIdList = res.info_list.map(item => item.member_user_id);
        }
        const tmpList: MemberInfo[] = [];

        for (const channelMemberId of channelMemberIdList) {
            const member = memberStore.getMember(channelMemberId);
            if (member !== undefined) {
                tmpList.push(member.member);
            }
        }
        setMemberList(tmpList);
    };

    const initOwnerMember = () => {
        const memberUserId = channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.owner_user_id;
        if (memberUserId != undefined) {
            const member = memberStore.getMember(memberUserId);
            if (member != undefined) {
                setOwnerMember(member.member);
            }
        }
    };

    useEffect(() => {
        loadMemberList();
        initOwnerMember();
    }, [channelStore.showDetailChannelId]);

    return (
        <Modal open title={
            <Space>
                <span>{"#" + channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.basic_info.channel_name ?? ""}</span>
                {channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.user_channel_perm.can_update && (
                    <Button type="link" onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        channelStore.updateChannelId = channelStore.showDetailChannelId;
                    }}>修改频道</Button>
                )}
                {channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.user_channel_perm.can_leave && (
                    <Button type="link" danger
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            channelStore.exitChannelId = channelStore.showDetailChannelId;
                        }}>退出频道</Button>
                )}
            </Space>
        }
            footer={null}
            mask={false}
            style={{ width: "800px" }}
            bodyStyle={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
            onCancel={e => {
                e.stopPropagation();
                e.preventDefault();
                channelStore.showDetailChannelId = "";
            }}>
            <Descriptions bordered>
                <Descriptions.Item label="创建人" span={1}>
                    <div style={{ width: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer" }}>
                        <UserPhoto logoUri={ownerMember?.logo_uri ?? ""} style={{ width: "36px", marginRight: "10px", borderRadius: "36px" }} /><span>{ownerMember?.display_name ?? ""}</span>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    <div>
                        {moment(channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.create_time ?? 0).format("YYYY-MM-DD")}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="频道状态">
                    {channelStore.getChannel(channelStore.showDetailChannelId)?.channelInfo.closed === true ? "关闭" : "激活"}
                </Descriptions.Item>
                <Descriptions.Item label="在线用户" span={3}>
                    <List rowKey="member_user_id" dataSource={memberList.filter(item => item.online)} grid={{ gutter: 16 }} renderItem={member => (
                        <List.Item >
                            <Popover trigger="click" placement='left' content={<MemberInfoPanel memberId={member.member_user_id} showLink={true} hideMemberInfo={() => { }} />}>
                                <div style={{ width: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer" }}>
                                    <UserPhoto logoUri={member.logo_uri} style={{ width: "36px", marginRight: "10px", borderRadius: "36px" }} /><span>{member.display_name}</span>
                                </div>
                            </Popover>
                        </List.Item>
                    )} />
                </Descriptions.Item>
                <Descriptions.Item label="离线用户" span={3}>
                    <List rowKey="member_user_id" dataSource={memberList.filter(item => !item.online)} grid={{ gutter: 16 }} renderItem={member => (
                        <List.Item >
                            <Popover trigger="click" placement='left' content={<MemberInfoPanel memberId={member.member_user_id} showLink={true} hideMemberInfo={() => { }} />}>
                                <div style={{ width: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer" }}>
                                    <UserPhoto logoUri={member.logo_uri} style={{ width: "36px", marginRight: "10px", borderRadius: "36px", filter: "grayscale(100%)" }} /><span>{member.display_name}</span>
                                </div>
                            </Popover>
                        </List.Item>
                    )} />
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default observer(ChannelDetailModal);