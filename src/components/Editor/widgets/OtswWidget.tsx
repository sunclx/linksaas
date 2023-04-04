import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { Input } from 'antd';
import s from './SwotWidget.module.less';
import classNames from 'classnames';
import { ErrorBoundary } from '@/components/ErrorBoundary';

//为了防止编辑器出错，WidgetData结构必须保存稳定
/*
OTSW分析法也被称为倒SWOT分析法，其分析顺序与SWOT分析法恰好相反，首先分析市场的机遇和挑战，再分析企业的优势和劣势。事实上，人们在制定竞争策略的时候首先看到的往往是市场，因此先确认市场机会，然后根据企业的优势判断企业是否能够把握机会，以及是否能够避免市场上存在的威胁，往往更具有实用性。
*/

interface WidgetData {
  title?: string; //标题，可选
  strengths: string[] | string; //优势
  weaknesses: string[] | string; //劣势
  opportunities: string[] | string; //机会
  threats: string[] | string; //威胁
}

export const otswWidgetInitData: WidgetData = {
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
};

const EditOtsw: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;

  const defaultStrength = Array.isArray(data.strengths)
    ? data.strengths.join('\n')
    : data.strengths;
  const defaultWeaknesse = Array.isArray(data.weaknesses)
    ? data.weaknesses.join('\n')
    : data.weaknesses;
  const defaultOpportunity = Array.isArray(data.opportunities)
    ? data.opportunities.join('\n')
    : data.opportunities;
  const defaultThreat = Array.isArray(data.threats) ? data.threats.join('\n') : data.threats;

  const [title, setTitle] = useState(data.title);
  const [strengths, setStrengths] = useState(defaultStrength);
  const [weaknesses, setWeaknesses] = useState(defaultWeaknesse);
  const [opportunities, setOpportunities] = useState(defaultOpportunity);
  const [threats, setThreats] = useState(defaultThreat);

  useEffect(() => {
    const saveData: WidgetData = {
      title: title == '' ? undefined : title,
      strengths: strengths,
      weaknesses: weaknesses,
      opportunities: opportunities,
      threats: threats,
    };
    props.writeData(saveData);
  }, [title, strengths, weaknesses, opportunities, threats]);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Input
          className={s.swot_input}
          defaultValue={title}
          placeholder={'请输入OTSW分析法标题'}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTitle(e.target.value);
          }}
        />
        <div className={classNames(s.swot_wrap, s.otsw)}>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_o)}>O 机会</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={opportunities}
              placeholder={'请输入机会'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpportunities(e.target.value);
              }}
            />
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_t)}>T 威胁</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={threats}
              placeholder={'请输入威胁'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setThreats(e.target.value);
              }}
            />
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_s)}>S 优势</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={strengths}
              placeholder={'请输入优势'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setStrengths(e.target.value);
              }}
            />
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_w)}>W 劣势</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={weaknesses}
              placeholder={'请输入劣势'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWeaknesses(e.target.value);
              }}
            />
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewOtsw: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const defaultStrength = Array.isArray(data.strengths)
    ? data.strengths.join('\n')
    : data.strengths;
  const defaultWeaknesse = Array.isArray(data.weaknesses)
    ? data.weaknesses.join('\n')
    : data.weaknesses;
  const defaultOpportunity = Array.isArray(data.opportunities)
    ? data.opportunities.join('\n')
    : data.opportunities;
  const defaultThreat = Array.isArray(data.threats) ? data.threats.join('\n') : data.threats;

  return (
    <ErrorBoundary>
      <EditorWrap className={s.editor_wrap}>
        <h2 className={s.swot_main_tit}>{data.title ?? ''}</h2>
        <div className={classNames(s.swot_wrap, s.otsw)}>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_o, s.round)}>O 机会</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultOpportunity}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_t, s.round)}>T 威胁</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultThreat}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_s, s.round)}>S 优势</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultStrength}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_w, s.round)}>W 劣势</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultWeaknesse}</pre>
            </div>
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const OtswWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditOtsw {...props} />;
  } else {
    return <ViewOtsw {...props} />;
  }
};
