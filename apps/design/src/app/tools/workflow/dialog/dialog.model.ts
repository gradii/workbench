import { NbComponentStatus } from '@nebular/theme';

export enum WorkflowModalControlType {
  SUBMIT = 'submit',
  CANCEL = 'cancel',
}

export interface WorkflowModalControl {
  type: WorkflowModalControlType;
  text: string;
  appearance?: string;
  status?: NbComponentStatus;
}

export interface WorkflowModalContent {
  headerText: string;
  bodyText: string;
  controls: WorkflowModalControl[];
}

export interface WorkflowModalContext {
  content: WorkflowModalContent;
}
