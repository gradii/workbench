import { KitchenType } from '@common/models/kitchen.models';
import { BreakpointWidth } from '@common/models/responsive';
import { PuffActions, PuffProperties } from '@tools-state/component-common.model';

export interface BakeryBreakpointStyles {
  [key: string]: any;
}

export type PuffStyles = Partial<Record<BreakpointWidth, BakeryBreakpointStyles>>;


export interface PuffComponent {
  id: string;
  type: KitchenType;
  definitionId: string;
  parentSlotId: string;
  styles: PuffStyles;
  properties: PuffProperties;
  actions?: PuffActions;
  index: number;
}

export type PuffComponentUpdate = Partial<PuffComponent>;

export const onlyPageLegalComponents = [
  'card',
  'stepper',
  'tabs',
  'map',
  'barChart',
  'bubbleMap',
  'calendar',
  'doughnutChart',
  'lineChart',
  'multipleAxisChart',
  'multipleBarChart',
  'pieChart',
  'radio',
  'table',
  'iframe',
  'smartTable'
];
