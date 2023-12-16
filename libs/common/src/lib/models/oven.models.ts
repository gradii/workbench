import { StoreItem, TriggeredAction, Workflow } from './data.models';
import { nextSlotId } from './id';
import { Theme } from './theme.models';
import { BreakpointWidth } from './responsive';

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

export interface OvenActions {
  [trigger: string]: TriggeredAction[];
}

export interface OvenApp {
  routes?: any[];
  header: OvenHeader;
  sidebar: OvenSidebar;
  pageList: OvenPage[];
  layout: OvenLayout;
  workflowList: Workflow[];
  storeItemList: StoreItem[];
  theme: Theme;

  uiPropertyData: UIPropertyMetaData[];

  favicon
  code
}

export interface OvenPage {
  id: string;
  title: string;
  url: string;
  pageList: OvenPage[];
  slots: { content: OvenSlot };
  layout?: OvenLayout;
}

export interface OvenBreakpointStyles {
  [key: string]: any;
}

export type OvenStyles = Partial<Record<BreakpointWidth, OvenBreakpointStyles>>;

export interface OvenHeader {
  slots: { content: OvenSlot };
}

export interface OvenSidebar {
  slots: { content: OvenSlot };
}

export interface OvenComponentDataState {
  error: boolean | string;
  empty: boolean;
  actualValue: any;
  sampleValue: any;
  connected: boolean;
  dataKey: string;
}

export interface OvenComponent {
  id: string;
  definitionId: string;
  slots?: { [key: string]: OvenSlot };
  styles: OvenStyles;
  properties: {
    [key: string]: any;
    dataState?: OvenComponentDataState;
  };
  index?: number;
  actions?: { [key: string]: TriggeredAction[] };
}

export interface OvenLayoutStyles {
  paddings: ComponentPaddings;
}

export interface OvenLayoutProperties {
  header: boolean;
  sidebar: boolean;
}

export interface OvenLayout {
  styles: Partial<Record<BreakpointWidth, OvenLayoutStyles>>;
  properties: OvenLayoutProperties;
}

export interface OvenCompiledLayout {
  styles: OvenLayoutStyles;
  properties: OvenLayoutProperties;
}

export interface OvenBackground {
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'alternate' | 'disabled' | 'hint' | 'transparent';
  imageSrc: OvenImageSrc;
  imageSize: 'auto' | 'contain' | 'cover';
}

export interface OvenImageSrc {
  url: string;
  uploadUrl: string;
  name: string;
  active: 'upload' | 'url';
}

export interface SlotBindings {
  direction?: SlotDirection;
}

export class OvenSlot {
  constructor(public componentList: OvenComponent[] = [], public id: string = nextSlotId()) {
  }
}

export interface OvenSlots {
  [name: string]: OvenSlot;
}

export interface OvenSpaceSlots {
  content: OvenSlot;
}

export enum SpaceHeightType {
  AUTO = 'auto',
  CUSTOM = 'custom',
}

export interface SpaceHeight {
  type: SpaceHeightType;
  customValue: number;
  customUnit: 'px' | '%';
}

export enum SpaceWidthType {
  AUTO = 'auto',
  CUSTOM = 'custom',
}

export interface SpaceWidth {
  type: SpaceWidthType;
  customValue: number;
  customUnit: 'px' | '%' | 'col';
}

export enum FormFieldWidthType {
  FULL = 'full',
  AUTO = 'auto',
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

export interface ProjectProperties {
  type: string;
  description: string;
}

export interface UIPropertyMetaData {
  componentId: string;
  definitionId: string;
  name: string;
}
