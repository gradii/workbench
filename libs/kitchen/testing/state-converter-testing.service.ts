import { KitchenComponent, KitchenFeature, KitchenSlot } from '@common/public-api';
import { PuffComponent, PuffComponentOrDirective, PuffFeature } from '@tools-state/component/component.model';
import { PuffSlot } from '@tools-state/slot/slot.model';

export class StateConverterTestingService {
  testConvertPage(pageId: string, componentList: PuffComponentOrDirective[], slotList: PuffSlot[]) {
    const slotData: PuffSlot                     = slotList.find((slot: PuffSlot) => slot.parentPageId === pageId);
    const slotComponents: KitchenComponent[] =
            this.getSlotComponentList(slotData.id, componentList as PuffComponent[], slotList);
    const slotDirectives: KitchenComponent[] =
            this.getSlotDirectiveList(slotData.id, componentList as PuffFeature[], slotList);

    return { content: new KitchenSlot(slotComponents, slotData.id, slotDirectives) };
  }

  private getSlotComponentList(slotId: string, componentList: PuffComponent[], slotList: PuffSlot[]): KitchenComponent[] {
    return componentList
      .filter((component: PuffComponent) => component.parentSlotId === slotId)
      .map((component: PuffComponent) => this.convertComponent(component, componentList, slotList))
      .sort((a, b) => a.index - b.index);
  }

  private getSlotDirectiveList(slotId: string, componentList: PuffFeature[], slotList: PuffSlot[]): KitchenFeature[] {
    return componentList
      .filter((component: PuffFeature) => component.hostId === slotId)
      .map((component: PuffFeature) => this.convertDirective(component, componentList, slotList))
      .sort((a, b) => a.index - b.index);
  }


  private convertDirective(
    component: PuffFeature,
    componentList: PuffFeature[],
    slotList: PuffSlot[]
  ): KitchenFeature {
    return {
      id          : component.id,
      definitionId: component.definitionId,
      hostId  : component.hostId,
      styles      : component.styles,
      properties  : component.properties,
      actions     : component.actions,
      index       : component.index
    };
  }

  private convertComponent(
    component: PuffComponent,
    componentList: PuffComponent[],
    slotList: PuffSlot[]
  ): KitchenComponent {
    return {
      id          : component.id,
      definitionId: component.definitionId,
      parentSlotId: component.parentSlotId,
      styles      : component.styles,
      properties  : component.properties,
      actions     : component.actions,
      slots       : this.getComponentSlots(component, componentList, slotList),
      index       : component.index
    };
  }

  private getComponentSlots(
    component: PuffComponent,
    componentList: PuffComponent[],
    slotList: PuffSlot[]
  ): { [key: string]: KitchenSlot } {
    const slots  = {};
    const slotsL = slotList.filter((slot: PuffSlot) => slot.parentComponentId === component.id);

    for (const slot of slotsL) {
      const comps = componentList
        .filter((comp: PuffComponent) => comp.parentSlotId === slot.id)
        .map((comp: PuffComponent) => this.convertComponent(comp, componentList, slotList))
        .sort((a, b) => a.index - b.index);

      slots[slot.name] = new KitchenSlot(comps, slot.id);
    }

    return slots;
  }


}