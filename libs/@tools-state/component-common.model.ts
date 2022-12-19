import { TriggeredAction } from '@common/models/data.models';


export interface PuffProperties {
  [key: string]: any;
}

export interface PuffActions {
  [key: string]: TriggeredAction[];
}