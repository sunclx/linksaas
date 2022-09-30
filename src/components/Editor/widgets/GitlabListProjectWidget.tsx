import React, { useState, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Table, Button, Form, Input, Select, message } from 'antd';
import EditorWrap from '../components/EditorWrap';
import { exec_sidecar_shell } from '@/api/shell';
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
  group_id?: number; //对应gitlab里面的group id
}

export const gitlabListProjectWidgetInitData: WidgetData = {
  proto: 'https',
  host: 'jihulab.com',
  access_token: '',
};

interface ProjectInfo {
  id: number;
  name: string;
  description: string;
  web_url: string;
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '项目地址',
    dataIndex: 'web_url',
    key: 'web_url',
    render: (url: string) => {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      );
    },
  },
  {
    title: '项目描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const EditGitlabListProject: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState<ProjectInfo[]>([]);
  const [proto, setProto] = useState(data.proto);

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  const listProject = (values: WidgetData) => {
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
    if (values.group_id !== undefined && values.group_id !== 0) {
      args.push(...['list-project-in-group', `${values.group_id}`]);
    } else {
      args.push('list-all-project');
    }
    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        try {
          const obj = JSON.parse(value.data as string);
          if (Array.isArray(obj)) {
            setResult(obj as ProjectInfo[]);
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
        <h2 className={style.title}>Gitlab项目列表</h2>
        <Form onFinish={(values: WidgetData) => listProject(values)}>
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
            label="端口"
            name="port"
            initialValue={data.port ?? 443}
            labelCol={{ span: 3 }}
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
            label="项目组ID"
            name="group_id"
            initialValue={data.group_id ?? 0}
            rules={[{ type: 'number', warningOnly: true, transform: (value) => parseInt(value) }]}
          >
            <Input
              placeholder="请输入组ID"
              onChange={(e) => {
                const newData: WidgetData = { ...data, group_id: parseInt(e.target.value) };
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

const ViewGitlabListProject: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState<ProjectInfo[]>([]);

  const listProject = (values: WidgetData) => {
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
    if (values.group_id !== undefined && values.group_id !== 0) {
      args.push(...['list-project-in-group', `${values.group_id}`]);
    } else {
      args.push('list-all-project');
    }
    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        try {
          setResult(JSON.parse(value.data as string) as ProjectInfo[]);
        } catch (e) {
          console.log(e);
        }
      } else {
        setResult([]);
      }
    });
  };

  useEffect(() => {
    listProject(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <h2 className={style.title}>Gitlab项目列表</h2>
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

export const GitlabListProjectWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditGitlabListProject {...props} />;
  } else {
    return <ViewGitlabListProject {...props} />;
  }
};
