import { Button, message, Popover, Modal } from 'antd';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import iconEdit from '@/assets/allIcon/icon-edit.png';
import Input from 'antd/lib/input/Input';
import { CheckOutlined } from '@ant-design/icons';
import PasswordModal from '../PasswordModal';
import { useStores } from '@/hooks';
import { observer } from 'mobx-react';
import { request } from '@/utils/request';
import { update } from '@/api/user';
import { ReactComponent as Quitsvg } from '@/assets/svg/quit.svg';
import Profile from '../Profile';
import * as fsApi from '@/api/fs';
import UserPhoto from '@/components/Portrait/UserPhoto';
import { useHistory, useLocation } from 'react-router-dom';
import { PUB_RES_PATH, WORKBENCH_PATH } from '@/utils/constant';


const Portrait = ({ ...props }) => {
  const location = useLocation();
  const history = useHistory();

  const [isSetName, setIsSetName] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const userStore = useStores('userStore');
  const [name, setSetName] = useState(userStore.userInfo.displayName);
  const [pictrueListVisible, setPictrueListVisible] = useState(false);

  const changeName = async () => {
    try {
      await request(
        update(userStore.sessionId, {
          display_name: name,
          logo_uri: userStore.userInfo.logoUri,
        }),
      );
      userStore.updateDisplayName(name);
      message.success('修改昵称成功');
      setIsSetName(false);
    } catch (error) { }
  };

  const uploadFile = async (data: string | null) => {
    if (data === null) {
      return;
    }
    //上传文件
    const uploadRes = await request(fsApi.write_file_base64(userStore.sessionId, userStore.userInfo.userFsId, "portrait.png", data, ""));
    console.log(uploadRes);
    if (!uploadRes) {
      return;
    }
    //设置文件owner
    const ownerRes = await request(fsApi.set_file_owner({
      session_id: userStore.sessionId,
      fs_id: userStore.userInfo.userFsId,
      file_id: uploadRes.file_id,
      owner_type: fsApi.FILE_OWNER_TYPE_USER_PHOTO,
      owner_id: userStore.userInfo.userId,
    }));
    if (!ownerRes) {
      return;
    }
    //设置头像url
    const logoUri = `fs://localhost/${userStore.userInfo.userFsId}/${uploadRes.file_id}/portrait.png`;
    const updateRes = await request(update(userStore.sessionId, {
      display_name: userStore.userInfo.displayName,
      logo_uri: logoUri,
    }));
    if (updateRes) {
      setPictrueListVisible(false);
    }
    userStore.updateLogoUri(logoUri);
  };

  const renderContent = () => {
    return (
      <div className={s.portrait_wrap}>
        <div className={s.portrait_img} onClick={() => {
          setPictrueListVisible(true);
          userStore.accountsModal = false;
        }}>
          <UserPhoto logoUri={userStore.userInfo.logoUri ?? ""} />
          <div>更换</div>
          {/* </Popover> */}
        </div>
        <div className={s.content_wrap}>
          <div className={s.content_itme}>
            <span>昵 &nbsp;&nbsp; 称</span>
            {!isSetName ? (
              <div>
                {name}
                <img src={iconEdit} alt="" onClick={() => setIsSetName(true)} />
              </div>
            ) : (
              <div className={s.name_input_wrap}>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setSetName(e.target.value);
                  }}
                />
                <Button type="primary" disabled={!name.length} onClick={changeName}>
                  <CheckOutlined />
                </Button>
              </div>
            )}
          </div>
          <div className={s.content_itme}>
            <span>用户名</span>
            <div>{userStore.userInfo.userName}</div>
          </div>
        </div>
        <div
          className={s.changePassword}
          onClick={() => {
            setPasswordVisible(true);
            userStore.accountsModal = false;
          }}
        >
          修改密码
        </div>
        <div
          className={s.exit}
          onClick={() => {
            setShowExit(true);
            userStore.accountsModal = false;
          }}
        >
          <Quitsvg />
          退出登录
        </div>
        {passwordVisible && (
          <PasswordModal {...props} visible={passwordVisible} onCancel={setPasswordVisible} />
        )}
        {showExit && (
          <Modal
            open={showExit}
            title="退出"
            onCancel={() => setShowExit(false)}
            onOk={() => {
              userStore.logout();
              if (location.pathname.startsWith(WORKBENCH_PATH) || location.pathname.startsWith(PUB_RES_PATH)) {
                //do nothing
              } else {
                history.push(WORKBENCH_PATH);
              }
            }}
          >
            <p style={{ textAlign: 'center' }}>是否确认退出?</p>
          </Modal>
        )}
        <Profile
          visible={pictrueListVisible}
          defaultSrc={userStore.userInfo.logoUri ?? ""}
          onCancel={() => setPictrueListVisible(false)}
          onOK={(data: string | null) => uploadFile(data)}
        />
      </div>
    );
  };

  if (userStore.sessionId == "") {
    return (
      <div className={s.user} onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        userStore.showUserLogin = () => { };
      }}>
        <div className={s.avatar}>
          <UserPhoto logoUri={userStore.userInfo.logoUri ?? ''} />
        </div>
        <div className={s.name}>请登录</div>
      </div>
    )
  }
  return (
    <Popover
      content={renderContent()}
      placement="bottomLeft"
      trigger="click"
      open={userStore.accountsModal}
      overlayInnerStyle={{
        marginLeft: "10px",
        marginTop: "-30px"
      }}
      onOpenChange={v => userStore.accountsModal = v}
    >
      {props.children}
    </Popover>
  );
};

export default observer(Portrait);
