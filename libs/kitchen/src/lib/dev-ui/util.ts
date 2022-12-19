import { BreakpointWidth, KitchenComponent, KitchenStyles, RootComponentType } from '@common/public-api';
import { ElementRef } from '@angular/core';

import { FlourComponent } from '../model';

export function isSpace(virtualComponent: FlourComponent | FlourComponent): boolean {
  return virtualComponent && virtualComponent.component.definitionId === 'space';
}

export function isLayoutElement(vc: FlourComponent): boolean {
  return vc && (vc.component.definitionId === 'header' || vc.component.definitionId === 'sidebar');
}

export function getAsElement(virtualComponent: FlourComponent | FlourComponent): HTMLElement {
  if (virtualComponent.view) {
    return virtualComponent.view.element.nativeElement;
  } else {
    return (virtualComponent as FlourComponent).htmlElement;
  }
}

export function getAsElementRef(virtualComponent): ElementRef {
  return virtualComponent.view.element;
}

export function getAsBoundingClientRect(virtualComponent: FlourComponent | FlourComponent): ClientRect {
  return getAsElement(virtualComponent).getBoundingClientRect();
}

export function getParentVirtualComponent(virtualComponent: FlourComponent): FlourComponent {
  return virtualComponent.parentComponent;
}

export function isParent(
  virtualComponent: FlourComponent,
  potentialParentVirtualComponent: FlourComponent
): boolean {
  return virtualComponent.parentComponent === potentialParentVirtualComponent;
}

export function getParentComponent(virtualComponent: FlourComponent): KitchenComponent {
  const parent: FlourComponent = getParentVirtualComponent(virtualComponent);
  return parent && parent.component;
}

export function getAsStyles(virtualComponent: FlourComponent): KitchenStyles {
  return virtualComponent.component.styles;
}

export function getParentDirection(virtualComponent: FlourComponent): 'column' | 'row' {
  const parent        = getParentVirtualComponent(virtualComponent);
  const { direction } = getAsStyles(parent)[BreakpointWidth.Desktop];
  return direction;
}

export function inPage(virtualComponent: FlourComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Page;
}

export function inHeader(virtualComponent: FlourComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Header;
}

export function inSidebar(virtualComponent: FlourComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Sidebar;
}
