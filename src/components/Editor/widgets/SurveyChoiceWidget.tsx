import React, { useState } from 'react';
import type { WidgetProps } from './common';
import { Input, Checkbox, Radio, Form, Col, Row } from 'antd';
import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import { ReactComponent as Addsvg } from '@/assets/svg/add.svg';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import s from './SurveyWidget.module.less';

const { TextArea } = Input;

interface Choice {
  content: string;
  correctChoice: boolean;
}

interface WidgetData {
  type: 'single' | 'multi'; // single multi
  content: string; //问题
  choiceList: Choice[]; //可选答案
}

export const surveyChoiceWidgetInitData: WidgetData = {
  type: 'single',
  content: '',
  choiceList: [
    {
      content: '',
      correctChoice: false,
    },
  ],
};

const EditSurveyChoice: React.FC<WidgetProps> = (props) => {
  const [data, setData] = useState(props.initData as WidgetData);

  const addStep = (step: number) => {
    data.choiceList.splice(step + 1, 0, { content: '', correctChoice: false });
    setData({ ...data });
  };

  const removeStep = (step: number) => {
    if (data.choiceList.length !== 1) {
      data.choiceList.splice(step, 1);
      setData({ ...data });
    }
  };

  const correctChange = (value: string, i: number) => {
    const choiceList = data.choiceList.map((item, index) => {
      return {
        correctChoice: item.correctChoice,
        content: i !== index ? item.content : value,
      };
    });

    setData({ ...data, choiceList });
  };

  const correctChoiceChange = (value: boolean, i: number) => {
    const choiceList = data.choiceList.map((item, index) => {
      return {
        content: item.content,
        correctChoice: i !== index ? (data.type === 'single' ? false : item.correctChoice) : value,
      };
    });

    setData({ ...data, choiceList });
  };

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          initialValues={data}
          autoComplete="off"
        >
          <Form.Item label="题型" name="type" initialValue={data.type}>
            <Radio.Group
              onChange={(e: CheckboxChangeEvent) => {
                setData({
                  ...data,
                  type: e.target.value,
                  choiceList: data.choiceList.map((item) => ({
                    content: item.content,
                    correctChoice: false,
                  })),
                });
              }}
            >
              <Radio value="single">单选</Radio>
              <Radio value="multi">多选</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="题干" name="content" initialValue={data.content}>
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
          <Form.Item label="&nbsp;">
            <Row>
              <Col span={17} style={{ textAlign: 'center' }}>
                选项文字
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                操作
              </Col>
              <Col span={3} style={{ textAlign: 'center' }}>
                设置正确答案
              </Col>
            </Row>
          </Form.Item>
          {data.choiceList.map((item, index) => (
            <Form.Item key={index} label={'选项' + (1 + index)}>
              <Row>
                <Col span={17}>
                  <Input
                    defaultValue={item.content}
                    onChange={(e) => {
                      correctChange(e.target.value, index);
                    }}
                    value={item.content}
                    placeholder={'请输入选项文字'}
                  />
                </Col>
                <Col span={4}>
                  <div className={s.center}>
                    <span className={s.btn}>
                      <Addsvg
                        className={s.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addStep(index);
                        }}
                      />
                    </span>
                    <span className={s.btn}>
                      <Deliconsvg
                        className={s.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeStep(index);
                        }}
                      />
                    </span>
                  </div>
                </Col>
                <Col span={3}>
                  <Checkbox
                    defaultChecked={item.correctChoice}
                    className={s.center}
                    checked={item.correctChoice}
                    onChange={(e: CheckboxChangeEvent) => {
                      correctChoiceChange(e.target.checked, index);
                    }}
                  />
                </Col>
              </Row>
            </Form.Item>
          ))}
        </Form>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewSurveyChoice: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [sel, setSel] = useState(data.choiceList.map(() => false));
  const [right, setRight] = useState(false);

  useEffect(() => {
    console.log(data.choiceList, sel);
    let ok = true;
    data.choiceList.forEach((item, index) => {
      if (sel[index] != item.correctChoice) {
        ok = false;
      }
    });
    setRight(ok);
  }, [sel]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <h2 className={s.title}>{data.type === 'single' ? '单选题' : '多选题'}</h2>
        <p className={s.content}>{data.content}</p>
        {data.choiceList.map((item, index) => (
          <div key={index} className={s.qItem}>
            <Checkbox
              checked={sel[index]}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                let value = sel.slice();
                if (data.type == 'single') {
                  value = value.map(() => false);
                }
                value[index] = e.target.checked;
                setSel(value);
              }}
            />
            <span>{item.content}</span>
          </div>
        ))}
        {right && <span>您答对了！</span>}
      </EditorWrap>
    </ErrorBoundary>
  );
};
export const SurveyChoiceWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditSurveyChoice {...props} />;
  } else {
    return <ViewSurveyChoice {...props} />;
  }
};
