import React from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import * as widgets from '../widgets';
import { useCommands } from '@remirror/react';

export type WidgetProps = NodeViewComponentProps & {
  widgetType: widgets.WIDGET_TYPE;
  widgetData: unknown;
};

export const Widget: React.FC<WidgetProps> = (props) => {
  const { deleteWidget } = useCommands();

  const widgetProps: widgets.WidgetProps = {
    editMode: props.view.editable,
    initData: props.widgetData,
    removeSelf: () => {
      deleteWidget((props.getPosition as () => number)());
    },
    writeData: (data: unknown) => {
      props.updateAttributes({
        widgetType: props.widgetType,
        widgetData: data,
      });
    },
  };
  switch (props.widgetType) {
    case widgets.WIDGET_TYPE_FUNNEL: {
      return <widgets.FunnelWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_TASK_REF: {
      return <widgets.IssueRefWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_BUG_REF: {
      return <widgets.IssueRefWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_SPRIT_REF: {
      return <widgets.SpritRefWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_5W2H: {
      return <widgets.L5w2hWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_MEMBER_DUTY: {
      return <widgets.MemberDutyWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_OTSW: {
      return <widgets.OtswWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_SOAR: {
      return <widgets.SoarWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_SWOT: {
      return <widgets.SwotWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_TECH_COMPARE: {
      return <widgets.TechCompareWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_TIME_RANGE: {
      return <widgets.TimeRangeWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_MERMAID: {
      return <widgets.MermaidWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_MARK_MAP: {
      return <widgets.MarkmapWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_SURVEY_CHOICE: {
      return <widgets.SurveyChoiceWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_SURVEY_TRUE_OR_FALSE: {
      return <widgets.SurveyTrueOrFalseWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_REQUIRE_MENT_REF: {
      return <widgets.RequirementRefWidget {...widgetProps} />;
    }
    case widgets.WIDGET_TYPE_ROBOT_SERVER_SCRIPT: {
      return <widgets.ServerScriptWidget {...widgetProps} />
    }
    case widgets.WIDGET_TYPE_ROBOT_EARTHLY_ACTION: {
      return <widgets.EarthlyActionWidget {...widgetProps} />
    }
    default: {
      return <div>不支持的插件</div>;
    }
  }
};
