import { OvenComponent } from '@common';

export class ComponentTreeNode {
  public parentIndex: number = null;
  public fullName?: string;

  constructor(public parentSlotId: string, public ovenComponent: OvenComponent, public level: number) {
  }
}

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
