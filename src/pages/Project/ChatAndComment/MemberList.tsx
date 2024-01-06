import React, { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { Button, List, Space } from "antd";
import { useStores } from "@/hooks";
import type { WebMemberInfo } from "@/stores/member";
import { useHistory } from "react-router-dom";
import { APP_PROJECT_OVERVIEW_PATH } from "@/utils/constant";
import UserPhoto from "@/components/Portrait/UserPhoto";

const MemberList = () => {
    const history = useHistory();

    const appStore = useStores('appStore');
    const userStore = useStores('userStore');
    const memberStore = useStores('memberStore');

    const [memberList, setMemberList] = useState<WebMemberInfo[]>([]);

    useEffect(() => {
        const tmpList = [] as WebMemberInfo[];
        const my = memberStore.getMember(userStore.userInfo.userId);
        if (my != undefined) {
            tmpList.push(my);
        }
        const onlineList = memberStore.memberList.filter(item => item.member.online).filter(item => item.member.member_user_id != userStore.userInfo.userId);
        const offlineList = memberStore.memberList.filter(item => !item.member.online).filter(item => item.member.member_user_id != userStore.userInfo.userId);
        tmpList.push(...onlineList);
        tmpList.push(...offlineList);
        setMemberList(tmpList);
    }, [memberStore.memberList]);

    return (
        <List dataSource={memberList} style={{paddingRight:"10px"}} renderItem={item => (
            <List.Item key={item.member.member_user_id} extra={item.member.online ? "在线" : "离线"}>
                <Button type="text" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (appStore.inEdit) {
                        appStore.showCheckLeave(() => {
                            memberStore.showDetailMemberId = item.member.member_user_id;
                            history.push(APP_PROJECT_OVERVIEW_PATH);
                        });
                    } else {
                        memberStore.showDetailMemberId = item.member.member_user_id;
                        history.push(APP_PROJECT_OVERVIEW_PATH);
                    }
                }}>
                    <Space>
                        <UserPhoto logoUri={item.member.logo_uri} style={{ width: "16px", borderRadius: "10px", filter: item.member.online ? "" : "grayscale(100%)" }} />
                        {item.member.display_name}
                    </Space>
                </Button>
            </List.Item>
        )} />
    );
};

export default observer(MemberList);