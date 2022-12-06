import React, { useEffect } from 'react';
import type { WidgetProps } from './common';
import { Input } from 'antd';
import s from './TechCompareWidget.module.less';
import EditorWrap from '../components/EditorWrap';
import { PlusOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import { useSetState } from 'ahooks';
import { uniqId } from '@/utils/utils';
//为了防止编辑器出错，WidgetData结构必须保存稳定
const { TextArea } = Input;

interface ListTpe {
  id: number;
  technology: string;
  merit: string;
  defect: string;
}

interface WidgetData {
  title?: string; //标题，可选
  list: ListTpe[];
  comparison: string;
}

export const techCompareWidgetInitData: WidgetData = {
  list: [],
  comparison: '',
};

const EditTechCompare: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;

  while (data.list.length < 2) {
    data.list.push({
      id: parseInt(uniqId()),
      technology: '',
      merit: '',
      defect: '',
    });
  }

  const [trData, setTrData] = useSetState(data);

  const deleterow = (i: number) => {
    trData.list.splice(i, 1);
    setTrData({
      list: trData.list,
    });
  };

  const addrow = () => {
    trData.list.push({ id: parseInt(uniqId()), technology: '', merit: '', defect: '' });
    setTrData({
      list: trData.list,
    });
  };

  useEffect(() => {
    props.writeData(trData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trData.comparison, trData.title, trData.list]);

  return (
    <ErrorBoundary>
      <EditorWrap
        className={s.editor_wrap}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.removeSelf();
        }}
      >
        <div>
          <Input placeholder="请输入标题" className={s.input_title} addonBefore="标题:" />
          <table className={s.table_wrap}>
            <thead>
              <tr>
                <th>技术项</th>
                <th>优点</th>
                <th>缺点</th>
                <th>综合对比</th>
              </tr>
            </thead>
            <tbody>
              {trData.list.map((item, i) => (
                <tr key={item.id}>
                  <td>
                    <TextArea
                      autoSize={{ minRows: 6, maxRows: 6 }}
                      placeholder="请输入技术名称"
                      defaultValue={item.technology}
                      onChange={(e) => (trData.list[i].technology = e.target.value)}
                    />
                    {i > 1 && (
                      <div className={s.delete} onClick={() => deleterow(i)}>
                        <Deliconsvg style={{ color: '#0E83FF' }} /> <div>删 除 行</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <TextArea
                      autoSize={{ minRows: 6, maxRows: 6 }}
                      placeholder="请输入技术项优点"
                      defaultValue={item.merit}
                      onChange={(e) => (trData.list[i].merit = e.target.value)}
                    />
                  </td>
                  <td>
                    <TextArea
                      autoSize={{ minRows: 6, maxRows: 6 }}
                      placeholder="请输入技术项缺点"
                      defaultValue={item.defect}
                      onChange={(e) => (trData.list[i].defect = e.target.value)}
                    />
                  </td>
                  {i === 0 && (
                    <td rowSpan={trData.list.length}>
                      <TextArea
                        autoSize={{ minRows: trData.list.length * 6, maxRows: 6 }}
                        placeholder="可综合对比所有技术项"
                        defaultValue={trData.comparison}
                        onChange={(e) => (trData.comparison = e.target.value)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.addbtn} onClick={addrow}>
            <PlusOutlined /> 添加对比技术项
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewTechCompare: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  return (
    <ErrorBoundary>
      <EditorWrap className={s.editor_wrap} collapse={props.collapse}>
        <div>
          {data.title && (
            <Input
              placeholder="请输入标题"
              readOnly
              value={`标题:${data.title}`}
              className={s.input_title}
            />
          )}
          <table className={s.table_wrap}>
            <thead>
              <tr>
                <th>技术项</th>
                <th>优点</th>
                <th>缺点</th>
                <th>综合对比</th>
              </tr>
            </thead>
            <tbody>
              {data.list?.map((item, i) => (
                <tr key={item.id}>
                  <td>
                    <div className={s.text}>{item.technology}</div>
                  </td>
                  <td>
                    <div className={s.text}>{item.merit}</div>
                  </td>
                  <td>
                    <div className={s.text}>{item.defect}</div>
                  </td>
                  {i === 0 && (
                    <td
                      rowSpan={data.list.length}
                      style={{ height: `${data.list.length * 100}px` }}
                      className={s.rowSpan}
                    >
                      <div>{data.comparison}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const TechCompareWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditTechCompare {...props} />;
  } else {
    return <ViewTechCompare {...props} />;
  }
};
