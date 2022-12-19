import { ElementRef, InjectionToken, Provider, Type, ViewRef } from '@angular/core';
import { KitchenComponent, SyncReasonMsg } from '@common/public-api';
import { Observable } from 'rxjs';

import { Slot } from './definition-utils';
import { KitchenDataValidator } from '../workflow/data/data-validator.service';

export const COMPONENT_DEFINITION = new InjectionToken('Component Definition');
export const COMPONENT_META_DEFINITION = new InjectionToken('Component Meta Definition');

export const WIDGET_META_DEFINITION = new InjectionToken('Widget Meta Definition');

export type ComponentPropsMapper = (instance, props) => void;

// TODO get rid of these any
export interface Definition {
  id: string;
  componentType: Type<any>;
  definition: Type<any>;
  dataTrigger?: boolean;
  dataConsumer?: boolean;
  dataValidator?: KitchenDataValidator;
  propsMapper?: ComponentPropsMapper;

  factory(bindings?: any): KitchenComponent;

  inHeaderFactory?(bindings?: any): KitchenComponent;

  inSidebarFactory?(bindings?: any): KitchenComponent;
}

export interface MetaDefinition {
  definition: Definition;
  name: string;
  icon: string;
  order: number;
  headerSupport: boolean;
  sidebarSupport: boolean;
  locked?: boolean;
  tags: string[];
}

export interface WidgetMetaDefinition extends MetaDefinition {
  previewImage: string;
}

export function createDefinitionProvider(definition: Definition): Provider {
  return {
    provide: COMPONENT_DEFINITION,
    useValue: definition,
    multi: true,
  };
}

export function createMetaDefinitionProvider(metaDefinition: MetaDefinition): Provider {
  return {
    provide: COMPONENT_META_DEFINITION,
    useValue: metaDefinition,
    multi: true
  };
}

export function createWidgetMetaDefinitionProvider(metaDefinition: WidgetMetaDefinition): Provider {
  return {
    provide: WIDGET_META_DEFINITION,
    useValue: metaDefinition,
    multi: true
  };
}

export interface DefinitionContext<T> {
  view?: View<T>;
  devUIEnabled$?: Observable<boolean>;
  syncReason?: SyncReasonMsg;
  component?: KitchenComponent;
}

export class View<T> {
  instance: T;
  slots: {
    [key: string]: Slot;
  };
  viewRef?: ViewRef;
  element: ElementRef;
  properties$?: Observable<any>;
  elementChange$?: Observable<ElementRef>;
  draggable$?: Observable<boolean>;
  editable$?: Observable<boolean>;

  updateDynamicSlots?(): void;
}
