import { Injectable } from '@angular/core';
import {
  ComponentLogicPropName,
  InterpolationType,
  KitchenActions,
  KitchenComponent,
  KitchenSlot,
  KitchenSlots,
  KitchenStyles,
  Scope,
  SequenceProperty
} from '@common/public-api';

import { DataValidator } from '../workflow/data/data-validator.service';
import { ConditionExecutorService } from './condition-executor.service';
import { IdRemapperService } from './id-remapper.service';
import { PropertiesCompilerService } from './properties-compiler.service';
import { InterpolateService } from '../workflow/util/interpolate.service';

@Injectable()
export class ComponentCompilerService {
  constructor(
    private dataValidator: DataValidator,
    private conditionExecutor: ConditionExecutorService,
    private interpolateService: InterpolateService,
    private idRemapper: IdRemapperService,
    private propertiesCompiler: PropertiesCompilerService
  ) {
  }

  compileSlots(slots: { [name: string]: KitchenSlot }, scope: Scope, preview: boolean): { [name: string]: KitchenSlot } {
    if (!Object.entries(slots).length) {
      return null;
    }

    const slotList: { [name: string]: KitchenSlot }[] = Object.entries(slots).map(([slotName, slot]) => {
      const componentList: KitchenComponent[] = this.processSlotComponents(slot, scope, preview);
      return { [slotName]: { ...slot, componentList } };
    });

    let slotBag: { [name: string]: KitchenSlot } = {};

    for (const slot of slotList) {
      slotBag = { ...slotBag, ...slot };
    }

    return slotBag;
  }

  private processSlotComponents(slot: KitchenSlot, scope: Scope, preview: boolean): KitchenComponent[] {
    if (!slot.componentList.length) {
      return [];
    }

    return (
      slot.componentList
        .map((component: KitchenComponent) => {
          return this.processComponent(component, scope, preview);
        })
        .flat()
        /**
         * Because we're rendering all the components at the specific indexes at renderer.service.ts
         * we need to make sure that all the components in the slot have appropriate indexes increasing
         * one by one.
         *
         * In case of removing some elements using show condition or rendering multiple elements with
         * the sequence statement we're messing all the indexes in the slot.
         *
         * That's why we're just assigning new indexes here.
         *
         * This operation ought to be safe since we're doing that only in preview mode where we have no
         * functionalities that operate with indexes like drag and drop.
         */
        .map((component: KitchenComponent, index: number) => {
          return { ...component, index };
        })
    );
  }

  private processComponent(component: KitchenComponent, scope: Scope, preview: boolean): KitchenComponent[] {
    const sequence: SequenceProperty = component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY];

    if (!sequence || !sequence.code) {
      const comp = this.createComponent(component, scope, preview);
      return comp ? [comp] : [];
    }

    const iterableData = this.interpolateService.interpolateSafe(sequence.code, scope, InterpolationType.CODE);

    const hasItems: boolean = iterableData && Array.isArray(iterableData) && iterableData.length > 0;

    if (!preview) {
      const firstItem = hasItems ? iterableData[0] : null;
      const devScope = new Scope(scope.values, {
        [sequence.itemName]: firstItem,
        [sequence.indexName]: 0
      });
      const comp = this.createComponent(component, devScope, preview);
      return comp ? [comp] : [];
    }

    if (!hasItems) {
      return [];
    }

    const components: KitchenComponent[] = iterableData.map((item: any, index: number) => {
      const childScope: Scope = new Scope(scope.values, {
        [sequence.itemName]: item,
        [sequence.indexName]: index
      });
      return this.createComponent(component, childScope, preview);
    });

    const comps = components.filter(c => !!c);
    return this.idRemapper.remapComponentsIds(comps);
  }

  private createComponent(component: KitchenComponent, scope: Scope, preview: boolean): KitchenComponent {
    const shouldRender: boolean = this.conditionExecutor.shouldRenderComponent(component, preview, scope);

    if (!shouldRender) {
      return null;
    }

    const updatedComponent: KitchenComponent = this.compileProperties(component, scope, preview);

    if (this.hasSlots(component)) {
      return this.createSlots(updatedComponent, scope, preview);
    }

    return updatedComponent;
  }

  private compileProperties(component: KitchenComponent, scope: Scope, preview: boolean): KitchenComponent {
    const updatedPropertiesAndStyles: {
      styles: KitchenStyles;
      properties: any;
      actions: KitchenActions;
    } = this.propertiesCompiler.compileProperties(component, scope, preview);
    return {
      ...component,
      properties: updatedPropertiesAndStyles.properties,
      styles: updatedPropertiesAndStyles.styles,
      actions: updatedPropertiesAndStyles.actions
    };
  }

  private hasSlots(component: KitchenComponent): boolean {
    return !!component.slots && !!Object.keys(component.slots).length;
  }

  private createSlots(updatedComponent: KitchenComponent, scope: Scope, preview: boolean): KitchenComponent {
    const slots: KitchenSlots = this.compileSlots(updatedComponent.slots, scope, preview);
    return { ...updatedComponent, slots };
  }
}
