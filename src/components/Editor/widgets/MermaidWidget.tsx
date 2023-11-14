import React, { useState, useRef, useEffect } from 'react';
import { SAVE_WIDGET_NOTICE, type WidgetProps } from './common';
import mermaid from 'mermaid';
import { Tabs, Select } from 'antd';
import { uniqId } from '@/utils/utils';
import CodeEditor from '@uiw/react-textarea-code-editor';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import style from './MermaidWidget.module.less';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';
import { classDemo, erDemo, flowDemo, ganttDemo, gitDemo, journeyDemo, pieDemo, seqDemo, stateDemo } from '@/utils/mermaid';
import { appWindow } from "@tauri-apps/api/window";
import { observer } from 'mobx-react';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
  spec: string;
}

export const mermaidWidgetInitData: WidgetData = {
  spec: '',
};

const EditMermaid: React.FC<WidgetProps> = observer((props) => {
  const data = props.initData as WidgetData;
  const [spec, setSpec] = useState(data.spec);
  const [activateKey, setActivateKey] = useState('1');
  const graphRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const setDemo = (demoName: string) => {
    let value = '';
    switch (demoName) {
      case 'flow': {
        value = flowDemo;
        break;
      }
      case 'seq': {
        value = seqDemo;
        break;
      }
      case 'class': {
        value = classDemo;
        break;
      }
      case 'state': {
        value = stateDemo;
        break;
      }
      case 'gantt': {
        value = ganttDemo;
        break;
      }
      case 'pie': {
        value = pieDemo;
        break;
      }
      case 'er': {
        value = erDemo;
        break;
      }
      case 'journey': {
        value = journeyDemo;
        break;
      }
      case 'git': {
        value = gitDemo;
        break;
      }
      default:
        value = '';
    }
    setSpec(value);
  };

  useEffect(() => {
    if (activateKey == '2') {
      try {
        mermaid.parse(spec);
        mermaid.render('__inEditor', spec, (svgCode) => {
          setTimeout(() => {
            if (graphRef.current != null) {
              graphRef.current.innerHTML = svgCode;
            }
          }, 200);
        });
      } catch (e) {
        if (graphRef.current != null) {
          graphRef.current.innerHTML = '格式错误';
        }
      }
    }
  }, [spec, activateKey]);

  useEffect(() => {
    const unListenFn = appWindow.listen(SAVE_WIDGET_NOTICE, () => {
      setSpec(oldValue => {
        props.writeData({ spec: oldValue });
        return oldValue;
      });
    });
    return () => {
      unListenFn.then(unListen => unListen());
    };
  }, []);

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => props.removeSelf()}>
        <Tabs
          defaultActiveKey="1"
          onChange={(activeKey) => {
            setActivateKey(activeKey);
          }}
          tabBarExtraContent={{
            right: (
              <>
                <Select
                  style={{ width: 150 }}
                  placeholder="请选择图表类型"
                  onChange={(value) => {
                    setDemo(value);
                  }}
                  className={style.select}
                >
                  <Select.Option key="flow" value="flow">
                    流程图
                  </Select.Option>
                  <Select.Option key="seq" value="seq">
                    时序图
                  </Select.Option>
                  <Select.Option key="class" value="class">
                    类图
                  </Select.Option>
                  <Select.Option key="state" value="state">
                    状态图
                  </Select.Option>
                  <Select.Option key="gantt" value="gantt">
                    甘特图
                  </Select.Option>
                  <Select.Option key="pie" value="pie">
                    圆饼图
                  </Select.Option>
                  <Select.Option key="er" value="er">
                    ER图
                  </Select.Option>
                  <Select.Option key="journey" value="journey">
                    用户体验图
                  </Select.Option>
                  <Select.Option key="git" value="git">
                    GIT历史
                  </Select.Option>
                </Select>
                <a href="https://mermaid-js.github.io/mermaid/#/" target="_blank" rel="noreferrer"><QuestionCircleOutlined style={{ marginLeft: "10px" }} /></a>
              </>
            ),
          }}
        >
          <Tabs.TabPane tab="编辑(mermaid)" key="1">
            <CodeEditor
              value={spec}
              language="mermaid"
              minHeight={200}
              onChange={(e) => {
                setSpec(e.target.value);
              }}
              style={{
                fontSize: 14,
                backgroundColor: '#f5f5f5',
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="预览" key="2" style={{ overflowY: 'scroll', maxHeight: 300 }}>
            <div ref={graphRef} />
          </Tabs.TabPane>
        </Tabs>
      </EditorWrap>
    </ErrorBoundary>
  );
});

const ViewMermaid: React.FC<WidgetProps> = (props) => {
  const data = props.initData as WidgetData;
  const graphRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [renderId] = useState('mermaid' + uniqId());

  useEffect(() => {
    try {
      mermaid.parse(data.spec);
      mermaid.render(renderId, data.spec, (svgCode) => {
        if (graphRef.current != null) {
          graphRef.current.innerHTML = svgCode;
        }
      });
    } catch (e) {
      if (graphRef.current != null) {
        graphRef.current.innerHTML = '格式错误';
      }
    }
  });

  return (
    <ErrorBoundary>
      <EditorWrap>
        <div ref={graphRef} />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export const MermaidWidget: React.FC<WidgetProps> = (props) => {
  if (props.editMode) {
    return <EditMermaid {...props} />;
  } else {
    return <ViewMermaid {...props} />;
  }
};
