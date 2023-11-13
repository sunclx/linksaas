export type { WidgetProps } from './common';
export { IssueRefWidget } from './IssueRefWidget';
export { SpritRefWidget } from './SpritRefWidget';
export { MermaidWidget } from './MermaidWidget';
export { RequirementRefWidget } from "./RequirementRefWidget";
export { ApiCollRefWidget } from './ApiCollRefWidget';
export { TldrawWidget } from "./TldrawWidget";
export { SwaggerWidget } from "./SwaggerWidget";

import { taskRefWidgetInitData, bugRefWidgetInitData } from './IssueRefWidget';
import { spritRefWidgetInitData } from './SpritRefWidget';
import { mermaidWidgetInitData } from './MermaidWidget';
import { requirementRefWidgetInitData } from './RequirementRefWidget';
import { apiCollRefWidgetInitData } from './ApiCollRefWidget';
import { tldrawWidgetInitData } from './TldrawWidget';
import { swaggerWidgetInitData } from './SwaggerWidget';

export type WIDGET_TYPE = string;
export const WIDGET_TYPE_REQUIRE_MENT_REF: WIDGET_TYPE = "requirementRef"; //引用项目需求
export const WIDGET_TYPE_TASK_REF: WIDGET_TYPE = "taskRef";//引用任务
export const WIDGET_TYPE_BUG_REF: WIDGET_TYPE = "bugRef";//引用缺陷
export const WIDGET_TYPE_SPRIT_REF: WIDGET_TYPE = "spritRef"; //引用工作计划
export const WIDGET_TYPE_MERMAID: WIDGET_TYPE = "mermaid";
export const WIDGET_TYPE_API_COLL_REF: WIDGET_TYPE = "apiCollRef"; //引用接口集合
export const WIDGET_TYPE_TLDRAW: WIDGET_TYPE = "tldraw";
export const WIDGET_TYPE_SWAGGER: WIDGET_TYPE = "swagger";

export const WidgetTypeList: WIDGET_TYPE[] = [
    WIDGET_TYPE_REQUIRE_MENT_REF,
    WIDGET_TYPE_TASK_REF,
    WIDGET_TYPE_BUG_REF,
    WIDGET_TYPE_SPRIT_REF,
    WIDGET_TYPE_MERMAID,
    WIDGET_TYPE_API_COLL_REF,
    WIDGET_TYPE_TLDRAW,
    WIDGET_TYPE_SWAGGER,
];


export const WidgetInitDataMap: Map<WIDGET_TYPE, unknown> = new Map();

WidgetInitDataMap.set(WIDGET_TYPE_REQUIRE_MENT_REF, requirementRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_TASK_REF, taskRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_BUG_REF, bugRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SPRIT_REF, spritRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_MERMAID, mermaidWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_API_COLL_REF, apiCollRefWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_TLDRAW, tldrawWidgetInitData);
WidgetInitDataMap.set(WIDGET_TYPE_SWAGGER, swaggerWidgetInitData);