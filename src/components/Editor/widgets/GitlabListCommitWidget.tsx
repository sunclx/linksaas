import React, { useState, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Button, Form, Input, message, Table, Select } from 'antd';
import { exec_sidecar_shell } from '@/api/shell';
import EditorWrap from '../components/EditorWrap';
import moment from 'moment';
import style from './GitlabListWidget.module.less';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';
const { Option } = Select;
//为了防止编辑器出错，WidgetData结构必须保存稳定
interface WidgetData {
  proto: 'http' | 'https';
  host: string;
  port?: number;
  access_token: string;
  project_id: number; //gitlab内的项目id
}

export const gitlabListCommitWidgetInitData: WidgetData = {
  proto: 'https',
  host: 'jihulab.com',
  access_token: '',
  project_id: 0,
};

interface CommitInfo {
  short_id: string;
  created_at: string;
  title: string;
  message: string;
  committer_name: string;
  committer_email: string;
  web_url: string;
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'short_id',
    key: 'short_id',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '内容',
    dataIndex: 'message',
    key: 'message',
  },
  {
    title: '提交人',
    dataIndex: 'committer_name',
    key: 'committer_name',
  },

  {
    title: '邮箱',
    dataIndex: 'committer_email',
    key: 'committer_email',
  },
  {
    title: '访问地址',
    dataIndex: 'web_url',
    key: 'web_url',
    render: (item: string) => (
      <a target="_blank" href={item} rel="noreferrer">
        {item}
      </a>
    ),
  },

  {
    title: '提交日期',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (item: string) => moment(item).format('YYYY-MM-DD HH:mm:ss'),
  },
];

const EditGitlabListCommit: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState<CommitInfo[]>([]);
  const [proto, setProto] = useState(data.proto);

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  const listCommit = (values: WidgetData) => {
    const args = [
      'gitlab-api',
      '--proto',
      proto,
      '--host',
      values.host,
      '--access-token',
      values.access_token,
    ];
    if (values.port !== undefined && values.port != 0) {
      args.push(...['--port', `${values.port}`]);
    }

    args.push(...['list-commit', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      console.log(value);
      if (value.ok) {
        try {
          const obj = JSON.parse(value.data as string);
          if (Array.isArray(obj)) {
            setResult(obj as CommitInfo[]);
          } else {
            message.error(`错误:${obj.message ?? ''}`);
            setResult([]);
          }
        } catch (e) {
          setResult([]);
          console.log(e);
        }
      } else {
        setResult([]);
      }
    });
  };

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <h2 className={style.title}>Gitlab提交列表</h2>
        <Form onFinish={(values: WidgetData) => listCommit(values)}>
          <Form.Item
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            label="域名"
            name="host"
            initialValue={data.host}
            rules={[{ type: 'string' }]}
          >
            <Input
              addonBefore={
                <Select
                  className={style.select}
                  defaultValue={data.proto}
                  onChange={(value) => {
                    setProto(value);
                    const newData: WidgetData = { ...data, proto: value };
                    setData(newData);
                  }}
                >
                  <Option value="https">https://</Option>
                  <Option value="http">http://</Option>
                </Select>
              }
              placeholder="请输入访问域名"
              onChange={(e) => {
                const newData: WidgetData = { ...data, host: e.target.value };
                setData(newData);
              }}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            label="端口"
            name="port"
            initialValue={data.port ?? 443}
            rules={[
              {
                type: 'number',
                min: 1,
                max: 60000,
                warningOnly: true,
                transform: (value) => parseInt(value),
              },
            ]}
          >
            <Input
              placeholder="请输入端口"
              onChange={(e) => {
                const newData: WidgetData = { ...data, port: parseInt(e.target.value) };
                setData(newData);
              }}
            />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            label={<span>访问令牌<a href="https://docs.gitlab.cn/jh/user/profile/personal_access_tokens.html" target="_blank" rel="noreferrer"><QuestionCircleOutlined/></a></span>}
            name="access_token"
            initialValue={data.access_token}
            rules={[{ type: 'string' }]}
          >
            <Input.Password
              placeholder="请输入访问令牌"
              onChange={(e) => {
                const newData: WidgetData = { ...data, access_token: e.target.value };
                setData(newData);
              }}
            />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 22 }}
            label="项目ID"
            name="project_id"
            initialValue={data.project_id}
            rules={[{ type: 'number', warningOnly: true, transform: (value) => parseInt(value) }]}
          >
            <Input
              placeholder="请输入项目ID"
              onChange={(e) => {
                const newData: WidgetData = { ...data, project_id: parseInt(e.target.value) };
                setData(newData);
              }}
            />
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: '80px' }}>
              查询
            </Button>
          </div>
        </Form>
        {result.length > 0 && (
          <Table
            className={style.table}
            size="middle"
            dataSource={result}
            columns={columns}
            pagination={false}
          />
        )}
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewGitlabListCommit: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState<CommitInfo[]>([]);

  const listCommit = (values: WidgetData) => {
    const args = [
      'gitlab-api',
      '--proto',
      values.proto,
      '--host',
      values.host,
      '--access-token',
      values.access_token,
    ];
    if (values.port !== undefined && values.port != 0) {
      args.push(...['--port', `${values.port}`]);
    }

    args.push(...['list-commit', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        try {
          setResult(JSON.parse(value.data as string) as CommitInfo[]);
        } catch (e) {
          console.log(e);
        }
      } else {
        setResult([]);
      }
    });
  };

  useEffect(() => {
    listCommit(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <h2 className={style.title}>Gitlab提交列表</h2>
        {result.length > 0 && (
          <Table
            className={style.table}
            size="middle"
            dataSource={result}
            columns={columns}
            pagination={false}
          />
        )}
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const GitlabListCommitWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditGitlabListCommit {...props} />;
  } else {
    return <ViewGitlabListCommit {...props} />;
  }
};
