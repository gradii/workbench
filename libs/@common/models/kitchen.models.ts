import { ActionDiagram, ActionFlow, StoreItem, TriggeredAction, Workflow } from './data.models';
import { nextSlotId } from './id';
import { BreakpointWidth } from './responsive';
import { Theme } from './theme.models';

export type SlotDirection = 'row' | 'column';

export type MarginValue = number | 'auto';
export type MarginUnit = 'px' | '%';

export type PaddingValue = number;
export type PaddingUnit = 'px' | '%';

export type BoxSide = 'Top' | 'Left' | 'Right' | 'Bottom';

export interface ComponentMargins {
  marginTop?: MarginValue;
  marginTopUnit?: MarginUnit;
  marginRight?: MarginValue;
  marginRightUnit?: MarginUnit;
  marginBottom?: MarginValue;
  marginBottomUnit?: MarginUnit;
  marginLeft?: MarginValue;
  marginLeftUnit?: MarginUnit;
}

export interface ComponentGap {
  rowGapValue: number;
  rowGapUnit: 'px' | '%';
  columnGapValue: number;
  columnGapUnit: 'px' | '%';
  gapLock: boolean;
}

export interface ComponentSize {
  widthValue: number;
  widthUnit: 'px' | '%';
  widthAuto: boolean;
  heightValue: number;
  heightUnit: 'px' | '%';
  heightAuto: boolean;
}

export interface ComponentPaddings {
  paddingTop?: PaddingValue;
  paddingTopUnit?: PaddingUnit;
  paddingRight?: PaddingValue;
  paddingRightUnit?: PaddingUnit;
  paddingBottom?: PaddingValue;
  paddingBottomUnit?: PaddingUnit;
  paddingLeft?: PaddingValue;
  paddingLeftUnit?: PaddingUnit;
}

export interface KitchenActions {
  [trigger: string]: TriggeredAction[];
}

export interface KitchenApp {
  routes?: any[];
  header: KitchenHeader;
  sidebar: KitchenSidebar;
  pageList: KitchenPage[];
  layout: KitchenLayout;
  actionDiagramList: ActionDiagram[];
  actionFlowList: ActionFlow[];
  workflowList: Workflow[];
  storeItemList: StoreItem[];
  theme: Theme;

  uiPropertyData: UIPropertyMetaData[];

  favicon;
  code;
}

export interface KitchenPage {
  id: string;
  title: string;
  url: string;
  pageList: KitchenPage[];
  slots: { content: KitchenSlot };
  layout?: KitchenLayout;
}

export interface KitchenBreakpointStyles {
  [key: string]: any;
}

export type KitchenStyles = Partial<Record<BreakpointWidth, KitchenBreakpointStyles>>;

export interface KitchenHeader {
  slots: { content: KitchenSlot };
}

export interface KitchenSidebar {
  slots: { content: KitchenSlot };
}

export interface KitchenComponentDataState {
  error: boolean | string;
  empty: boolean;
  actualValue: any;
  sampleValue: any;
  connected: boolean;
  dataKey: string;
}

export interface KitchenFeature {
  id: string;
  type: KitchenType,
  definitionId: string;
  hostId?: string;
  styles: KitchenStyles;
  properties: {
    [key: string]: any;
    dataState?: KitchenComponentDataState;
  };
  index?: number;
  actions?: { [key: string]: TriggeredAction[] };
}

export interface KitchenComponent {
  id: string;
  type: KitchenType;
  definitionId: string;
  parentSlotId?: string;
  contentSlot?: Omit<KitchenSlot, 'featureList' | 'direction'>;
  slots?: { [key: string]: KitchenSlot };
  featureList?: KitchenFeature[];
  styles: KitchenStyles;
  properties: {
    [key: string]: any;
    dataState?: KitchenComponentDataState;
  };
  index?: number;
  actions?: { [key: string]: TriggeredAction[] };
}

export interface KitchenLayoutStyles {
  paddings: ComponentPaddings;
}

export interface KitchenLayoutProperties {
  header: boolean;
  sidebar: boolean;
}

export interface KitchenLayout {
  styles: Partial<Record<BreakpointWidth, KitchenLayoutStyles>>;
  properties: KitchenLayoutProperties;
}

export interface KitchenCompiledLayout {
  styles: KitchenLayoutStyles;
  properties: KitchenLayoutProperties;
}

export interface KitchenBackground {
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'alternate' | 'disabled' | 'hint' | 'transparent';
  imageSrc: KitchenImageSrc;
  imageSize: 'auto' | 'contain' | 'cover';
}

export interface KitchenImageSrc {
  url: string;
  uploadUrl: string;
  name: string;
  active: 'upload' | 'url';
}

export interface SlotBindings {
  direction?: SlotDirection;
}

export class KitchenContentSlot {
  constructor(
    public componentList: KitchenComponent[] = [],
    public id: string                        = nextSlotId()
  ) {
    componentList.forEach(it => {
      it.parentSlotId = id;
    });
  }
}

export class KitchenSlot {
  constructor(
    public componentList: KitchenComponent[] = [],
    public id: string                        = nextSlotId(),
    public featureList: KitchenFeature[]     = [],
    public direction?: 'horizontal' | 'vertical'
  ) {
    componentList.forEach(it => {
      it.parentSlotId = id;
    });
    featureList.forEach(it => {
      it.hostId = id;
    });
  }
}

export interface KitchenSlots {
  [name: string]: KitchenSlot;
}

export interface KitchenSpaceSlots {
  content: KitchenSlot;
}

export enum SpaceHeightType {
  AUTO   = 'auto',
  CUSTOM = 'custom',
}

export interface SpaceHeight {
  type: SpaceHeightType;
  customValue: number;
  customUnit: 'px' | '%';
}

export enum SpaceWidthType {
  AUTO   = 'auto',
  CUSTOM = 'custom',
}

export interface SpaceWidth {
  type: SpaceWidthType;
  customValue: number;
  customUnit: 'px' | '%' | 'col';
}

export enum FormFieldWidthType {
  FULL   = 'full',
  AUTO   = 'auto',
  CUSTOM = 'custom',
}

export interface FormFieldWidth {
  type: FormFieldWidthType;
  customValue: number;
  customUnit: 'px' | '%' | 'rem';
}

export interface IconSize {
  custom: boolean;
  customValue: number;
  customUnit: 'px' | 'rem';
  predefinedValue: '' | 'tiny' | 'small' | 'large' | 'giant';
}

// COL_1_2 means - two rows, first consist of 1 block second of 2 blocks
// ROW_1_2 means - two columns, first consist of 1 block second of 2 blocks
export enum DivideSpaceType {
  COL_1_1 = 'COL_1_1',
  COL_1_2 = 'COL_1_2',
  COL_2_1 = 'COL_2_1',
  ROW_1_1 = 'ROW_1_1',
  ROW_1_2 = 'ROW_1_2',
  ROW_2_1 = 'ROW_2_1',
  ROW_2_2 = 'ROW_2_2',
}

export enum InsertComponentPosition {
  BEFORE,
  AFTER,
}

export enum RootComponentType {
  Header,
  Page,
  Sidebar,
}

export enum KitchenType {
  Component,
  Feature
}

export interface ProjectProperties {
  description: string;
}

export interface UIPropertyMetaData {
  componentId: string;
  definitionId: string;
  name: string;
}
