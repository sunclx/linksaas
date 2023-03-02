import React, { useEffect, useState } from 'react';
import { message, Select } from 'antd';
import type { WebMemberInfo } from '@/stores/member';
import * as API from '@/api/project_member';
import iconUnfold from '@/assets/allIcon/icon-unfold.png';
import { MinusCircleOutlined } from '@ant-design/icons';
import Button from '@/components/Button';
import type { ColumnType } from 'antd/lib/table';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import UserPhoto from '@/components/Portrait/UserPhoto';


const { Option } = Select;

type UseColumsType = {
  setRemoveObj: (boo: boolean, params: WebMemberInfo) => void;
  onChangeOwner: (memberUserId: string) => void;
};

const useColums = (props: UseColumsType) => {
  const { setRemoveObj, onChangeOwner } = props;
  const [roleList, setRoleList] = useState<API.RoleInfo[]>();

  const projectStore = useStores("projectStore");
  const userStore = useStores("userStore");
  const memberStore = useStores("memberStore");

  const getRoleList = async () => {
    const res = await request(API.list_role(userStore.sessionId, projectStore.curProjectId));
    if (res) {
      setRoleList(res.role_list);
    }
  };

  useEffect(() => {
    if (projectStore.isAdmin) {
      getRoleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectStore.isAdmin]);


  // 修改角色
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChangeRole = async (id: string, row: WebMemberInfo) => {
    if (id == "") {
      onChangeOwner(row.member.member_user_id);
      return;
    }
    const res = await request(
      API.set_member_role(userStore.sessionId, projectStore.curProjectId, id, row.member.member_user_id),
    );
    if (res) {
      memberStore.updateMemberRole(row.member.member_user_id, id);
      message.success('修改角色成功');
    }
  };

  const columns: (ColumnType<WebMemberInfo> & { isShow?: boolean })[] = [
    {
      title: '成员',
      dataIndex: ['member', 'display_name'],
      isShow: true,
      render: (text: string, row: WebMemberInfo) => (
        <div>
          <UserPhoto logoUri={row.member.logo_uri ?? ""} width="30px" style={{
            marginRight: '5px',
            borderRadius: '50px',
            border: '1px solid #ddd',
          }} />
          {text}
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: ['member', 'role_id'],
      width: projectStore.isAdmin ? 100 : 200,
      isShow: true,
      align: 'center',
      render: (v: string, row: WebMemberInfo) => {
        return row.member.is_project_owner ? (
          <span>超级管理员</span>
        ) : projectStore.isAdmin ? (
          <Select
            value={v}
            bordered={false}
            style={{ width: 100 }}
            dropdownMatchSelectWidth={false}
            placement={'bottomRight'}
            onChange={(e) => onChangeRole(e, row)}
            suffixIcon={<img src={iconUnfold} style={{ width: '18px' }} />}
          >
            {projectStore.curProject?.owner_user_id == userStore.userInfo.userId && (
              <Option value="">
                超级管理员
              </Option>
            )}
            {roleList?.map((item) => {
              return (
                <Option value={item.role_id} key={item.role_id}>
                  {item.basic_info.role_name}
                </Option>
              );
            })}
          </Select>
        ) : (
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {row.member.role_name}
          </div>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      className: `${!projectStore.isAdmin && 'notshow'}`,
      isShow: projectStore.isAdmin,
      render: (row: WebMemberInfo) => (
        <Button
          type="link"
          onClick={() => {
            setRemoveObj(true, row);
          }}
        >
          <MinusCircleOutlined />
          移除
        </Button>
      ),
    },
  ];
  const columns1 = columns.filter((item) => item?.isShow);
  return { columns: columns1 };
};

export default useColums;
