import React, { useEffect, useState } from 'react';
// import s from '../index.module.less';
import * as vcApi from '@/api/project_vc';
import { observer } from 'mobx-react';
import { Table, Modal, Button, message } from 'antd';
import moment from 'moment';
import type { ColumnsType } from 'antd/lib/table';
import { request } from '@/utils/request';
import { useStores } from '@/hooks';
import AddBlock from './AddBlock';
import UpdateColl from './UpdateColl';
import BlockContent from './BlockContent';
import UpdataBlock from './UpdateBlock';
import { writeText } from '@tauri-apps/api/clipboard';


import s from './Coll.module.less';

export interface CollProps {
  collInfo: vcApi.BlockColl;
  active: boolean;
  onUpdateColl: () => void;
  showAddBlock: boolean;
  setShowAddBlock: React.Dispatch<React.SetStateAction<boolean>>;
  showUpdateColl: boolean;
  setShowUpdateColl: React.Dispatch<React.SetStateAction<boolean>>;
}

const Coll: React.FC<CollProps> = (props) => {
  const { showAddBlock, setShowAddBlock, showUpdateColl, setShowUpdateColl } = props;
  const [blockList, setBlockList] = useState([] as vcApi.Block[]);
  const [dataVersion, setDataVersion] = useState(0);
  const [showContentBlock, setShowContentBlock] = useState<vcApi.Block | null>(null);
  const [usage, setUsage] = useState('');
  const [updateBlock, setUpdateBlock] = useState<vcApi.Block | null>(null);

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');

  const callRemoveBlock = async (blockId: string) => {
    const block = blockList.find((item) => item.block_id == blockId);
    if (block !== undefined) {
      Modal.confirm({
        title: `是否删除${block.base_info.title}`,
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          request(
            vcApi.remove_block({
              session_id: userStore.sessionId,
              project_id: projectStore.curProjectId,
              block_coll_id: block.block_coll_id,
              block_id: block.block_id,
            }),
          ).then(() => {
            message.info(`成功删除${block.base_info.title}`);
            setDataVersion(dataVersion + 1);
          });
        },
      });
    }
  };

  const callShowContent = (blockId: string) => {
    const block = blockList.find((item) => item.block_id == blockId);
    if (block !== undefined) {
      setShowContentBlock(block);
    }
  };

  const callUpdateBlock = (blockId: string) => {
    const block = blockList.find((item) => item.block_id == blockId);
    if (block !== undefined) {
      setUpdateBlock(block);
    }
  };

  const columns: ColumnsType<vcApi.Block> = [
    {
      title: '名称',
      width: 150,
      render: (_v, record) => {
        return <>{record.base_info.title}</>;
      },
    },
    {
      title: '数据量',
      dataIndex: 'recv_content_count',
      width: 60,
    },
    {
      title: '创建时间',
      dataIndex: 'update_time',
      width: 100,
      render: (_v, record) => {
        return <>{moment(record.update_time).format('YYYY-MM-DD')}</>;
      },
    },
    {
      title: '操作',
      width: 250,
      render: (_v, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setUsage(
                  `curl -X POST -H 'ACCESS_TOKEN:${record.access_token}' '${record.update_url}?type=<type>' -d '<content>'`,
                );
              }}
            >
              调用方法
            </Button>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                callUpdateBlock(record.block_id);
              }}
            >
              重命名
            </Button>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                callShowContent(record.block_id);
              }}
            >
              查看内容
            </Button>
            <Button
              type="link"
              onClick={() => {
                callRemoveBlock(record.block_id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!props.active) {
      return;
    }
    request(
      vcApi.list_block({
        session_id: userStore.sessionId,
        project_id: projectStore.curProjectId,
        block_coll_id: props.collInfo.block_coll_id,
        offset: 0,
        limit: 999,
      }),
    ).then((res) => {
      setBlockList(res.block_list);
    });
  }, [props.active, dataVersion]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={blockList}
        style={{ border: '1px solid #eaeaef', padding: '10px 20px 0' }}
        size="middle"
        pagination={false}
        key={'update_time'}
      />
      {showAddBlock && (
        <AddBlock
          collId={props.collInfo.block_coll_id}
          onOk={() => {
            setDataVersion(dataVersion + 1);
            setShowAddBlock(false);
          }}
          onCancel={() => setShowAddBlock(false)}
        />
      )}

      {showUpdateColl && (
        <UpdateColl
          collInfo={props.collInfo}
          onOk={() => {
            props.onUpdateColl();
            setShowUpdateColl(false);
          }}
          onCancel={() => setShowUpdateColl(false)}
        />
      )}
      {showContentBlock != null && (
        <BlockContent
          blockCollId={props.collInfo.block_coll_id}
          blockId={showContentBlock.block_id}
          blockName={showContentBlock.base_info.title}
          onCancel={() => setShowContentBlock(null)}
        />
      )}
      {updateBlock != null && (
        <UpdataBlock
          block={updateBlock}
          onOk={() => {
            setDataVersion(dataVersion + 1);
            setUpdateBlock(null);
          }}
          onCancel={() => setUpdateBlock(null)}
        />
      )}
      {usage != '' && (
        <Modal
          title="内容块调用说明"
          width={562}
          visible
          footer={null}
          onCancel={() => setUsage('')}
        >
          <div className={s.usage_wrap}>
            <div className={s.usage_item}>
              <div className={s.title}>可变内容块可以通过API接口进行变更</div>
              <div className={s.con_wrap}>
                <div className={s.con_top}>
                  <div className={s.des}>&nbsp;</div>
                  <Button type="link" onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    writeText(`${usage}`);
                    message.success("复制成功");
                  }}>一键复制</Button>
                </div>
                <div className={s.contents}>{usage}</div>
                <div className={s.des}>&lt;type&gt; 内容类型。目前支持text,html,markdown三种类型。</div>
                <div className={s.des}>&lt;content&gt;内容。需要和type对应。</div>
                <div className={s.des}>服务端会保留最后10条更新记录。</div>
              </div>
            </div>

            <div className={s.closebtn}>
              <Button type="primary" onClick={() => setUsage('')}>
                关闭
              </Button>
            </div>
          </div>
          {/* {usage} */}
        </Modal>
      )}
    </div>
  );
};

export default observer(Coll);
