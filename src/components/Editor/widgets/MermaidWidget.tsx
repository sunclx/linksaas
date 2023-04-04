import React, { useState, useRef, useEffect } from 'react';
import type { WidgetProps } from './common';
import mermaid from 'mermaid';
import { Tabs, Select } from 'antd';
import { uniqId } from '@/utils/utils';
import CodeEditor from '@uiw/react-textarea-code-editor';
import EditorWrap from '../components/EditorWrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import style from './MermaidWidget.module.less';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';

//为了防止编辑器出错，WidgetData结构必须保存稳定

interface WidgetData {
  spec: string;
}

export const mermaidWidgetInitData: WidgetData = {
  spec: '',
};

const flowDemo = `graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`;

const seqDemo = `sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!`;

const classDemo = `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }`;

const stateDemo = `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`;

const ganttDemo = `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`;

const pieDemo = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`;

const erDemo = `erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    DELIVERY-ADDRESS ||--o{ ORDER : receives
    INVOICE ||--|{ ORDER : covers
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"`;

const journeyDemo = `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me`;

const gitDemo = `gitGraph
      commit
      commit
      branch develop
      checkout develop
      commit
      commit
      checkout main
      merge develop
      commit
      commit`;

const EditMermaid: React.FC<WidgetProps> = (props) => {
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
    props.writeData({ spec: value });
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
                props.writeData({ spec: e.target.value });
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
};

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
