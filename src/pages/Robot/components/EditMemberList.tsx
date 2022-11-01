import React, { useState } from "react";
import { observer } from 'mobx-react';
import { EditOutlined } from "@ant-design/icons";
import { useStores } from "@/hooks";
import UserPhoto from "@/components/Portrait/UserPhoto";
import { Select } from "antd";

interface EditMemberListProps {
    editable: boolean;
    memberIdList: string[];
    showEditIcon: boolean;
    onAddMember: (memberId: string) => Promise<boolean>;
    onRemoveMember: (memberId: string) => Promise<boolean>;
}

export const EditMemberList: React.FC<EditMemberListProps> = (props) => {
    const memberStore = useStores('memberStore');

    const [inEdit, setInEdit] = useState(false);
    const [memberIdList, setMemberIdList] = useState(props.memberIdList);

    const changeMember = async (newMemberIdList: string[]) => {
        //检查是否是删除
        let removeMemberId = ""
        memberIdList.forEach(item => {
            if (!newMemberIdList.includes(item)) {
                removeMemberId = item;
            }
        })
        if (removeMemberId != "") {
            const res = await props.onRemoveMember(removeMemberId);
            if (!res) {
                return;
            }
        }
        //检查是否是增加
        let addMemberId = "";
        newMemberIdList.forEach(item => {
            if (!memberIdList.includes(item)) {
                addMemberId = item;
            }
        })
        if (addMemberId != "") {
            const res = await props.onAddMember(addMemberId);
            if (!res) {
                return;
            }
        }
        setMemberIdList(newMemberIdList);
    }

    return (
        <div onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (props.editable) {
                setInEdit(true);
            }
        }}>
            {!inEdit && (<div>
                {memberStore.memberList.filter(item => memberIdList.includes(item.member.member_user_id)).map(member => (
                    <span key={member.member.member_user_id} style={{ display: "inline-block", padding: "4px 4px", margin: "4px 4px", backgroundColor: "#eee" }}>
                        <UserPhoto logoUri={member.member.logo_uri} style={{
                            with: "18px",
                            height: "18px",
                            borderRadius: "999px",
                            pointerEvent: "none",
                            marginRight: "4px",
                        }} />
                        {member.member.display_name}
                    </span>
                ))}
                {props.editable && props.showEditIcon &&
                    <a><EditOutlined /></a>
                }</div>)}
            {inEdit && (
                <Select
                    autoFocus
                    mode="multiple"
                    showSearch={false}
                    value={memberIdList}
                    open={true}
                    onChange={value => changeMember(value)}
                    onBlur={()=>setInEdit(false)}
                    style={{width:"100%"}}
                >
                    {memberStore.memberList.map(item => (
                        <Select.Option key={item.member.member_user_id} value={item.member.member_user_id}>
                            <UserPhoto logoUri={item.member.logo_uri} style={{
                                with: "18px",
                                height: "18px",
                                borderRadius: "999px",
                                pointerEvent: "none",
                                marginRight: "4px",
                            }} />
                            {item.member.display_name}
                        </Select.Option>
                    ))}
                </Select>
            )}
        </div>
    );
};

export default observer(EditMemberList);