import React, { useState } from 'react';
import type { WidgetProps } from './common';
import SwaggerUI from 'swagger-ui-react';
import { Tabs, Input } from 'antd';
import 'swagger-ui-react/swagger-ui.css';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
  spec: string;
}

export const swaggerWidgetInitData: WidgetData = {
  spec: '',
};

const EditSwagger: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [spec, setSpec] = useState(data.spec);
  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={
          <a href="https://swagger.io/docs/" target="_blank" rel="noreferrer"><QuestionCircleOutlined style={{ marginLeft: "10px" }} /></a>
        }>
          <Tabs.TabPane tab="编辑" key="1">
            <Input.TextArea
              rows={10}
              defaultValue={spec}
              placeholder="请输入swagger内容"
              onChange={(e) => {
                setSpec(e.target.value);
                props.writeData({ spec: e.target.value });
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="预览" key="2" style={{ overflowY: 'scroll', maxHeight: 300 }}>
            <SwaggerUI spec={spec} />
          </Tabs.TabPane>
        </Tabs>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewSwagger: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <SwaggerUI spec={data.spec} />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const SwaggerWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditSwagger {...props} />;
  } else {
    return <ViewSwagger {...props} />;
  }
};
