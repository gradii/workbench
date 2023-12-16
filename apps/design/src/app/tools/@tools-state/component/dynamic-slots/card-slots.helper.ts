import { Injectable } from '@angular/core';
import { UpdateStr } from '@ngrx/entity/src/models';
import { of } from 'rxjs';
import { SpaceWidth, SpaceWidthType } from '@common';

import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';
import { Slot } from '@tools-state/slot/slot.model';
import { BakeryComponent } from '@tools-state/component/component.model';

@Injectable({ providedIn: 'root' })
export class CardSlotsHelper {
  constructor(private dynamicUtils: DynamicUtilsService) {
  }

  determineUpdate(slotList: Slot[], update: UpdateStr<BakeryComponent>) {
    const properties = update.changes.properties;

    const headerSlot = slotList.find((slot: Slot) => slot.name === 'header');
    const footerSlot = slotList.find((slot: Slot) => slot.name === 'footer');

    if (properties && properties.showHeader && !headerSlot) {
      const width: SpaceWidth = { customUnit: 'col', customValue: 12, type: SpaceWidthType.CUSTOM };
      const styles = { justify: 'left', align: 'center', width };
      return this.dynamicUtils.createSlot(update.id, 'header', styles);
    } else if (properties && !properties.showHeader && headerSlot) {
      return this.dynamicUtils.removeSlot(headerSlot);
    }

    if (properties && properties.showFooter && !footerSlot) {
      return this.dynamicUtils.createSlot(update.id, 'footer');
    } else if (properties && !properties.showFooter && footerSlot) {
      return this.dynamicUtils.removeSlot(footerSlot);
    }

    return of([]);
  }
}
