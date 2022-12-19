import { Injectable } from '@angular/core';
import {
  AddKitchenComponent, ComponentLogicPropName, KitchenComponent, RemoveKitchenComponent, RootComponentType
} from '@common/public-api';
import { MetaDefinition, WidgetMetaDefinition } from '../definitions/definition';

import { FlourComponent } from '../model';

@Injectable({ providedIn: 'root' })
export class MessageFactoryService {
  removeComponent(virtualComponent: FlourComponent): RemoveKitchenComponent {
    const { parentSlot, component } = virtualComponent;
    return {
      // parentSlotId: parentSlot.id,
      // parentSlotId: null,
      component
    };
  }

  createComponent(virtualComponent: FlourComponent, metaDefinition: MetaDefinition): AddKitchenComponent {
    const component: KitchenComponent = this.invokeFactory(virtualComponent.rootType, metaDefinition);
    // const index = virtualComponent.component.slots.content.componentList.length;
    return this.createNewComponentMsg(virtualComponent, metaDefinition, component, /*index*/ 0);
  }

  createSpaceFromPrototype(
    virtualComponent: FlourComponent,
    metaDefinition: MetaDefinition,
    position: number,
    prototype: KitchenComponent
  ): AddKitchenComponent {
    const component: KitchenComponent = this.cloneSpace(virtualComponent, metaDefinition, prototype);
    return this.createNewComponentMsg(virtualComponent, metaDefinition, component, position);
  }

  private cloneSpace(
    virtualComponent: FlourComponent,
    metaDefinition: MetaDefinition,
    prototype: KitchenComponent
  ): KitchenComponent {
    const component: KitchenComponent = this.invokeFactory(virtualComponent.rootType, metaDefinition);

    component.styles = JSON.parse(JSON.stringify(prototype.styles));
    component.properties = JSON.parse(JSON.stringify(prototype.properties));

    this.removeNotCloneableProperties(component);

    return component;
  }

  private removeNotCloneableProperties(component: KitchenComponent) {
    component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY] = null;
    component.properties[ComponentLogicPropName.CONDITION_PROPERTY] = null;
  }

  private createNewComponentMsg(
    virtualComponent: FlourComponent,
    metaDefinition: MetaDefinition,
    component: KitchenComponent,
    index: number
  ): AddKitchenComponent {
    // const slot = virtualComponent.component.slots.content;
    const msg: AddKitchenComponent = { parentSlotId: '15786492785660.736525773611667', index, component };

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
