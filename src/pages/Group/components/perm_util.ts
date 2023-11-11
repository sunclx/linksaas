import type { GroupMemberPerm } from "@/api/group_member";
import type { CheckboxOptionType } from "antd/es/checkbox";

export const MEMBER_PERM_OPTION_LIST: CheckboxOptionType[] = [
    {
        label: "邀请成员",
        value: "can_invite",
    },
    {
        label: "查看成员",
        value: "can_list_member",
    },
    {
        label: "删除成员",
        value: "can_remove_member",
    },
    {
        label: "更新权限",
        value: "can_update_member",
    },
    {
        label: "发布帖子",
        value: "can_add_post",
    },
    {
        label: "修改其他人帖子",
        value: "can_update_post",
    },
    {
        label: "删除其他人帖子",
        value: "can_remove_post",
    },
    {
        label: "标记精华帖",
        value: "can_mark_essence",
    },
    {
        label: "增加评论",
        value: "can_add_comment",
    },
    {
        label: "删除其他人评论",
        value: "can_remove_comment",
    },
    {
        label: "修改其他人评论",
        value: "can_update_comment",
    },
];

export const calcMemberPerm = (perm: GroupMemberPerm): string[] => {
    const retList: string[] = [];
    if(perm.can_invite){
        retList.push("can_invite");
    }
    if(perm.can_list_member){
        retList.push("can_list_member");
    }
    if(perm.can_remove_member) {
        retList.push("can_remove_member");
    }
    if(perm.can_update_member) {
        retList.push("can_update_member");
    }
    if(perm.can_add_post) {
        retList.push("can_add_post"); 
    }
    if(perm.can_update_post) {
        retList.push("can_update_post");
    }
    if(perm.can_remove_post) {
        retList.push("can_remove_post");
    }
    if(perm.can_mark_essence) {
        retList.push("can_mark_essence"); 
    }
    if(perm.can_add_comment) {
        retList.push("can_add_comment");
    }
    if(perm.can_remove_comment) {
        retList.push("can_remove_comment");
    }
    if(perm.can_update_comment) {
        retList.push("can_update_comment");
    }
    return retList;
}