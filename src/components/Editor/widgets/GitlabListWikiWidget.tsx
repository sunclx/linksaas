import React, { useState, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Table, Button, Form, Input, Select, message } from 'antd';
import { exec_sidecar_shell } from '@/api/shell';
import EditorWrap from '../components/EditorWrap';
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

export const gitlabListWikiWidgetInitData: WidgetData = {
  proto: 'https',
  host: 'jihulab.com',
  access_token: '',
  project_id: 0,
};

interface WikiInfo {
  format: string;
  slug: string;
  title: string;
}

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '格式',
    dataIndex: 'format',
    key: 'format',
  },
];

const EditGitlabListWiki: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState<WikiInfo[]>([]);
  const [proto, setProto] = useState(data.proto);

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  const listWiki = (values: WidgetData) => {
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

    args.push(...['list-wiki', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        try {
          const obj = JSON.parse(value.data as string);
          console.log(value.data);
          if (Array.isArray(obj)) {
            setResult(obj as WikiInfo[]);
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
        <h2 className={style.title}>Gitlab Wiki列表</h2>
        <Form onFinish={(values: WidgetData) => listWiki(values)}>
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

const ViewGitlabListWiki: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState<WikiInfo[]>([]);

  const listWiki = (values: WidgetData) => {
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

    args.push(...['list-wiki', `${values.project_id}`]);

    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        try {
          setResult(JSON.parse(value.data as string) as WikiInfo[]);
        } catch (e) {
          console.log(e);
        }
      } else {
        setResult([]);
      }
    });
  };

  useEffect(() => {
    listWiki(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <h2 className={style.title}>Gitlab Wiki列表</h2>
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

export const GitlabListWikiWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditGitlabListWiki {...props} />;
  } else {
    return <ViewGitlabListWiki {...props} />;
  }
};
