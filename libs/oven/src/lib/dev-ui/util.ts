import { BreakpointWidth, OvenComponent, OvenStyles, RootComponentType } from '@common';
import { ElementRef } from '@angular/core';

import { VirtualComponent } from '../model';

export function isSpace(virtualComponent: VirtualComponent): boolean {
  return virtualComponent && virtualComponent.component.definitionId === 'space';
}

export function isLayoutElement(vc: VirtualComponent): boolean {
  return vc && (vc.component.definitionId === 'header' || vc.component.definitionId === 'sidebar');
}

export function getAsElement(virtualComponent): HTMLElement {
  return virtualComponent.view.element.nativeElement;
}

export function getAsElementRef(virtualComponent): ElementRef {
  return virtualComponent.view.element;
}

export function getAsBoundingClientRect(virtualComponent: VirtualComponent): ClientRect {
  return getAsElement(virtualComponent).getBoundingClientRect();
}

export function getParentVirtualComponent(virtualComponent: VirtualComponent): VirtualComponent {
  return virtualComponent.parentComponent;
}

export function isParent(
  virtualComponent: VirtualComponent,
  potentialParentVirtualComponent: VirtualComponent
): boolean {
  return virtualComponent.parentComponent === potentialParentVirtualComponent;
}

export function getParentComponent(virtualComponent: VirtualComponent): OvenComponent {
  const parent: VirtualComponent = getParentVirtualComponent(virtualComponent);
  return parent && parent.component;
}

export function getAsStyles(virtualComponent: VirtualComponent): OvenStyles {
  return virtualComponent.component.styles;
}

export function getParentDirection(virtualComponent: VirtualComponent): 'column' | 'row' {
  const parent = getParentVirtualComponent(virtualComponent);
  const { direction } = getAsStyles(parent)[BreakpointWidth.Desktop];
  return direction;
}

export function inPage(virtualComponent: VirtualComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Page;
}

export function inHeader(virtualComponent: VirtualComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Header;
}

export function inSidebar(virtualComponent: VirtualComponent): boolean {
  return virtualComponent.rootType === RootComponentType.Sidebar;
}
