import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import EditorWrap from '../components/EditorWrap';
import { Input } from 'antd';
import s from './SwotWidget.module.less';
import classNames from 'classnames';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/*
做战略规划时，这是一种基于优势的分析工具。SOAR分别代表优势（ Strengths），机会（Opportunities），渴望（Aspirations）和成果（Results）。
*/

interface WidgetData {
  title?: string; //标题，可选
  strengths: string[] | string; //优势
  opportunities: string[] | string; //机会
  aspirations: string[] | string; //渴望
  results: string[] | string; //成果
}

export const soarWidgetInitData: WidgetData = {
  strengths: '',
  opportunities: '',
  aspirations: '',
  results: '',
};

const EditSoar: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;

  const defaultStrength = Array.isArray(data.strengths)
    ? data.strengths.join('\n')
    : data.strengths;
  const defaultOpportunity = Array.isArray(data.opportunities)
    ? data.opportunities.join('\n')
    : data.opportunities;
  const defaultAspiration = Array.isArray(data.aspirations)
    ? data.aspirations.join('\n')
    : data.aspirations;
  const defaultResult = Array.isArray(data.results) ? data.results.join('\n') : data.results;

  const [title, setTitle] = useState('');
  const [strengths, setStrengths] = useState(defaultStrength);
  const [opportunities, setOpportunities] = useState(defaultOpportunity);
  const [aspirations, setAspirations] = useState(defaultAspiration);
  const [results, setResults] = useState(defaultResult);

  useEffect(() => {
    const saveData: WidgetData = {
      title: title == '' ? undefined : title,
      strengths: strengths,
      opportunities: opportunities,
      aspirations: aspirations,
      results: results,
    };
    props.writeData(saveData);
  }, [title, strengths, opportunities, aspirations, results]);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Input
          className={s.swot_input}
          placeholder={'请输入SOAR分析法标题'}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTitle(e.target.value);
          }}
        />

        <div className={classNames(s.swot_wrap, s.col_4)}>
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
            <div className={classNames(s.swot_tit, s.swot_tit_w)}>A 渴望</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={aspirations}
              placeholder={'请输入渴望'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAspirations(e.target.value);
              }}
            />
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_r)}>R 结果</div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={results}
              placeholder={'请输入结果'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setResults(e.target.value);
              }}
            />
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewSoar: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const defaultStrength = Array.isArray(data.strengths)
    ? data.strengths.join('\n')
    : data.strengths;
  const defaultOpportunity = Array.isArray(data.opportunities)
    ? data.opportunities.join('\n')
    : data.opportunities;
  const defaultAspiration = Array.isArray(data.aspirations)
    ? data.aspirations.join('\n')
    : data.aspirations;
  const defaultResult = Array.isArray(data.results) ? data.results.join('\n') : data.results;

  return (
    <ErrorBoundary>
      <EditorWrap className={s.editor_wrap}>
        <h2 className={s.swot_main_tit}>{data.title ?? ''}</h2>
        <div className={classNames(s.swot_wrap, s.col_4)}>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_s, s.round)}>S 优势</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultStrength}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_o, s.round)}>O 机会</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultOpportunity}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_w, s.round)}>A 渴望</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultAspiration}</pre>
            </div>
          </div>
          <div className={s.swot_item}>
            <div className={classNames(s.swot_tit, s.swot_tit_r, s.round)}>R 结果</div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{defaultResult}</pre>
            </div>
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const SoarWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditSoar {...props} />;
  } else {
    return <ViewSoar {...props} />;
  }
};
