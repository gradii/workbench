import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BreakpointWidth, KitchenComponent, KitchenImageSrc, PasteComponent } from '@common/public-api';

import { PuffComponent } from '@tools-state/component/component.model';
import { ComponentSubEntities } from '@tools-state/component/component.selectors';
import { StateConverterService } from '@shared/communication/state-converter.service';

export interface ClipboardContext {
  componentList: PuffComponent[];
  componentSubEntitiesList: ComponentSubEntities[];
  // source id to check cache (only for selected components)
  id?: string;
  // image source to update after image download
  imageSrc?: KitchenImageSrc;
  error?: string;
  breakpoint?: BreakpointWidth;
}

@Injectable({ providedIn: 'root' })
export class Clipboard {
  private clipboardContext: ClipboardContext;

  constructor(private stateConverter: StateConverterService) {
  }

  get(): ClipboardContext {
    return this.clipboardContext;
  }

  set(context: ClipboardContext) {
    this.clipboardContext = context;
  }

  // Helper method to extract data
  extractContextFromClipboardData(pasteComponent: PasteComponent): Observable<ClipboardContext> {
    return of(pasteComponent).pipe(
      mergeMap((data: PasteComponent) => {
        if (data.error) {
          return this.getEmptyImageWithErrorCtx(data.error, data.image);
        } else if (data.image) {
          return this.getConvertedImageCtx(data);
        } else if (data.selectedComponents) {
          return this.getConvertedComponentsCtx(data);
        }

        throw new Error('Invalid clipboard data');
      })
    );
  }

  // Helper method to convert selected components
  private getConvertedImageCtx(data: PasteComponent): Observable<ClipboardContext> {
    const resultCmps: PuffComponent[]               = [];
    const resultSubEntities: ComponentSubEntities[] = [
      {
        slotList     : [],
        componentList: [],
        featureList  : []
      }
    ];

    const imageSrc = data.image.styles[BreakpointWidth.Desktop].src;
    const curCmp   = this.stateConverter.convertKitchenComponent(data.image);

    resultCmps.push(curCmp);
    return of({
      componentList           : resultCmps,
      componentSubEntitiesList: resultSubEntities,
      imageSrc                : imageSrc,
      breakpoint              : BreakpointWidth.Desktop
    });
  }

  // Helper method to convert selected components
  private getConvertedComponentsCtx(data: PasteComponent): Observable<ClipboardContext> {
    // Check cache
    if (this.clipboardContext && !this.needResetClipboardData(data.id)) {
      return of(this.clipboardContext);
    }

    const resultCmps: PuffComponent[]               = [];
    const resultSubEntities: ComponentSubEntities[] = [];

    data.selectedComponents.forEach(item => {
      resultCmps.push(this.stateConverter.convertKitchenComponent(item));

      const slotList      = [],
            featureList   = [],
            componentList = [];
      const subEntities   = this.stateConverter.getSubEntities(item);
      slotList.push(...subEntities.slots);
      featureList.push(...subEntities.features);
      componentList.push(...subEntities.components);
      resultSubEntities.push({ slotList: slotList, featureList: featureList, componentList: componentList });
    });

    return of({
      componentList           : resultCmps,
      componentSubEntitiesList: resultSubEntities,
      id                      : data.id
    });
  }

  // Returns empty image component context with error
  private getEmptyImageWithErrorCtx(error: string, image: KitchenComponent): Observable<ClipboardContext> {
    const imageSrc: KitchenImageSrc = image.styles[BreakpointWidth.Desktop].src;
    imageSrc.active                 = 'upload';

    return of({
      componentList           : [this.stateConverter.convertKitchenComponent(image)],
      componentSubEntitiesList: [{ slotList: [], featureList: [], componentList: [] }],
      usedStoreItems          : [],
      error                   : error
    });
  }

  // Helper method to avoid extra extracting data if there is no changes in clipboard
  private needResetClipboardData(data: string) {
    const currentSource = this.clipboardContext.id;
    return !currentSource || (currentSource && currentSource !== data);
  }
}
