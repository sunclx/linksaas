import React, { useState, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Table, Button, Form, Input, Select, message } from 'antd';
import { exec_sidecar_shell } from '@/api/shell';
import EditorWrap from '../components/EditorWrap';
import style from './GitlabListWidget.module.less';
import moment from 'moment';
import { ErrorBoundary } from '@/components/ErrorBoundary';
const { Option } = Select;
//为了防止编辑器出错，WidgetData结构必须保存稳定
interface WidgetData {
  proto: 'http' | 'https';
  host: string;
  port?: number;
  access_token: string;
  project_id: number; //gitlab内的项目id
}

export const gitlabListIssueWidgetInitData: WidgetData = {
  proto: 'https',
  host: 'jihulab.com',
  access_token: '',
  project_id: 0,
  // access_token: 'x2nspLoDZd8ziVKvVZQ2',
  // project_id: 20535,
};

interface IssueInfo {
  id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  type: string;
  web_url: string;
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '内容',
    dataIndex: 'description',
    key: 'description',
    width: 200,
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

const EditGitlabListIssue: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState<IssueInfo[]>([]);
  const [proto, setProto] = useState(data.proto);

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  const listIssue = (values: WidgetData) => {
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

    args.push(...['list-issue', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      console.log(value);
      if (value.ok) {
        try {
          const obj = JSON.parse(value.data as string);
          if (Array.isArray(obj)) {
            setResult(obj as IssueInfo[]);
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
        <h2 className={style.title}>Gitlab工单列表</h2>
        <Form onFinish={(values: WidgetData) => listIssue(values)}>
          <Form.Item
            labelCol={{ span: 2 }}
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
            label="端口"
            name="port"
            initialValue={data.port ?? 443}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
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
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            label="密码"
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
            labelCol={{ span: 2 }}
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

const ViewGitlabListIssue: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState<IssueInfo[]>([]);

  const listIssue = (values: WidgetData) => {
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

    args.push(...['list-issue', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      console.log(value);
      if (value.ok) {
        try {
          setResult(JSON.parse(value.data as string) as IssueInfo[]);
        } catch (e) {
          console.log(e);
        }
      } else {
        setResult([]);
      }
    });
  };

  useEffect(() => {
    listIssue(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <h2 className={style.title}>Gitlab工单列表</h2>
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

export const GitlabListIssueWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditGitlabListIssue {...props} />;
  } else {
    return <ViewGitlabListIssue {...props} />;
  }
};
