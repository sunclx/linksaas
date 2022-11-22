import React, { useEffect, useState } from 'react';
import styles from './CreateAppraise.module.less';
import ActionModal from '@/components/ActionModal';
import { useStores } from '@/hooks';
import { Form, Input, Radio, Select } from 'antd';
import Button from '@/components/Button';
import { observer, useLocalObservable } from 'mobx-react';
import type { RadioChangeEvent } from 'antd';
import { request } from '@/utils/request';
import { create } from '@/api/project_appraise';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import UserPhoto from '@/components/Portrait/UserPhoto';


type CreateAppraiseProps = {
  visible: boolean;
  onChange: (bool: boolean) => void;
}

type Values = {
  group?: number,
  title?: string
}

enum AppraiseType {
  ALL = 0,
  FILTER = 1,
  SELECT = 2
}

// 发起互评
const CreateAppraise: React.FC<CreateAppraiseProps> = (props) => {
  const { visible, onChange } = props;

  const userStore = useStores('userStore');
  const projectStore = useStores('projectStore');
  const memberStore = useStores('memberStore');
  const appraiseStore = useStores('appraiseStore');
  const [selectedItems, setSelectedItems] = useState<CustomTagProps[]>([]);
  const [otherItems, setOtherItems] = useState<CustomTagProps[]>([]); //非自定义情况下

  const localStore = useLocalObservable(() => ({
    filterMemberIdList: [] as string[],
    allMemberIdList: [] as string[],
    form: {
      group: AppraiseType.ALL
    },
    setMemberIdList() {
      const list: string[] = [];
      const filterList: string[] = [];
      memberStore.memberList.forEach((memberItem) => {
        list.push(memberItem.member.member_user_id);
        if (!memberItem.member.can_admin) {
          filterList.push(memberItem.member.member_user_id);
        }
      })
      this.allMemberIdList = list;
      this.filterMemberIdList = filterList;
      this.loadOtherItems(0);
    },
    loadOtherItems(val: number) {
      let tmpUserIdList = [] as string[];
      if (val == 0) {//全体成员
        tmpUserIdList = this.allMemberIdList;
      } else if (val == 1) {//非管理人员
        tmpUserIdList = this.filterMemberIdList;
      }
      const items = memberStore.memberList.filter(item => tmpUserIdList.includes(item.member.member_user_id)).map(item => {
        const label = <>
          <UserPhoto logoUri={item.member.logo_uri} className={styles.select_tag_cover} />
          {item.member.display_name}
        </>
        return {
          value: item.member.member_user_id,
          label: label,
          disabled: false,
          closable: false,
          onClose: () => { },
        }
      });
      setOtherItems(items);
    },
    setForm(values: Values) {
      this.form = Object.assign(this.form, values);
      this.loadOtherItems(values.group ?? 0);
    }
  }))


  useEffect(() => {
    localStore.setMemberIdList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 确认事件
  const comfirm = async (values: Values) => {
    let userIdList = [] as string[];
    if (values.group == undefined || values.group === AppraiseType.ALL) {
      userIdList = localStore.allMemberIdList;
    } else if (values.group === AppraiseType.FILTER) {
      userIdList = localStore.filterMemberIdList;
    } else {
      userIdList = selectedItems.map((item) => item.value);
    }

    await request(create({
      session_id: userStore.sessionId || '',
      basic_info: {
        title: values.title || '',
        project_id: projectStore.curProjectId,
      },
      member_user_id_list: userIdList
    }));

    appraiseStore.loadMyRecord(0);
    memberStore.memberList.forEach(item => {
      if (item.member.member_user_id == userStore.userInfo.userId && item.member.can_admin) {
        appraiseStore.loadAllRecord(0);
      }
    })

    if (onChange) {
      onChange(false);
    }
  };

  return (
    <ActionModal visible={visible} title={'发起成员互评'} width={560} onCancel={() => onChange(false)}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={(values) => comfirm(values)}
        autoComplete="off"
      >
        <div className={styles.box}>
          <div className={styles.form}>
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, max: 12, min: 6, message: '请输入6-12位数字/字母/符号，区分大小写' }]}
            >
              <Input
                placeholder="请输入6-12位数字/字母/符号，区分大小写"
                maxLength={12}
              />
            </Form.Item>
            <Form.Item
              name="group"
              label="互评范围"
              rules={[{
                validator: () => {
                  if (localStore.form.group === AppraiseType.SELECT && selectedItems.length < 2) {
                    return Promise.reject(new Error('人数必须大于2人'));
                  } else {
                    return Promise.resolve();
                  }
                }
              },
              ]}
            >
              <Radio.Group
                value={localStore.form.group}
                onChange={(e: RadioChangeEvent) => {
                  localStore.setForm({ group: e.target.value });
                }}
                defaultValue={AppraiseType.ALL}
              >
                <Radio value={AppraiseType.ALL}>全体成员（{memberStore.memberList.length}人)</Radio>
                {localStore.filterMemberIdList.length > 1 && <Radio value={AppraiseType.FILTER}>不包括管理员（{localStore.filterMemberIdList.length}人)</Radio>}
                <Radio value={AppraiseType.SELECT}>自定义({selectedItems.length}人)</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label=" "
            >
              <Select
                mode="multiple"
                placeholder="选择成员"
                showSearch={false}
                labelInValue
                value={localStore.form.group === AppraiseType.SELECT ? selectedItems : otherItems}
                onChange={setSelectedItems}
                tagRender={(cprops: CustomTagProps) => {
                  return (
                    <span className="ant-select-selection-item" title="test6">
                      {cprops.label}
                      <span className="ant-select-selection-item-remove" aria-hidden="true" style={{ userSelect: 'none' }}>
                        <span role="img" aria-label="close" className="anticon anticon-close" onClick={e => cprops.onClose(e)}>
                          <span className={styles.icon_tag_delete} />
                        </span>
                      </span>
                    </span>
                  )
                }}
                disabled={localStore.form.group === AppraiseType.SELECT ? false : true}
                options={memberStore.memberList.map(item => {
                  const label = <>
                    <UserPhoto logoUri={item.member.logo_uri} className={styles.select_tag_cover} />
                    {item.member.display_name}
                  </>
                  return {
                    value: item.member.member_user_id,
                    label: label
                  }
                })}
              />
            </Form.Item>
          </div>

          <div className={styles.actions}>
            <Button key="cancel" ghost onClick={() => onChange(false)} className={styles.btn}>
              取消
            </Button>
            <Button htmlType="submit" className={styles.btn}>
              发起互评
            </Button>
          </div>
        </div>
      </Form>
    </ActionModal>
  );
};

export default observer(CreateAppraise);
