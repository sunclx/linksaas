import type { FC } from 'react';
import React from 'react';
import s from './infoCount.module.less';
import memberIcon from '@/assets/allIcon/icon-member.png';
import { useStores } from '@/hooks';
import UserPhoto from '@/components/Portrait/UserPhoto';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { WORKBENCH_PATH } from '@/utils/constant';


type InfoCountProps = {
  total: number | undefined;
};
const InfoCount: FC<InfoCountProps> = ({ total }) => {
  const history = useHistory();

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  return (
    <div className={s.infoCount_wrap}>
      <div className={s.left_wrap}>
        <UserPhoto logoUri={userStore.userInfo.logoUri} />
        <div className={s.content}>
          <div className={s.name}>欢迎您！{userStore.userInfo.displayName}</div>
          <div
            className={s.account}
            onClick={() => {
              userStore.setAccountsModal(true);
            }}
          >
            <img src={memberIcon} alt="" /> 账号管理
          </div>
        </div>
      </div>
      <div className={s.right_wrap}>
        <div className={s.item}>
          <div>当前待办</div>
          <div>
            <Button type='text' style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px", lineHeight: "28px" }} disabled={total == 0}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                history.push(`${WORKBENCH_PATH}?tab=myIssue&userAction=true`);
              }}>
              {total}
            </Button>
          </div>
        </div>

        <div className={s.item}>
          <div>当前项目数</div>
          <div>
            <Button type='text' style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px", lineHeight: "28px" }}
            onClick={e=>{
              e.stopPropagation();
              e.preventDefault();
              history.push(`${WORKBENCH_PATH}?tab=myProject&userAction=true`);
            }}>
              {projectStore.projectList.filter((item) => !item.closed).length}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(InfoCount);
