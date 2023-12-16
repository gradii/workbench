import { OvenComponent } from '@common';

export function isSpace(component: OvenComponent): boolean {
  return !!component && component.definitionId === 'space';
}

export function isLayoutElement(component: OvenComponent): boolean {
  return component.definitionId === 'header' || component.definitionId === 'sidebar';
}
