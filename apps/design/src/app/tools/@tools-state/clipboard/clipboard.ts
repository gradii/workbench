import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BreakpointWidth, OvenComponent, OvenImageSrc, PasteComponent } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentSubEntities } from '@tools-state/component/component.selectors';
import { StateConverterService } from '@shared/communication/state-converter.service';

export interface ClipboardContext {
  componentList: BakeryComponent[];
  componentSubEntitiesList: ComponentSubEntities[];
  // source id to check cache (only for selected components)
  id?: string;
  // image source to update after image download
  imageSrc?: OvenImageSrc;
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
      })
    );
  }

  // Helper method to convert selected components
  private getConvertedImageCtx(data: PasteComponent): Observable<ClipboardContext> {
    const resultCmps: BakeryComponent[] = [];
    const resultSubEntities: ComponentSubEntities[] = [{ slotList: [], componentList: [] }];

    const imageSrc = data.image.styles[BreakpointWidth.Desktop].src;
    const curCmp = this.stateConverter.convertOvenComponent(data.image);

    resultCmps.push(curCmp);
    return of({
      componentList: resultCmps,
      componentSubEntitiesList: resultSubEntities,
      imageSrc: imageSrc,
      breakpoint: BreakpointWidth.Desktop
    });
  }

  // Helper method to convert selected components
  private getConvertedComponentsCtx(data: PasteComponent): Observable<ClipboardContext> {
    // Check cache
    if (this.clipboardContext && !this.needResetClipboardData(data.id)) {
      return of(this.clipboardContext);
    }

    const resultCmps: BakeryComponent[] = [];
    const resultSubEntities: ComponentSubEntities[] = [];

    data.selectedComponents.forEach(item => {
      resultCmps.push(this.stateConverter.convertOvenComponent(item));

      const slotList = [],
        componentList = [];
      const subEntities = this.stateConverter.getSubEntities(item);
      slotList.push(...subEntities.slots);
      componentList.push(...subEntities.components);
      resultSubEntities.push({ slotList: slotList, componentList: componentList });
    });

    return of({
      componentList: resultCmps,
      componentSubEntitiesList: resultSubEntities,
      id: data.id
    });
  }

  // Returns empty image component context with error
  private getEmptyImageWithErrorCtx(error: string, image: OvenComponent): Observable<ClipboardContext> {
    const imageSrc: OvenImageSrc = image.styles[BreakpointWidth.Desktop].src;
    imageSrc.active = 'upload';

    return of({
      componentList: [this.stateConverter.convertOvenComponent(image)],
      componentSubEntitiesList: [{ slotList: [], componentList: [] }],
      usedStoreItems: [],
      error: error
    });
  }

  // Helper method to avoid extra extracting data if there is no changes in clipboard
  private needResetClipboardData(data: string) {
    const currentSource = this.clipboardContext.id;
    return !currentSource || (currentSource && currentSource !== data);
  }
}
