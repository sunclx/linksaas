import React, { useEffect, useState } from 'react';
import CardWrap from '@/components/CardWrap';
import { Table } from 'antd';
import useColums from './components/useColums';
import { useStores } from '@/hooks';
import type { WebMemberInfo } from '@/stores/member';
import Button from '@/components/Button';
import s from './index.module.less';
import { observer } from 'mobx-react';
import { UserAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import RemoveMember from './components/RemoveMember';
import useVisible from '@/hooks/useVisible';
import AddMember from './components/AddMember';

const ProjectMember: React.FC = () => {
  const [removeObj, setRemoveObj] = useVisible<WebMemberInfo>();
  const [addObj, setAddObj] = useVisible<WebMemberInfo>();
  const [isAdmin, setIsAdmin] = useState(false);

  const { columns } = useColums({
    setRemoveObj,
    isAdmin,
  });
  const appStore = useStores('appStore');
  const memberStore = useStores('memberStore');
  const projectStore = useStores('projectStore');

  const init = async () => {
    const currentMemberInfo = memberStore.memberList.find((item) => item.member.is_cur_user);
    if (!currentMemberInfo?.member.can_admin) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(true);
  };

  useEffect(() => {
    init();
  }, [memberStore.memberList]);

  return (
    <CardWrap title="项目成员列表" halfContent>
      <div className={s.member_wrap}>
        <div className={s.top}>
          <h2>
            成员列表 <span>({memberStore.memberList.length})</span>
          </h2>
          {!(projectStore.curProject?.closed) && isAdmin && appStore.clientCfg?.can_invite && (
            <Button type="link" onClick={() => setAddObj(true)}>
              <UserAddOutlined />
              添加成员
            </Button>
          )}
        </div>
        <div className={s.table_wrap}>
          <Table<WebMemberInfo>
            rowKey={(e) => e?.member?.member_user_id}
            scroll={{ y: 'calc(100vh - 260px)' }}
            columns={columns as ColumnsType<WebMemberInfo>}
            dataSource={memberStore.memberList}
            pagination={false}
          />
        </div>
        <RemoveMember
          visible={removeObj.visible}
          params={removeObj.param}
          onChange={setRemoveObj}
        />
        {addObj.visible && <AddMember visible={addObj.visible} onChange={setAddObj} />}
      </div>
    </CardWrap>
  );
};
export default observer(ProjectMember);
