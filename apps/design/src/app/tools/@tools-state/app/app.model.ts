import { PageTreeNode } from '@tools-state/page/page.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryLayout } from '@tools-state/layout/layout.model';
import { StoreItem, Theme, Workflow } from '@common';

export interface BakeryApp {
  rootPageList: PageTreeNode[];
  componentList: BakeryComponent[];
  slotList: Slot[];
  layout: BakeryLayout;
  workflowList: Workflow[];
  storeItemList: StoreItem[];
  theme: Theme;
  favicon: any;
  code: any;

}
