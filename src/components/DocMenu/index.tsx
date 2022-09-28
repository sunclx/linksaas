import { useStores } from '@/hooks';
import type { FILTER_DOC_ENUM } from '@/utils/constant';
import { APP_PROJECT_DOC_PRO_PATH } from '@/utils/constant';
import { APP_PROJECT_DOC_CB_PATH, filterDocItemList } from '@/utils/constant';
import { Collapse, Popover } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ProDoc from './components/ProDoc';
import RecycleBin from './components/RecycleBin';
import s from './index.module.less';
import bottom_arrow from '@/assets/allIcon/bottom_arrow.png';
import { ReactComponent as ContentMansvg } from '@/assets/svg/content_man.svg';

const { Panel } = Collapse;

// 过滤项目
const RendeFilterMenu = observer(() => {
  const docStore = useStores('docStore');
  const filterChange = (type: FILTER_DOC_ENUM) => {
    docStore.setfilterDocType(type);
  };
  return (
    <div className={s.moremenu} onClick={(e) => e.stopPropagation()}>
      {filterDocItemList.map((item) => (
        <div
          key={item.value}
          className={classNames(s.item, item.value === docStore.filterDocType ? s.selected : '')}
          onClick={(e) => {
            e.stopPropagation();
            filterChange(item.value);
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
});

const Header: React.FC<{ currentpath: string }> = ({ currentpath }) => {
  console.log(2222222);

  const history = useHistory();
  const memberStore = useStores('memberStore');
  const userStore = useStores('userStore');
  const docStore = useStores('docStore');
  const isAdmin = useRef(false);
  const memberInfo = memberStore.getMember(userStore.userInfo.userId);
  if (memberInfo !== undefined) {
    if (memberInfo.member.can_admin) {
      isAdmin.current = true;
    }
  }

  const addDoc = () => {
    docStore.setCurDoc('', true, false);
    history.push(APP_PROJECT_DOC_PRO_PATH);
  };

  const docRightTop = () => {
    return (
      <div className={s.submenu_icon_wrap}>
        <Popover
          placement="bottomLeft"
          trigger="click"
          overlayClassName="popover"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        >
          <a
            className={s.icon_wrap}
            onClick={() => {
              docStore.setShowProDoc(true);
              addDoc();
            }}
          >
            <i className={s.add} />
          </a>
        </Popover>
        <Popover
          placement="bottomLeft"
          content={<RendeFilterMenu />}
          trigger="click"
          overlayClassName="popover"
          // @ts-ignore
          onClick={(e) => e.stopPropagation()}
        >
          <a className={s.icon_wrap}>
            <i className={s.more} />
          </a>
        </Popover>
      </div>
    );
  };

  return (
    <div className={s.doc_menu_wrap}>
      <Collapse
        accordion
        className={s.collapse_wrap}
        bordered={false}
        defaultActiveKey={['doc']}
        expandIcon={({ isActive }) => (
          <img src={bottom_arrow} style={{ transform: `rotate(${!isActive ? -90 : 0}deg)` }} />
        )}
      >
        <Panel extra={docRightTop()} header="项目文档" key="doc" className={s.title}>
          <ProDoc />
        </Panel>
        <Panel header="回收站" key="recycle_bin">
          <RecycleBin />
        </Panel>
      </Collapse>
      <div
        className={classNames(s.content_block, currentpath === APP_PROJECT_DOC_CB_PATH && s.active)}
        onClick={() => {
          history.push(APP_PROJECT_DOC_CB_PATH);
          docStore.setShowProDoc(false);
        }}
      >
        <ContentMansvg /> 可变内容块管理
      </div>
    </div>
  );
};
export default observer(Header);
