import { Injectable } from '@angular/core';
import {
  AddOvenComponent,
  ComponentLogicPropName,
  OvenComponent,
  RemoveOvenComponent,
  RootComponentType
} from '@common';

import { VirtualComponent } from '../model';
import { MetaDefinition, WidgetMetaDefinition } from '../definitions/definition';

@Injectable({ providedIn: 'root' })
export class MessageFactoryService {
  removeComponent(virtualComponent: VirtualComponent): RemoveOvenComponent {
    const { parentSlot, component } = virtualComponent;
    return {
      parentSlotId: parentSlot.id,
      component
    };
  }

  createComponent(virtualComponent: VirtualComponent, metaDefinition: MetaDefinition): AddOvenComponent {
    const component: OvenComponent = this.invokeFactory(virtualComponent.rootType, metaDefinition);
    const index = virtualComponent.component.slots.content.componentList.length;
    return this.createNewComponentMsg(virtualComponent, metaDefinition, component, index);
  }

  createSpaceFromPrototype(
    virtualComponent: VirtualComponent,
    metaDefinition: MetaDefinition,
    position: number,
    prototype: OvenComponent
  ): AddOvenComponent {
    const component: OvenComponent = this.cloneSpace(virtualComponent, metaDefinition, prototype);
    return this.createNewComponentMsg(virtualComponent, metaDefinition, component, position);
  }

  private cloneSpace(
    virtualComponent: VirtualComponent,
    metaDefinition: MetaDefinition,
    prototype: OvenComponent
  ): OvenComponent {
    const component: OvenComponent = this.invokeFactory(virtualComponent.rootType, metaDefinition);

    component.styles = JSON.parse(JSON.stringify(prototype.styles));
    component.properties = JSON.parse(JSON.stringify(prototype.properties));

    this.removeNotCloneableProperties(component);

    return component;
  }

  private removeNotCloneableProperties(component: OvenComponent) {
    component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY] = null;
    component.properties[ComponentLogicPropName.CONDITION_PROPERTY] = null;
  }

  private createNewComponentMsg(
    virtualComponent: VirtualComponent,
    metaDefinition: MetaDefinition,
    component: OvenComponent,
    index: number
  ): AddOvenComponent {
    const slot = virtualComponent.component.slots.content;
    const msg: AddOvenComponent = { parentSlotId: slot.id, index, component };

    if ((metaDefinition as WidgetMetaDefinition).previewImage) {
      msg.widgetName = metaDefinition.name;
    }

    return msg;
  }

  private invokeFactory(rootType: RootComponentType, metaDefinition: MetaDefinition) {
    if (
      rootType === RootComponentType.Header &&
      metaDefinition.headerSupport &&
      metaDefinition.definition.inHeaderFactory
    ) {
      return metaDefinition.definition.inHeaderFactory();
    } else if (
      rootType === RootComponentType.Sidebar &&
      metaDefinition.sidebarSupport &&
      metaDefinition.definition.inSidebarFactory
    ) {
      return metaDefinition.definition.inSidebarFactory();
    } else {
      return metaDefinition.definition.factory();
    }
  }
}
