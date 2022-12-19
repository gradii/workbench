import { Injectable } from '@angular/core';
import { SpaceWidth, SpaceWidthType } from '@common/public-api';
import { PuffComponent } from '@tools-state/component/component.model';

import { DynamicUtilsService } from '@tools-state/component/dynamic-slots/dynamic-utils.service';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardSlotsHelper {
  constructor(private dynamicUtils: DynamicUtilsService) {
  }

  determineUpdate(slotList: PuffSlot[], update: Partial<PuffComponent>) {
    const properties = update.properties;

    const headerSlot = slotList.find((slot: PuffSlot) => slot.name === 'header');
    const footerSlot = slotList.find((slot: PuffSlot) => slot.name === 'footer');

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
