import React, { useEffect, useState } from 'react';
import type { WidgetProps } from './common';
import { Input } from 'antd';
import s from './L5w2hWidget.module.less';
import classNames from 'classnames';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
  title?: string;
  why: string;
  what: string;
  who: string;
  when: string;
  where: string;
  how: string;
  howMuch: string;
}

export const l5w2hWidgetInitData: WidgetData = {
  why: '',
  what: '',
  who: '',
  when: '',
  where: '',
  how: '',
  howMuch: '',
};

const Edit5w2h: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;

  const [title, setTitle] = useState(data.title ?? '');
  const [what, setWhat] = useState(data.what);
  const [why, setWhy] = useState(data.why);
  const [when, setWhen] = useState(data.when);
  const [where, setWhere] = useState(data.where);
  const [who, setWho] = useState(data.who);
  const [how, setHow] = useState(data.how);
  const [howMuch, setHowMuch] = useState(data.howMuch);

  useEffect(() => {
    const saveData: WidgetData = {
      title: title == '' ? undefined : title,
      why: why,
      what: what,
      who: who,
      when: when,
      where: where,
      how: how,
      howMuch: howMuch,
    };
    props.writeData(saveData);
  }, [title, what, why, when, where, who, how, howMuch]);
  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Input
          className={s.l5w2h_input}
          defaultValue={title}
          placeholder={'请输入5W2H标题（20个字以内）'}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTitle(e.target.value);
          }}
        />
        <div className={s.l5w2h_wrap}>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_what)}>
              what
              <br />
              做什么
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={what}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWhat(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_why)}>
              why
              <br />
              为什么
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={why}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWhy(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_when)}>
              when
              <br />
              何时做
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={when}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWhen(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_where)}>
              where
              <br />
              何地做
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={where}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWhere(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_who)}>
              who
              <br />
              谁去做
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={who}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setWho(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_how)}>
              how
              <br />
              如何做
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={how}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setHow(e.target.value);
              }}
            />
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_how_much)}>
              how much
              <br />
              成本
            </div>
            <Input.TextArea
              className={s.textarea}
              defaultValue={howMuch}
              placeholder={'请输入文字'}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setHowMuch(e.target.value);
              }}
            />
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const View5w2h: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  return (
    <ErrorBoundary>
      <EditorWrap className={s.editor_wrap} collapse={props.collapse}>
        {data.title && <h2 className={s.l5w2h_main_tit}>{data.title}</h2>}
        <div className={classNames(s.l5w2h_wrap, s.result)}>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_what, s.round)}>
              what
              <br />
              做什么
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_why, s.round)}>
              why
              <br />
              为什么
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_when, s.round)}>
              when
              <br />
              何时做
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_where, s.round)}>
              where
              <br />
              何地做
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_who, s.round)}>
              who
              <br />
              谁去做
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_how, s.round)}>
              how
              <br />
              如何做
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.why}</pre>
            </div>
          </div>
          <div className={s.l5w2h_item}>
            <div className={classNames(s.l5w2h_tit, s.l5w2h_tit_how_much, s.round)}>
              how much
              <br />
              成本
            </div>
            <div className={classNames(s.textarea, s.text)}>
              <pre>{data.howMuch}</pre>
            </div>
          </div>
        </div>
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const L5w2hWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <Edit5w2h {...props} />;
  } else {
    return <View5w2h {...props} />;
  }
};
