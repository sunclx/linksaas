import PasswordModal from '@/components/PasswordModal';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import React from 'react';
import s from './index.module.less';
import { useHistory, useLocation } from 'react-router-dom';
import { USER_LOGIN_PATH, WORKBENCH_PATH } from '@/utils/constant';
import { useStores } from '@/hooks';
import Card from './components/Card';
import InfoCount from './components/InfoCount';
import Backlog from './components/Backlog';
import Myproject from './components/MyProject';
import Record from './components/Record';
import { useSetState } from 'ahooks';
import type { PageOptType } from '../Project/Task';
import { Button, Space } from 'antd';
import { observer } from 'mobx-react';


const Workbench: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const [passwordModal, setPasswordModal] = useState(type === 'resetPassword');
  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const appStore = useStores('appStore');

  const [pageOpt, setPageOpt] = useSetState<Partial<PageOptType>>({
    pageSize: 10,
    pageNum: 1,
    total: 0,
  });

  useMemo(() => {
    projectStore.setCurProjectId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.workbench_wrap}>
      <Card className={s.infoCount_wrap} childStyle={{ height: '100%' }}>
        {!userStore.isResetPassword && <InfoCount total={pageOpt.total} />}
      </Card>
      <Card className={s.backlog_wrap} title="我的待办">
        {!userStore.isResetPassword && <Backlog pageOpt={pageOpt} setPageOpt={setPageOpt} />}
      </Card>
      <div className={s.my_wrap}>
        <Card className={s.project_wrap} title="我的项目" extraContent={(
          <Space style={{ position: "absolute", right: "20px", top: "-5px" }}>
            {projectStore.projectList.length == 0 && (<>
              <Button type="ghost" onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                appStore.showJoinProject = true;
              }}>加入项目</Button>
              <Button type="ghost" onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                appStore.showCreateProject = true;
              }}>创建新项目</Button>
            </>)
            }
          </Space>
        )}>
          {!userStore.isResetPassword && <Myproject />}
        </Card>
        <Card className={s.record_wrap} title="我的工作记录">
          {!userStore.isResetPassword && <Record />}
        </Card>
      </div>

      {passwordModal && (
        <PasswordModal
          visible={passwordModal}
          type="resetPassword"
          onCancel={(bool) => {
            userStore.logout();
            if (userStore.isResetPassword) {
              history.push(USER_LOGIN_PATH);
            }
            setPasswordModal(bool);
          }}
          onSuccess={async () => {
            history.push(WORKBENCH_PATH);
            setPasswordModal(false);
          }}
        />
      )}
    </div>
  );
};

export default observer(Workbench);
