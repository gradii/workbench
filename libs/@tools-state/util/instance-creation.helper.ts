import { Injectable } from '@angular/core';
import {
  BreakpointWidth,
  nextComponentId,
  nextPageId,
  KitchenBreakpointStyles,
  KitchenStyles,
  SpaceHeightType,
  SpaceWidthType, KitchenType
} from '@common/public-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ComponentNameService } from '@tools-state/component/component-name.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { PuffSlot } from '@tools-state/slot/slot.model';

export const defaultSpaceStyles: KitchenBreakpointStyles = {
  justify: 'flex-start',
  align: 'flex-start',
  direction: 'row',
  height: {
    type: SpaceHeightType.AUTO,
    customValue: 48,
    customUnit: 'px'
  },
  overflowX: 'visible',
  overflowY: 'visible',
  width: {
    type: SpaceWidthType.CUSTOM,
    customValue: 12,
    customUnit: 'col'
  },
  visible: true,
  background: {
    color: 'transparent',
    imageSrc: {
      url: '',
      uploadUrl: '',
      name: '',
      active: 'upload'
    },
    imageSize: 'auto'
  }
};

export const defaultTextStyles: KitchenBreakpointStyles = {
  visible: true
};

export const defaultSpaceProperties = {
  name: 'Space',
  container: false
};

export const defaultTextProperties = {
  name: 'Text',
  container: false,
  type: 'paragraph',
  color: 'basic',
  italic: false,
  bold: false,
  alignment: 'left',
  transform: 'none'
};

@Injectable({ providedIn: 'root' })
export class InstanceCreationHelper {
  constructor(private containerService: ComponentNameService) {
  }

  createPageSlot(pageId: string): PuffSlot {
    return {
      id: nextPageId(),
      name: 'content',
      parentPageId: pageId,
    };
  }

  createComponentSlot(componentId: string, name = 'content'): PuffSlot {
    return {
      id: nextComponentId(),
      name,
      parentComponentId: componentId,
    };
  }

  createSpaceComponent(slotId: string, styles: KitchenStyles = {}, index = 0): PuffComponent {
    return {
      id: nextComponentId(),
      type: KitchenType.Component,
      definitionId: 'space',
      parentSlotId: slotId,
      styles: {
        [BreakpointWidth.Desktop]: {
          ...defaultSpaceStyles,
          visible: true,
          ...styles[BreakpointWidth.Desktop]
        },
        [BreakpointWidth.TabletPortrait]: {
          visible: true,
          ...styles[BreakpointWidth.TabletPortrait]
        },
        [BreakpointWidth.TabletLandscape]: {
          visible: true,
          ...styles[BreakpointWidth.TabletLandscape]
        },
        [BreakpointWidth.MobileLandscape]: {
          visible: true,
          ...styles[BreakpointWidth.MobileLandscape]
        },
        [BreakpointWidth.MobilePortrait]: {
          visible: true,
          ...styles[BreakpointWidth.MobilePortrait]
        }
      },
      properties: {
        ...defaultSpaceProperties
      },
      index,
      actions: {
        init: [],
        click: []
      }
    };
  }

  createSpace(slotId: string, styles: KitchenBreakpointStyles = {}, index = 0): Observable<PuffComponent> {
    const space: PuffComponent = this.createSpaceComponent(slotId, styles, index);
    return this.containerService
      .addComponentIndexIfNeeded([space])
      .pipe(map((componentList: [PuffComponent]) => componentList[0]));
  }

  addComponentsUniqueName(spaces: PuffComponent[]): Observable<PuffComponent[]> {
    return this.containerService.addComponentIndexIfNeeded(spaces);
  }

  createText(slotId: string, properties = {}, index = 0): Observable<PuffComponent> {
    const heading: PuffComponent = {
      id: nextComponentId(),
      type: KitchenType.Component,
      definitionId: 'text',
      parentSlotId: slotId,
      styles: {
        [BreakpointWidth.Desktop]: { ...defaultTextStyles }
      },
      properties: {
        ...defaultTextProperties,
        ...properties
      },
      index
    };
    return this.containerService
      .addComponentIndexIfNeeded([heading])
      .pipe(map((componentList: [PuffComponent]) => componentList[0]));
  }
}
