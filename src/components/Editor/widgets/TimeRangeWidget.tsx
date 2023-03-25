import Button from '@/components/Button';
import { DatePicker, Input, Tooltip } from 'antd';
import React, { useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import s from './TimeRangeWidget.module.less';
import moment from 'moment';
import { ReactComponent as Deliconsvg } from '@/assets/svg/delicon.svg';
import classNames from 'classnames';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const { RangePicker } = DatePicker;
//为了防止编辑器出错，WidgetData结构必须保存稳定

interface TimePoint {
  name: string;
  timeStamp?: number; //时间戳，单位毫秒
}

interface WidgetData {
  title?: string;
  startTimeStamp: number; //开始时间戳，单位毫秒
  endTimeStamp: number; //结束时间戳，单位毫秒
  pointList: TimePoint[]; //中间时间点
}

export const timeRangeWidgetInitData: WidgetData = {
  startTimeStamp: moment().unix() * 1000,
  endTimeStamp: moment().add(7, 'days').unix() * 1000,
  pointList: [{ name: '' }, { name: '' }, { name: '' }],
};

const EditTimeRange: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  console.log(data);
  const [widgetData, setWidgetData] = useState(data);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()} collapse={props.collapse}>
        <div className={s.item_wrap}>
          <label className={s.title_label}>时间区间标题</label>
          <Input
            placeholder="20个字以内"
            maxLength={20}
            defaultValue={widgetData.title}
            style={{ width: '280px' }}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const newTitle = e.target.value == '' ? undefined : e.target.value;
              const saveData: WidgetData = { ...widgetData, title: newTitle };
              setWidgetData(saveData);
              props.writeData(saveData);
              console.log(saveData);
            }}
          />
        </div>
        <div className={s.item_wrap}>
          <label className={s.title_label}>起止时间</label>
          <RangePicker
            style={{ width: '280px' }}
            className={s.rangepicker}
            defaultValue={[moment(widgetData.startTimeStamp), moment(widgetData.endTimeStamp)]}
            onChange={(ts) => {
              if (ts != null && ts != undefined) {
                const saveData: WidgetData = {
                  ...widgetData,
                  startTimeStamp: (ts[0]?.unix() ?? moment().unix()) * 1000,
                  endTimeStamp: (ts[1]?.unix() ?? moment().add(7, 'd').unix()) * 1000,
                };
                setWidgetData(saveData);
                props.writeData(saveData);
              }
            }}
          />
        </div>
        <div className={s.item_wrap}>
          <label className={s.title_label}>关键时间点</label>
          <Button
            ghost
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const pointList = widgetData.pointList.slice();
              pointList.unshift({ name: '' });
              const saveData: WidgetData = { ...widgetData, pointList: pointList };
              setWidgetData(saveData);
              props.writeData(saveData);
            }}
          >
            +添加
          </Button>
        </div>
        {widgetData.pointList.map((item, i) => (
          <div className={s.add_form_wrap} key={`${i + 1}`}>
            <div className={s.number}>{widgetData.pointList.length - i}</div>
            <Input
              placeholder="节点描述文字十字以内"
              maxLength={20}
              value={item.name}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const pointList = widgetData.pointList.slice();
                pointList[i].name = e.target.value;
                const saveData: WidgetData = { ...widgetData, pointList: pointList };
                setWidgetData(saveData);
                props.writeData(saveData);
              }}
            />
            <DatePicker
              className={s.datepicker}
              defaultValue={item.timeStamp == undefined ? undefined : moment(item.timeStamp)}
              onChange={(e) => {
                if (e !== null && e !== undefined) {
                  const pointList = widgetData.pointList.slice();
                  pointList[i].timeStamp = e.unix() * 1000;
                  const saveData: WidgetData = { ...widgetData, pointList: pointList };
                  setWidgetData(saveData);
                  props.writeData(saveData);
                }
              }}
            />
            <Deliconsvg
              style={{ color: '#0E83FF' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const pointList = widgetData.pointList.filter((_, vi) => vi !== i);
                const saveData: WidgetData = { ...widgetData, pointList: pointList };
                setWidgetData(saveData);
                props.writeData(saveData);
              }}
            />
          </div>
        ))}
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewTimeRange: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  data.pointList = data.pointList.map((item) => {
    if (item.timeStamp !== undefined) {
      if (item.timeStamp < data.startTimeStamp) {
        item.timeStamp = undefined;
      } else if (item.timeStamp > data.endTimeStamp) {
        item.timeStamp = undefined;
      }
    }
    return item;
  });
  const timeLen = data.endTimeStamp - data.startTimeStamp;

  const remainDay = (data.endTimeStamp - moment().unix() * 1000) / 1000 / 3600 / 24;
  const nowTime = moment();

  return (
    <ErrorBoundary>
      <EditorWrap className={s.ViewTimeRange}>
        <div className={s.title_wrap}>
          <span>{data.title ?? ''}</span>
          <span>
            {moment(data.startTimeStamp).format('YYYY年MM月DD日')} 至{' '}
            {moment(data.endTimeStamp).format('YYYY年MM月DD日')}
          </span>
          {remainDay >= 0 && <span>还剩{remainDay.toFixed(0)}天</span>}
          {remainDay < 0 && <span>已过{(-1 * remainDay).toFixed(0)}天</span>}
        </div>
        <div className={s.progress}>
          {data.pointList.map((item, i) => (
            <Tooltip
              title={
                (item.timeStamp == undefined
                  ? '未知时间'
                  : moment(item.timeStamp).format('YYYY-MM-DD')) +
                ' ' +
                item.name
              }
              placement="top"
              key={`${i + 1}`}
              color="#fff"
              arrowPointAtCenter
              overlayInnerStyle={{ color: '#000' }}
            >
              <div
                className={classNames(
                  s.progress_item,
                  item.timeStamp && item.timeStamp < nowTime.valueOf() ? s.active : '',
                  data.pointList.length - 1 === i ? s.last : '',
                  i === 0 ? s.first : '',
                )}
                style={{
                  left:
                    item.timeStamp && data.pointList.length - 1 !== i
                      ? `calc(${(((item.timeStamp! - data.startTimeStamp) / timeLen) * 100).toFixed(
                          2,
                        )}% - 6px)`
                      : 'calc(100% - 9px)',
                }}
              >
                <span />
                <p>{item.name}</p>
              </div>
            </Tooltip>
          ))}
          <div
            className={s.preterite}
            style={{
              width: `${
                ((nowTime.valueOf() - data.startTimeStamp) /
                  (data.endTimeStamp - data.startTimeStamp)) *
                100
              }%`,
            }}
          >
            <span
              className={s.text}
              style={{
                marginLeft:
                  ((nowTime.valueOf() - data.startTimeStamp) /
                    (data.endTimeStamp - data.startTimeStamp)) *
                    100 <
                  20
                    ? '0px'
                    : '',
              }}
            >
              {moment().format('YYYY-MM-DD')}
            </span>
            <span className={s.triangle} />
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const TimeRangeWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditTimeRange {...props} />;
  } else {
    return <ViewTimeRange {...props} />;
  }
};
