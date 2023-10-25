export type { WidgetProps } from './common';
export { FunnelWidget } from './FunnelWidget';
export { IssueRefWidget } from './IssueRefWidget';
export { SpritRefWidget } from './SpritRefWidget';
export { L5w2hWidget } from './L5w2hWidget';
export { MemberDutyWidget } from './MemberDutyWidget';
export { OtswWidget } from './OtswWidget';
export { SoarWidget } from './SoarWidget';
export { SwotWidget } from './SwotWidget';
export { TechCompareWidget } from './TechCompareWidget';
export { TimeRangeWidget } from './TimeRangeWidget';
export { MermaidWidget } from './MermaidWidget';
export { SurveyChoiceWidget } from './SurveyChoiceWidget';
export { SurveyTrueOrFalseWidget } from './SurveyTrueOrFalseWidget';
export { RequirementRefWidget } from "./RequirementRefWidget";
export { ApiCollRefWidget } from './ApiCollRefWidget';

import { funnelWidgetInitData } from './FunnelWidget';
import { taskRefWidgetInitData, bugRefWidgetInitData } from './IssueRefWidget';
import { spritRefWidgetInitData } from './SpritRefWidget';
import { l5w2hWidgetInitData } from './L5w2hWidget';
import { memberDutyWidgetInitData } from './MemberDutyWidget';
import { otswWidgetInitData } from './OtswWidget';
import { soarWidgetInitData } from './SoarWidget';
import { swotWidgetInitData } from './SwotWidget';
import { techCompareWidgetInitData } from './TechCompareWidget';
import { timeRangeWidgetInitData } from './TimeRangeWidget';
import { mermaidWidgetInitData } from './MermaidWidget';
import { surveyChoiceWidgetInitData } from './SurveyChoiceWidget';
import { surveyTrueOrFlaseWidgetInitData } from './SurveyTrueOrFalseWidget';
import { requirementRefWidgetInitData } from './RequirementRefWidget';
import { apiCollRefWidgetInitData } from './ApiCollRefWidget';

export type WIDGET_TYPE = string;
export const WIDGET_TYPE_FUNNEL: WIDGET_TYPE = "funnel";//漏斗分析法
export const WIDGET_TYPE_REQUIRE_MENT_REF: WIDGET_TYPE = "requirementRef"; //引用项目需求
export const WIDGET_TYPE_TASK_REF: WIDGET_TYPE = "taskRef";//引用任务
export const WIDGET_TYPE_BUG_REF: WIDGET_TYPE = "bugRef";//引用缺陷
export const WIDGET_TYPE_SPRIT_REF: WIDGET_TYPE = "spritRef"; //引用工作计划
export const WIDGET_TYPE_5W2H: WIDGET_TYPE = "5w2h"; //七问分析法
export const WIDGET_TYPE_MEMBER_DUTY: WIDGET_TYPE = "memberDuty"; //成员职责 
export const WIDGET_TYPE_OTSW: WIDGET_TYPE = "otsw"; //OTSW分析法 
export const WIDGET_TYPE_SOAR: WIDGET_TYPE = "soar"; //SOAR分析法 
export const WIDGET_TYPE_SWOT: WIDGET_TYPE = "swot"; //SWOT分析法 
export const WIDGET_TYPE_TECH_COMPARE: WIDGET_TYPE = "techCompare"; //技术对比 
export const WIDGET_TYPE_TIME_RANGE: WIDGET_TYPE = "timeRange"; // 时间区间
export const WIDGET_TYPE_MERMAID: WIDGET_TYPE = "mermaid";
export const WIDGET_TYPE_SURVEY_CHOICE: WIDGET_TYPE = "surveyChoice"; //问卷选择题
export const WIDGET_TYPE_SURVEY_TRUE_OR_FALSE: WIDGET_TYPE = "surveyTrueOrFalse"; //问卷对错题
export const WIDGET_TYPE_API_COLL_REF: WIDGET_TYPE = "apiCollRef"; //引用接口集合

export const WidgetTypeList: WIDGET_TYPE[] = [
    WIDGET_TYPE_FUNNEL,
    WIDGET_TYPE_REQUIRE_MENT_REF,
    WIDGET_TYPE_TASK_REF,
    WIDGET_TYPE_BUG_REF,
    WIDGET_TYPE_SPRIT_REF,
    WIDGET_TYPE_5W2H,
    WIDGET_TYPE_MEMBER_DUTY,
    WIDGET_TYPE_OTSW,
    WIDGET_TYPE_SOAR,
    WIDGET_TYPE_SWOT,
    WIDGET_TYPE_TECH_COMPARE,
    WIDGET_TYPE_TIME_RANGE,
    WIDGET_TYPE_MERMAID,
    WIDGET_TYPE_SURVEY_CHOICE,
    WIDGET_TYPE_SURVEY_TRUE_OR_FALSE,
    WIDGET_TYPE_API_COLL_REF,
];


export const WidgetInitDataMap: Map<WIDGET_TYPE, unknown> = new Map();

WidgetInitDataMap.set(WIDGET_TYPE_FUNNEL, funnelWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_REQUIRE_MENT_REF, requirementRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_TASK_REF, taskRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_BUG_REF, bugRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SPRIT_REF, spritRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_5W2H, l5w2hWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_MEMBER_DUTY, memberDutyWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_OTSW, otswWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SOAR, soarWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SWOT, swotWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_TECH_COMPARE, techCompareWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_TIME_RANGE, timeRangeWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_MERMAID, mermaidWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SURVEY_CHOICE, surveyChoiceWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SURVEY_TRUE_OR_FALSE, surveyTrueOrFlaseWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_API_COLL_REF, apiCollRefWidgetInitData);