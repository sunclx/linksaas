import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { Input } from 'antd';
import s from './SwotWidget.module.less';
import classNames from 'classnames';
import { ErrorBoundary } from '@/components/ErrorBoundary';

//为了防止编辑器出错，WidgetData结构必须保存稳定
//https://baike.baidu.com/item/SWOT%E5%88%86%E6%9E%90%E6%B3%95/150223?fromtitle=SWOT&fromid=1050&fr=aladdin
/*
所谓SWOT分析，即基于内外部竞争环境和竞争条件下的态势分析，就是将与研究对象密切相关的各种主要内部优势、劣势和外部的机会和威胁等，通过调查列举出来，并依照矩阵形式排列，然后用系统分析的思想，把各种因素相互匹配起来加以分析，从中得出一系列相应的结论，而结论通常带有一定的决策性。
运用这种方法，可以对研究对象所处的情景进行全面、系统、准确的研究，从而根据研究结果制定相应的发展战略、计划以及对策等。
S （strengths）是优势、W （weaknesses）是劣势、O （opportunities）是机会、T （threats）是威胁。按照企业竞争战略的完整概念，战略应是一个企业“能够做的”（即组织的强项和弱项）和“可能做的”（即环境的机会和威胁）之间的有机组合。
*/
interface WidgetData {
  title?: string; //标题，可选
  strengths: string[] | string; //优势
  weaknesses: string[] | string; //劣势
  opportunities: string[] | string; //机会
  threats: string[] | string; //威胁
}

export const swotWidgetInitData: WidgetData = {
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
};

const EditSwot: React.FC<WidgetProps> = (props) => {
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

  const [title, setTitle] = useState(data.title ?? '');
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
          placeholder={'请输入SWOT分析法标题'}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTitle(e.target.value);
          }}
        />
        <div className={classNames(s.swot_wrap, s.swot)}>
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
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewSwot: React.FC<WidgetProps> = (props) => {
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
        <div className={classNames(s.swot_wrap, s.swot)}>
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
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const SwotWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditSwot {...props} />;
  } else {
    return <ViewSwot {...props} />;
  }
};
