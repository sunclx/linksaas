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
  sql: string;
}

export const mysqlQueryWidgetInitData: WidgetData = {
  host: '114.116.103.167',
  port: 13306,
  user: 'test',
  password: 'test',
  db_name: 'test',
  sql: 'select * from aaa;',
};

interface MysqlColumn {
  name: string;
  column_type: string;
}

interface MysqlCell {
  name: string;
  value: string;
}

interface MysqlRow {
  cell_list: MysqlCell[];
}

interface MysqlResult {
  column_list: MysqlColumn[];
  row_list: MysqlRow[];
}

const EditMysqlQuery: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);
  const [result, setResult] = useState('');

  const querySql = (values: WidgetData) => {
    const args = [
      'query-mysql',
      '--host',
      values.host,
      '--port',
      `${values.port}`,
      '--user',
      values.user,
      '--db-name',
      values.db_name,
    ];
    if (values.password != '') {
      args.push(...['--password', values.password]);
    }
    args.push(values.sql);
    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        console.log('result', value.data as MysqlResult);
        setResult(JSON.stringify(value.data, undefined, 2));
      } else {
        console.log('error', value.data);
        setResult(value.data as string);
      }
    });
  };

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  return (
    <Card
      title="Mysql查询"
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
      <Form onFinish={(values: WidgetData) => querySql(values)}>
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
        <Form.Item label="SQL" name="sql" initialValue={data.sql} help="请输入查询语句">
          <Input.TextArea
            rows={4}
            onChange={(e) => {
              const newData: WidgetData = { ...data, sql: e.target.value };
              setData(newData);
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

const ViewMysqlQuery: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [result, setResult] = useState('');

  const querySql = () => {
    const args = [
      'query-mysql',
      '--host',
      data.host,
      '--port',
      `${data.port}`,
      '--user',
      data.user,
      '--db-name',
      data.db_name,
    ];
    if (data.password != '') {
      args.push(...['--password', data.password]);
    }
    args.push(data.sql);
    exec_sidecar_shell(args).then((value) => {
      if (value.ok) {
        console.log('result', value.data as MysqlResult);
        setResult(JSON.stringify(value.data, undefined, 2));
      } else {
        console.log('error', value.data);
        setResult(value.data as string);
      }
    });
  };

  return (
    <div style={{ maxHeight: 300 }}>
      <Button type="primary" onClick={() => querySql()}>
        查询
      </Button>
      <ul>
        <li>sql:{data.sql}</li>
        <li>result:{result}</li>
      </ul>
    </div>
  );
};

export const MysqlQueryWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditMysqlQuery {...props} />;
  } else {
    return <ViewMysqlQuery {...props} />;
  }
};
