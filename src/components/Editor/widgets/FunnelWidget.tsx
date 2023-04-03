import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import { Form, Input } from 'antd';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EditorWrap from '../components/EditorWrap';
import s from './FunnelWidget.module.less';
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import { ReactComponent as Addsvg } from '@/assets/svg/add.svg';
import classNames from 'classnames';
import { uniqId } from '@/utils/utils';

// 为了防止编辑器出错，WidgetData结构必须保存稳定

interface FunnelStep {
  id: string;
  name: string;
  ratio: number; //转化率，取值范围 0.0到1.0
}

interface WidgetData {
  title?: string; //标题，可选
  stepList: FunnelStep[]; //中间步骤
  lastStepName: string; //漏斗终点名称
}

export const funnelWidgetInitData: WidgetData = {
  stepList: [],
  lastStepName: '',
};

const EditFunnel: React.FC<WidgetProps> = (props) => {
  const initData = props.initData as WidgetData;
  initData.stepList = initData.stepList.map(item => {
    if (item.id !== undefined && item.id != null && item.id != "") {
      return item;
    } else {
      return {
        id: uniqId(),
        name: item.name,
        ratio: item.ratio,
      }
    }
  })
  while (initData.stepList.length < 2) {
    initData.stepList.push({
      id: uniqId(),
      name: '',
      ratio: 0.0,
    });
  }
  const [data, setData] = useState(initData);

  const addStep = (step: number) => {
    const stepList = data.stepList.slice();
    if (step == initData.stepList.length) {
      stepList.push({
        id: uniqId(),
        name: '',
        ratio: 0.0,
      });
    } else {
      stepList.splice(step, 0, { id: uniqId(), name: '', ratio: 0.0 });
    }
    setData({ ...data, stepList });
  };

  const removeStep = (step: number) => {
    const stepList = data.stepList.filter((_, i) => i != step);
    setData({ ...data, stepList });
  };

  useEffect(() => {
    props.writeData(data);
  }, [data]);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Form colon={false}>
          <Form.Item label="漏斗模型标题" className={s.form_item}>
            <Input
              className={classNames(s.input, s.input_title)}
              defaultValue={data.title ?? ''}
              placeholder={'请输入标题'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setData({ ...data, title: e.target.value == '' ? undefined : e.target.value });
              }}
            />
          </Form.Item>
          <table className={s.table_wrap}>
            <thead>
              <tr>
                <th>步骤名称</th>
                <th>转化率</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {data.stepList.map((item, i) => (
                <tr key={item.id}>
                  <td>
                    <Form.Item label={`步骤${i + 1}`} className={s.form_item}>
                      <Input
                        className={s.input}
                        defaultValue={item.name}
                        placeholder={'请输入文字'}
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const stepList = data.stepList.slice();
                          stepList[i].name = e.target.value;
                          setData({ ...data, stepList });
                        }}
                      />
                    </Form.Item>
                  </td>
                  <td>
                    <Input
                      className={classNames(s.input, s.input_numb)}
                      defaultValue={item.ratio * 100}
                      placeholder={'0-100'}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const value = parseFloat(e.target.value);
                        const stepList = data.stepList.slice();
                        stepList[i].ratio = value / 100.0;
                        setData({ ...data, stepList });
                      }}
                    />{' '}
                    %
                  </td>
                  <td>
                    <span className={s.btn}>
                      <Addsvg
                        className={s.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addStep(i);
                        }}
                      />
                    </span>
                    <span className={s.btn}>
                      <Deliconsvg
                        className={s.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeStep(i);
                        }}
                      />
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Form.Item label="最终步骤" className={s.form_item}>
                    <Input
                      className={s.input}
                      defaultValue={data.lastStepName}
                      placeholder={'请输入文字'}
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setData({ ...data, lastStepName: e.target.value });
                      }}
                    />
                  </Form.Item>
                </td>
                <td />
                <td>
                  <span className={s.btn}>
                    <Addsvg
                      className={s.icon}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        addStep(data.stepList.length);
                      }}
                    />
                  </span>
                  <span className={s.btn}>
                    <Deliconsvg className={s.disable_icon} />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Form>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewFunnel: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const colorArr = [
    {
      bckground: '#DDF0FF',
      border: '#AFD5F4',
      color: '#1A9BFF',
    },
    {
      bckground: '#D4F1E2',
      border: '#A0DCBE',
      color: '#2CB971',
    },
    {
      bckground: '#FFEDCE',
      border: '#FFD794',
      color: '#F09F17',
    },
    {
      bckground: '#FFE8DD',
      border: '#FBBB9C',
      color: '#F07217',
    },
    {
      bckground: '#FFDFDF',
      border: '#FFB3B3',
      color: '#DB5858',
    },
    {
      bckground: '#E1DFFF',
      border: '#C4C1F6',
      color: '#483FD6',
    },
  ];
  const itemLength = data?.stepList?.length || 1;
  const itemHeight = Math.round(360 / itemLength);
  return (
    <ErrorBoundary>
      <EditorWrap className={s.editor_wrap}>
        <div className={s.funnel_result}>
          {data.title && <div className={s.main_tit}>标题:{data.title}</div>}
          <ul>
            {data.stepList.map((item, index) => {
              const itemWidth = 500 - (300 / itemLength) * index;
              const itemDiff = Math.round(150 / itemLength);
              return (
                <li key={item.id} style={{ width: itemWidth, height: itemHeight }}>
                  <div className={s.item_ratio}>{item.ratio * 100.0}%</div>
                  <svg
                    className={s.item_bg}
                    style={{ height: itemHeight }}
                    viewBox={`0 0 ${itemWidth} ${itemHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={`M0 0h${itemWidth}l-${itemDiff} ${itemHeight}H${itemDiff}z`}
                      fill={colorArr[index % colorArr.length].bckground}
                      stroke={colorArr[index % colorArr.length].border}
                      fillRule="evenodd"
                    />
                  </svg>
                  <div
                    className={s.item_cont}
                    style={{ color: colorArr[index % colorArr.length].color }}
                  >
                    {item.name}
                  </div>
                </li>
              );
            })}
            <li className={s.last_item}>
              <div className={s.item_cont}>{data.lastStepName}</div>
            </li>
          </ul>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const FunnelWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditFunnel {...props} />;
  } else {
    return <ViewFunnel {...props} />;
  }
};
