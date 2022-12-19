import { KitchenType } from '@common/public-api';
import { PuffActions, PuffProperties } from '@tools-state/component-common.model';
import { PuffStyles } from '@tools-state/component/component.model';


export interface PuffFeature {
  id: string;
  type: KitchenType;
  definitionId: string;
  hostId: string;
  styles: PuffStyles;
  properties: PuffProperties;
  actions?: PuffActions;
  index: number;
}


export type PuffFeatureUpdate = Partial<PuffFeature>;