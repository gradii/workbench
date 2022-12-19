import { KitchenComponent, KitchenSlot } from '@common/public-api';

export class ComponentTreeNode {
  public parentIndex: number = null;
  public fullName?: string;
  public children: ComponentOrSlotTreeNode[];

  constructor(public parentSlotId: string, public kitchenComponent: KitchenComponent, public level: number) {
    this.fullName = kitchenComponent.properties.name;
  }
}

export class SlotTreeNode {
  public parentIndex: number = null;
  public fullName?: string;
  public children: ComponentOrSlotTreeNode[];

  constructor(public parentComponentId: string, public kitchenSlot: KitchenSlot, public level: number) {
  }
}

export type ComponentOrSlotTreeNode = ComponentTreeNode | SlotTreeNode

export interface ComponentTreeNodeVisibility {
  parentVisible: boolean;
  selfVisible: boolean;
}

export interface ComponentTreeRenderNode {
  component: ComponentTreeNode;
  isActive: boolean;
  isCollapsed: boolean;
  isParentCollapsed: boolean;
  visibility: ComponentTreeNodeVisibility;
}
