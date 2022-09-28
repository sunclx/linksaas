import React, { useEffect, useState } from 'react';
import { useStores } from '@/hooks';
import styles from './ChannelHeader.module.less';
import { observer } from 'mobx-react';
import MemberList from './MemberList';
import { Popover } from 'antd';
import { LIST_CHAN_SCOPE_INCLUDE_ME } from '@/api/project_channel';
import { ReactComponent as Groupsvg } from '@/assets/svg/group.svg';

const ChannelHeader = observer(() => {
  const channelStore = useStores('channelStore');
  const [visible, setVisible] = useState(false);

  const handlePopover = (isShow: boolean) => {
    setVisible(isShow);
  };

  useEffect(() => {}, []);

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>
        #{channelStore.curChannel?.channelInfo.basic_info.channel_name || ''}
      </h2>
      {channelStore.channelScope == LIST_CHAN_SCOPE_INCLUDE_ME && channelStore.curChannelId != '' && (
        <Popover
          content={() => <MemberList handlePopover={handlePopover} />}
          placement="bottomRight"
          overlayClassName="popover"
          onVisibleChange={handlePopover}
          autoAdjustOverflow={false}
          visible={visible}
          trigger="hover"
        >
          {/* <a className={styles.btn_member}>
            频道成员
            <i className={styles.icon_arrow} />
          </a> */}
          <Groupsvg />
        </Popover>
      )}
    </header>
  );
});

export default ChannelHeader;
