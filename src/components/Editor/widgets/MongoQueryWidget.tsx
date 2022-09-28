import React, { useState, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Card, Button, Form, Input } from 'antd';
import { exec_sidecar_shell } from '@/api/shell';

//为了防止编辑器出错，WidgetData结构必须保存稳定
interface WidgetData {
  title?: string;
  host: string;
  port: number;
  user: string;
  password: string;
  db_name: string;
  coll_name: string;
  query: string;
  distinct?: string;
}

export const mongoQueryWidgetInitData: WidgetData = {
  host: '114.116.103.167',
  port: 27017,
  user: 'test',
  password: 'test',
  db_name: 'test',
  coll_name: 'test1',
  query: '{}',
};

const EditMongoQuery: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState('');

  const queryMongo = (values: WidgetData) => {
    const args = [
      'query-mongo',
      '--host',
      values.host,
      '--port',
      `${values.port}`,
      '--db-name',
      values.db_name,
      '--coll-name',
      values.coll_name,
    ];
    if (values.user != '') {
      args.push(...['--user', values.user]);
    }
    if (values.password != '') {
      args.push(...['--password', values.password]);
    }
    if (values.distinct != undefined && values.distinct != '') {
      args.push(...['distinct', values.distinct, values.query]);
    } else {
      args.push(...['find', values.query]);
    }
    exec_sidecar_shell(args).then((value) => {
      console.log(value);
      setResult(JSON.stringify(value.data));
    });
  };

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  return (
    <Card
      title="Mongo查询"
      style={{ maxHeight: 400 }}
      extra={
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.removeSelf();
            }}
          >
            删除组件
          </Button>
        </div>
      }
    >
      <Form onFinish={(values: WidgetData) => queryMongo(values)}>
        <Form.Item
          label="IP"
          name="host"
          initialValue={data.host}
          help="请输入mysql的IP或域名"
          rules={[{ type: 'string' }]}
        >
          <Input
            onChange={(e) => {
              const newData: WidgetData = { ...data, host: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="端口"
          name="port"
          initialValue={data.port}
          help="请输入mysql的端口"
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
            onChange={(e) => {
              const newData: WidgetData = { ...data, port: parseInt(e.target.value) };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="账号"
          name="user"
          initialValue={data.user}
          help="请输入mysql账号"
          rules={[{ type: 'string' }]}
        >
          <Input
            onChange={(e) => {
              const newData: WidgetData = { ...data, user: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          initialValue={data.password}
          help="请输入mysql账号"
          rules={[{ type: 'string' }]}
        >
          <Input.Password
            onChange={(e) => {
              const newData: WidgetData = { ...data, password: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="数据库"
          name="db_name"
          initialValue={data.db_name}
          help="请指定mysql数据库名"
          rules={[{ type: 'string' }]}
        >
          <Input
            onChange={(e) => {
              const newData: WidgetData = { ...data, db_name: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="数据表"
          name="coll_name"
          initialValue={data.coll_name}
          help="请指定mysql数据库名"
          rules={[{ type: 'string' }]}
        >
          <Input
            onChange={(e) => {
              const newData: WidgetData = { ...data, coll_name: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item label="查询条件" name="query" initialValue={data.query} help="请输入查询语句">
          <Input
            onChange={(e) => {
              const newData: WidgetData = { ...data, query: e.target.value };
              setData(newData);
            }}
          />
        </Form.Item>
        <Form.Item
          label="查询字段唯一值"
          name="distinct"
          initialValue={data.distinct ?? ''}
          help="请输入字段名称"
        >
          <Input
            onChange={(e) => {
              if (e.target.value != '') {
                const newData: WidgetData = { ...data, distinct: e.target.value };
                setData(newData);
              }
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      {result}
    </Card>
  );
};

const ViewMongoQuery: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState('');

  const queryMongo = () => {
    const args = [
      'query-mongo',
      '--host',
      data.host,
      '--port',
      `${data.port}`,
      '--db-name',
      data.db_name,
      '--coll-name',
      data.coll_name,
    ];
    if (data.user != '') {
      args.push(...['--user', data.user]);
    }
    if (data.password != '') {
      args.push(...['--password', data.password]);
    }
    if (data.distinct != undefined && data.distinct != '') {
      args.push(...['distinct', data.distinct, data.query]);
    } else {
      args.push(...['find', data.query]);
    }
    exec_sidecar_shell(args).then((value) => {
      console.log(value);
      setResult(JSON.stringify(value.data));
    });
  };

  return (
    <div style={{ maxHeight: 300 }}>
      <Button type="primary" onClick={() => queryMongo()}>
        查询
      </Button>
      <ul>
        <li>query:{data.query}</li>
        <li>distinct:{data.distinct ?? ''}</li>
        <li>result:{result}</li>
      </ul>
    </div>
  );
};

export const MongoQueryWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditMongoQuery {...props} />;
  } else {
    return <ViewMongoQuery {...props} />;
  }
};
