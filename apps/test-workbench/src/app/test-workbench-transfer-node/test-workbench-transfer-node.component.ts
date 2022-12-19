import { Component, OnInit } from '@angular/core';
import { KitchenComponent, KitchenContentSlot, KitchenSlot } from '@common';
import { moveItemInArray, transferArrayItem, ɵTriDropContainer } from '@gradii/triangle/dnd';
import {
  accordionFactory, buttonFactory, cardFactory, spaceFactory
} from 'libs/kitchen/src/lib/definitions/components-definitions';
import { data } from '../data';

@Component({
  selector   : 'devops-tools-test-workbench-transfer-node',
  templateUrl: './test-workbench-transfer-node.component.html',
  styleUrls  : ['./test-workbench-transfer-node.component.scss']
})
export class TestWorkbenchTransferNodeComponent implements OnInit {

  pageData: any = data;

  connectedTo: any[] = [];

  components = [
    {
      factory: buttonFactory,
      label: 'Button'
    },
    {
      factory: cardFactory,
      label: 'Card'
    },
    {
      factory: accordionFactory,
      label: 'accordion'
    },
    {
      factory: spaceFactory,
      label: 'space'
    }
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.runtimeDirectives.forEach((directive) => {
    //   console.log(directive);
    // });
  }

  descend(slot: KitchenSlot | KitchenContentSlot, targetId: string): KitchenSlot | KitchenContentSlot | null {
    const { id, componentList } = slot;
    if (id === targetId) {
      return slot;
    } else {
      for (const component of componentList) {
        if(component.contentSlot) {
          const result = this.descend(component.contentSlot, targetId);
          if (result) {
            return result;
          }
        }
        for (const slot of Object.values(component.slots || {})) {
          const result = this.descend(slot, targetId);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  onTransferArrayItem(event: {
    component: any,
    currentContainer: any,
    targetContainer: any,
    currentIndex: number,
    targetIndex: number
  }) {
    console.log(event);
    const { component, currentContainer, targetContainer, currentIndex, targetIndex } = event;

    // check drag container item
    if (!currentContainer?.slotId) {
      // add component to slot
      const targetSlot = this.descend(this.pageData.content, targetContainer.slotId);
      if (targetSlot) {
        for (let i = targetSlot.componentList.length; i > targetIndex; i--) {
          targetSlot.componentList[i] = targetSlot.componentList[i - 1];
        }

        const comp        = component.factory();
        comp.parentSlotId = targetSlot.id;

        targetSlot.componentList[targetIndex] = comp;

        for (let i = 0; i < targetSlot.componentList.length; i++) {
          targetSlot.componentList[i].index = i;
        }

        this.pageData = { ...this.pageData };
      }

      return;
    }

    const currentSlot = this.descend(this.pageData.content, currentContainer.slotId);
    const targetSlot  = this.descend(this.pageData.content, targetContainer.slotId);

    if (currentSlot && targetSlot) {
      transferArrayItem(currentSlot.componentList, targetSlot.componentList, currentIndex, targetIndex);
      currentSlot.componentList.forEach((component, index) => {
        if (ngDevMode) {
          if (component.index !== index) {
            console.info(`component ${component.id} index changed from ${component.index} to ${index}`);
          }
        }
        component.parentSlotId = currentSlot.id;
        component.index = index;
      });
      targetSlot.componentList.forEach((component, index) => {
        if (ngDevMode) {
          if (component.index !== index) {
            console.info(`component ${component.id} index changed from ${component.index} to ${index}`);
          }
        }
        component.parentSlotId = targetSlot.id;
        component.index = index;
      });
      this.pageData = { ...this.pageData };
    }
  }

  onMoveItemInArray(event: {
    component: KitchenComponent,
    currentContainer: any,
    currentIndex: number,
    targetIndex: number
  }) {
    console.log(event);
    const { component, currentContainer, currentIndex, targetIndex } = event;

    const slot = this.descend(this.pageData.content, currentContainer.slotId);

    if (slot) {
      moveItemInArray(slot.componentList, currentIndex, targetIndex);
      slot.componentList.forEach((component, index) => {
        if (ngDevMode) {
          if (component.index !== index) {
            console.info(`component ${component.id} index changed from ${component.index} to ${index}`);
          }
        }
        component.index = index;
      });
      this.pageData = { ...this.pageData };
    }
  }

  onDropContainersChange(list: ɵTriDropContainer[]) {
    this.connectedTo = list;
    console.log(list);
  }
}
