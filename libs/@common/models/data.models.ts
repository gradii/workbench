export interface StoreItem {
  id: string;
  name: string;
  value: any;
  pageId: string;
  valueScope: StoreItemScope;
  valueType: StoreItemType;
  initialValue: any;
}

export interface ActionFlow {
  id: string;
  [key:string]: any;
}

export interface ActionDiagram {
  id: string;
  reversion: number;
  parentSlotId: string;
  name: string;
  description: string;
  model: any;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowInfo extends Workflow {
  assigned: boolean;
}

export interface WorkflowStep {
  id: string;
  type: StepType;
  params: WorkflowStepParameter[];
  level: number;
}

export interface WorkflowStepParameter {
  type:
    | HttpRequestParameterType
    | CustomCodeParameterType
    | CustomAsyncCodeParameterType
    | PutInStoreParameterType
    | ToggleParameterType
    | NavigationParameterType
    | PutInLocalStorageParameterType
    | ExecuteActionParameterType
    | ConditionParameterType;
  valueType: ParameterValueType;
  value: string | any;
}

export enum ParameterValueType {
  STRING             = 'string',
  INTERPOLATED_VALUE = 'interpolatedValue',
  CUSTOM             = 'custom',
}

export enum StepType {
  TOGGLE_SIDEBAR       = 'toggleSidebar',
  CUSTOM_CODE          = 'customCode',
  CUSTOM_ASYNC_CODE    = 'customAsyncCode',
  HTTP_REQUEST         = 'httpRequest',
  PUT_IN_STORE         = 'putInStore',
  PUT_IN_LOCAL_STORAGE = 'putInLocalStorage',
  NAVIGATION           = 'navigation',
  EXECUTE_ACTION       = 'executeAction',
  CONDITION            = 'condition',
  DRAFT                = 'draft',
}

export enum StepVisibleType {
  BACKEND_TOOLS  = 'backend',
  FRONTEND_TOOLS = 'frontend'
}

export enum InterpolationType {
  STRING      = 'string',
  CODE        = 'code',
  CUSTOM_CODE = 'customCode',
}

export enum StoreItemScope {
  GLOBAL_STORE = 'globalStore',
  CURRENT_PAGE = 'currentPage',
}

export enum StoreItemType {
  STRING  = 'string',
  NUMBER  = 'number',
  BOOLEAN = 'boolean',
  OBJECT  = 'object',
  ARRAY   = 'array',
  DATE    = 'date',
}

export enum ToggleParameterType {
  ACTION_TYPE = 'actionType',
}

export enum ExecuteActionParameterType {
  ACTION = 'action',
}

export enum HttpRequestParameterType {
  URL              = 'url',
  METHOD           = 'method',
  HEADERS          = 'headers',
  QUERY_PARAMS     = 'queryParams',
  BODY             = 'body',
  BODY_TYPE        = 'bodyType',
  WITH_CREDENTIALS = 'withCredentials',
}

export enum NavigationParameterType {
  URL          = 'url',
  QUERY_PARAMS = 'queryParams',
}

export enum CustomCodeParameterType {
  CODE = 'code',
}

export enum ConditionParameterType {
  STEPS = 'steps',
  CODE  = 'code',
}

export enum CustomAsyncCodeParameterType {
  ASYNC_CODE = 'asyncCode',
}

export enum PutInStoreParameterType {
  STORE_ITEM_ID = 'name',
  VALUE         = 'value',
}

export enum BodyType {
  RAW    = 'raw',
  OBJECT = 'object',
}

export enum PutInLocalStorageParameterType {
  STORAGE_ITEM_ID = 'name',
  VALUE           = 'value',
}

export interface LocalStorageItem {
  name: string;
  value: string;
  valueInLocalStorage: string;
}

export const enum ActiveRouteId {
  QUERY_PARAMS = 'activeRouteQueryParams',
  URL          = 'activeRouteUrl',
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  stepId: string;
  level: WorkflowLogLevel;
  message: string;
  payload?: any;
}

export interface WorkflowLogExtended extends WorkflowLog {
  workflowName: string;
  stepName: string;
}

export enum WorkflowLogLevel {
  INFO  = 'INFO',
  ERROR = 'ERROR',
}

export enum ComponentLogicPropName {
  CONDITION_PROPERTY = '__UIBAKERY__SHOW__CONDITION__CODE__',
  SEQUENCE_PROPERTY  = '__UIBAKERY__SEQUENCE__CODE__',
}

export const dataNamespaces = ['ui', 'state', 'routes', 'activeRoute', 'localStorage'];

export interface SequenceProperty {
  code: string;
  itemName: string;
  indexName: string;
}

export class Scope {
  static RESULT = 'result';
  static PARAM  = 'param';

  values: { [varName: string]: any } = {};

  constructor(parentScopeValue: { [varName: string]: any }, additionalVariables: { [varName: string]: any } = {}) {
    Object.assign(this.values, parentScopeValue, additionalVariables);
  }

  set(name: string, value: any) {
    this.values[name] = value;
  }
}

export interface DataField {
  propName?: string;
  styleName?: string;
  type: InterpolationType;
  // keep interpolation in builder mode
  keepInterpolation?: boolean;
}

export interface DataFields {
  [definitionId: string]: DataField[];
}

export const defaultDataFields: DataField[] = [
  {
    propName: ComponentLogicPropName.CONDITION_PROPERTY,
    type    : InterpolationType.CODE
  },
  {
    propName: ComponentLogicPropName.SEQUENCE_PROPERTY + '.code',
    type    : InterpolationType.CODE
  }
];

export interface TriggeredAction {
  action: string;
  paramCode: string | any;
}

export interface OutputProperty {
  name: string;
  type: StoreItemType;
  initialValue: any;
}

export interface ComponentSchema {
  name: string;
  uiDataSourceElement: boolean;
  dataFields: DataField[];
  properties: OutputProperty[];
}

export type ComponentSchemas = ComponentSchema[];

export type ComponentProperties = OutputProperty[];
