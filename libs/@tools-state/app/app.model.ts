import { ActionDiagram, ActionFlow, StoreItem, Theme, Workflow } from '@common/public-api';
import { PuffComponent } from '@tools-state/component/component.model';
import { PuffFeature } from '@tools-state/feature/feature.model';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { PageTreeNode } from '@tools-state/page/page.model';
import { PuffSlot } from '@tools-state/slot/slot.model';

export interface PuffApp {
  rootPageList: PageTreeNode[];
  componentList: PuffComponent[];
  featureList: PuffFeature[];
  slotList: PuffSlot[];
  layout: BakeryLayout;
  actionDiagramList: ActionDiagram[];
  actionFlowList: ActionFlow[];
  workflowList: Workflow[];
  storeItemList: StoreItem[];
  theme: Theme;
  favicon: any;
  code: any;

}
