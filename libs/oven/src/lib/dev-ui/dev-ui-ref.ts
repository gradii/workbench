import { OverlayRef } from '@angular/cdk/overlay';
import { RootComponentType } from '@common';

export interface DevUIElementRef {
  dispose();

  update();
}

export class DevUIRef implements DevUIElementRef {
  private elements: DevUIElementRef[] = [];

  constructor(public rootType: RootComponentType) {
  }

  dispose() {
    this.elements.forEach((element: DevUIElementRef) => {
      element.dispose();
    });
  }

  update() {
    this.elements.forEach((element: DevUIElementRef) => {
      element.update();
    });
  }

  attach(element: DevUIElementRef) {
    this.elements.push(element);
  }
}

export class DevUIElementBaseRef implements DevUIElementRef {
  constructor(protected ref: OverlayRef) {
  }

  dispose() {
    this.ref.dispose();
  }

  update() {
    this.ref.updatePosition();
  }
}
