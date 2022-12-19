import { KitchenComponent } from '@common/public-api';

export function isSpace(component: KitchenComponent): boolean {
  return !!component && component.definitionId === 'space';
}

export function isLayoutElement(component: KitchenComponent): boolean {
  return component.definitionId === 'header' || component.definitionId === 'sidebar';
}
