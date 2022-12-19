import { ButtonColor } from '@gradii/triangle/button';

export enum WorkflowModalControlType {
  SUBMIT = 'submit',
  CANCEL = 'cancel',
}

export interface WorkflowModalControl {
  type: WorkflowModalControlType;
  text: string;
  appearance?: string;
  color?: ButtonColor;
}

export interface WorkflowModalContent {
  headerText: string;
  bodyText: string;
  controls: WorkflowModalControl[];
}

export interface WorkflowModalContext {
  content: WorkflowModalContent;
}
