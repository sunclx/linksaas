import React, { useEffect, useState } from 'react';
import s from './infoCount.module.less';
import memberIcon from '@/assets/allIcon/icon-member.png';
import { useStores } from '@/hooks';
import UserPhoto from '@/components/Portrait/UserPhoto';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { request } from '@/utils/request';
import { get_my_todo_status } from "@/api/project_issue";
import MyTodoListModal from './MyTodoListModal';
import { useHistory } from 'react-router-dom';
import { APP_PROJECT_MANAGER_PATH } from '@/utils/constant';



const InfoCount = () => {
  const history = useHistory();

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const [myTodoCount, setMyTodoCount] = useState(0);
  const [showMyTodoModal, setShowMyTodoModal] = useState(false);

  const loadMyTodoCount = async () => {
    if (userStore.sessionId == "") {
      return;
    }
    const res = await request(get_my_todo_status({
      session_id: userStore.sessionId,
    }));
    setMyTodoCount(res.total_count);
  };

  useEffect(() => {
    loadMyTodoCount();
  }, [userStore.sessionId]);

  return (
    <div className={s.infoCount_wrap}>
      <div className={s.left_wrap}>
        <UserPhoto logoUri={userStore.userInfo.logoUri} />
        <div className={s.content}>
          <div className={s.name}>欢迎您！{userStore.userInfo.displayName}</div>
          <div
            className={s.account}
            onClick={() => {
              if (userStore.sessionId == "") {
                userStore.showUserLogin = () => { };
              } else {
                userStore.accountsModal = true;
              }

            }}
          >
            <img src={memberIcon} alt="" /> {userStore.sessionId == "" ? "请登录" : "账号管理"}
          </div>
        </div>
      </div>
      {userStore.sessionId != "" && (
        <div className={s.right_wrap}>
          <div className={s.item}>
            <div>当前待办</div>
            <div>
              <Button type='text' style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px", lineHeight: "28px" }}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowMyTodoModal(true);
                }}>
                {myTodoCount}
              </Button>
            </div>
          </div>

          <div className={s.item}>
            <div>当前项目数</div>
            <div>
              <Button type='text' style={{ minWidth: 0, padding: "0px 0px", fontSize: "20px", lineHeight: "28px" }}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  history.push(APP_PROJECT_MANAGER_PATH);
                }}>
                {projectStore.projectList.filter((item) => !item.closed).length}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMyTodoModal == true && (
        <MyTodoListModal onCount={value => setMyTodoCount(value)} onClose={() => setShowMyTodoModal(false)} />
      )}
    </div>
  );
};

export default observer(InfoCount);
