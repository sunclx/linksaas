import React, { useState, useRef, useEffect } from 'react';
import type { WidgetProps } from './common';
import { Tabs } from 'antd';
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
import CodeEditor from '@uiw/react-textarea-code-editor';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
  spec: string;
}

export const markmapWidgetInitData: WidgetData = {
  spec: '',
};

const EditMarkmap: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const [spec, setSpec] = useState(data.spec);
  const [activateKey, setActivateKey] = useState('1');
  const [instance, setInstance] = useState<markmap.Markmap | null>(null);
  const graphRef: React.MutableRefObject<SVGSVGElement | null> = useRef(null);

  useEffect(() => {
    if (activateKey == '2') {
      if (instance != null) {
        instance.destroy();
        setInstance(null);
      }
      const transformer = new Transformer();
      const { root } = transformer.transform(spec);

      if (graphRef.current != null) {
        const ins = markmap.Markmap.create(graphRef.current, undefined, root);
        setInstance(ins);
        const linkList = graphRef.current.querySelectorAll('a');
        linkList.forEach((link) => (link.target = '_blank'));
      }
    }
  }, [spec, activateKey]);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Tabs
          defaultActiveKey="1"
          onChange={(activeKey) => {
            setActivateKey(activeKey);
          }}
        >
          <Tabs.TabPane tab="编辑" key="1">
            <CodeEditor
              value={spec}
              language="markdown"
              minHeight={200}
              placeholder="请输入markdown内容"
              onChange={(e) => {
                setSpec(e.target.value);
                props.writeData({ spec: e.target.value });
              }}
              style={{
                fontSize: 14,
                backgroundColor: '#f5f5f5',
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="预览" key="2" style={{ overflowY: 'scroll', maxHeight: 500 }}>
            <svg ref={graphRef} style={{ height: '400px', width: '90%' }} />
          </Tabs.TabPane>
        </Tabs>
      </EditorWrap>
    </ErrorBoundary>
  );
};

const ViewMarkmap: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const graphRef: React.MutableRefObject<SVGSVGElement | null> = useRef(null);

  useEffect(() => {
    const transformer = new Transformer();
    const { root } = transformer.transform(data.spec);
    if (graphRef.current != null) {
      markmap.Markmap.create(graphRef.current, undefined, root);
      const linkList = graphRef.current.querySelectorAll('a');
      linkList.forEach((link) => (link.target = '_blank'));
    }
  }, [data.spec]);

  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <svg ref={graphRef} style={{ height: '400px', width: '100%' }} />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const MarkmapWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditMarkmap {...props} />;
  } else {
    return <ViewMarkmap {...props} />;
  }
};
