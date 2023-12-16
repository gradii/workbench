import { ElementRef, Injectable } from '@angular/core';

export interface ClosableInstance {
  hide();
}

interface ClosableItem {
  instance: ClosableInstance;
  element: ElementRef;
}

@Injectable()
export class OverlayDetachHandlerService {
  private selectList: ClosableItem[] = [];

  register(instance: ClosableInstance, element: ElementRef) {
    this.selectList.push({ instance, element });
  }

  deregister(instance: ClosableInstance, element: ElementRef) {
    const indexToRemove = this.selectList.findIndex((item: ClosableItem) => {
      return item.instance === instance && item.element === element;
    });

    if (indexToRemove > -1) {
      this.selectList.splice(indexToRemove, 1);
    }
  }

  detach() {
    this.selectList
      .filter((item: ClosableItem) => document.contains(item.element.nativeElement))
      .forEach((item: ClosableItem) => item.instance.hide());
  }
}
