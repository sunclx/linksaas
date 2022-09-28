import Button from '@/components/Button';
import { Collapse, message } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import s from './index.module.less';
import AddColl from './components/AddColl';
import Coll from './components/Coll';
import * as vcApi from '@/api/project_vc';
import { request } from '@/utils/request';
import { observer } from 'mobx-react';
import { useStores } from '@/hooks';

import bottom_arrow from '@/assets/allIcon/bottom_arrow.png';
import { DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import ActionModal from '@/components/ActionModal';

const ContentBlack = () => {
  const [showAddColl, setShowAddColl] = useState(false);

  const [dataVersion, setDataVersion] = useState(0);
  const [collList, setCollList] = useState([] as vcApi.BlockColl[]);
  const [activeList, setActiveList] = useState([] as string[]);

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showUpdateColl, setShowUpdateColl] = useState(false);
  const [showRemoveColl, setShowRemoveColl] = useState(false);
  const [blockCollItem, setBlockCollItem] = useState<vcApi.BlockColl>();

  const removeColl = async (collId: string) => {
    const res = await request(
      vcApi.remove_block_coll({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        block_coll_id: collId,
      }),
    );
    if (res) {
      message.success('删除可变内容集合成功');
      setDataVersion(dataVersion + 1);
      setShowRemoveColl(false);
      setBlockCollItem(undefined);
    }
  };

  useEffect(() => {
    request(
      vcApi.list_block_coll({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        offset: 0,
        limit: 999,
      }),
    ).then((res) => {
      setCollList(res.block_coll_list);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion, projectStore.curProjectId]);

  return (
    <div className={s.content_black_wrap}>
      <div className={s.content_black_top}>
        <div className={s.title}>
          可变内容块
          <span title="可以被文档引用的内容块。内容块可以使用API进行更新。一般和研发自动化体系联合使用。">
            ?
          </span>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddColl(true);
          }}
        >
          <PlusOutlined /> 新增内容块组
        </Button>
      </div>
      <Collapse
        className={s.collapse_wrap}
        bordered={false}
        defaultActiveKey={[1]}
        expandIcon={({ isActive }) => (
          <img src={bottom_arrow} style={{ transform: `rotate(${!isActive ? -90 : 0}deg)` }} />
        )}
        onChange={(key) => {
          if (Array.isArray(key)) {
            setActiveList(key);
          } else {
            setActiveList([key]);
          }
        }}
      >
        {collList.map((item) => (
          <Collapse.Panel
            header={item.base_info.title}
            key={item.block_coll_id}
            className={s.item_black}
            extra={
              <div
                className={s.black_operation}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <PlusOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowAddBlock(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <SettingOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowUpdateColl(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {item.block_count == 0 && (
                  <DeleteOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setBlockCollItem(item);
                      setShowRemoveColl(true);
                      // removeColl(item.block_coll_id);
                    }}
                  />
                )}
              </div>
            }
          >
            <Coll
              collInfo={item}
              active={activeList.includes(item.block_coll_id)}
              onUpdateColl={() => {
                setDataVersion(dataVersion + 1);
              }}
              showAddBlock={showAddBlock}
              setShowAddBlock={setShowAddBlock}
              showUpdateColl={showUpdateColl}
              setShowUpdateColl={setShowUpdateColl}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
      {showAddColl && (
        <AddColl
          onOk={() => {
            setDataVersion(dataVersion + 1);
            setShowAddColl(false);
          }}
          onCancel={() => setShowAddColl(false)}
        />
      )}
      <ActionModal
        title="删除内容块组"
        width={330}
        visible={showRemoveColl}
        onCancel={() => {
          setShowRemoveColl(false);
          setBlockCollItem(undefined);
        }}
        onOK={() => {
          removeColl(blockCollItem?.block_coll_id || '');
        }}
      >
        <div style={{ textAlign: 'center' }}>
          是否确认要删除文档块组 {blockCollItem?.base_info.title} ?
        </div>
      </ActionModal>
    </div>
  );
};

export default observer(ContentBlack);
