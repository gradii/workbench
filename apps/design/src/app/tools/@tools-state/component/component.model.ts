import { UpdateStr } from '@ngrx/entity/src/models';
import { BreakpointWidth, TriggeredAction } from '@common';

export interface BakeryBreakpointStyles {
  [key: string]: any;
}

export type BakeryStyles = Partial<Record<BreakpointWidth, BakeryBreakpointStyles>>;

export interface BakeryProperties {
  [key: string]: any;
}

export interface BakeryActions {
  [key: string]: TriggeredAction[];
}

export interface BakeryComponent {
  id: string;
  definitionId: string;
  parentSlotId: string;
  styles: BakeryStyles;
  properties: BakeryProperties;
  actions?: BakeryActions;
  index: number;
}

export type BakeryComponentUpdate = UpdateStr<BakeryComponent>;

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
