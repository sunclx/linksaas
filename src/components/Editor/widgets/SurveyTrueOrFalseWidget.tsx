import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import { Form, Input, Radio } from 'antd';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';
import style from './SurveyWidget.module.less';
const { TextArea } = Input;

interface WidgetData {
  content: string;
  correctValue: boolean;
}

export const surveyTrueOrFlaseWidgetInitData: WidgetData = {
  content: '',
  correctValue: false,
};

const EditSurveyTrueOrFalse: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);

  useEffect(() => {
    props.writeData(data);
  }, [data]);
  console.log(props);
  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <h2 className={style.title}>判断题</h2>
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          initialValues={data}
          autoComplete="off"
        >
          <Form.Item label="题干" name="content" initialValue={data.content} trigger="onChange">
            <TextArea
              rows={3}
              placeholder="请输入文字"
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setData({ ...data, content: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item
            label="设置答案"
            name="correctValue"
            initialValue={data.correctValue}
            trigger="onChange"
          >
            <Radio.Group
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setData({ ...data, correctValue: e.target.value as boolean });
              }}
            >
              <Radio value={true}>正确</Radio>
              <Radio value={false}>错误</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewSurveyTrueOrFalse: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [sel, setSel] = useState<boolean | null>(null);

  return (
    <ErrorBoundary>
      <EditorWrap>
        <h2 className={style.title}>判断题</h2>
        <p className={style.content}>{data.content}</p>
        <div>
          <Radio.Group
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSel(e.target.value as boolean);
            }}
          >
            <Radio value={true}>正确</Radio>
            <Radio value={false}>错误</Radio>
          </Radio.Group>
        </div>

        {sel !== null && sel == data.correctValue && <span>回答正确</span>}
        {sel !== null && sel != data.correctValue && <span>回答错误</span>}
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const SurveyTrueOrFalseWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditSurveyTrueOrFalse {...props} />;
  } else {
    return <ViewSurveyTrueOrFalse {...props} />;
  }
};
