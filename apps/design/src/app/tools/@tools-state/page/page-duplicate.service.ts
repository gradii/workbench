import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import {
  nextPageId,
  nextSlotId,
  OvenComponent,
  OvenImageSrc,
  combineWith,
  BreakpointWidth,
  getUniqueName,
  nextId
} from '@common';

import { getPageById, getPageList } from '@tools-state/page/page.selectors';
import { fromPages } from '@tools-state/page/page.reducer';
import { Page } from '@tools-state/page/page.model';
import { getSlotByParentPageId } from '@tools-state/slot/slot.selectors';
import { Slot } from '@tools-state/slot/slot.model';
import {
  ComponentSubEntities,
  getSlotComponents,
  getSubEntitiesByComponentList,
  linkDefinitions
} from '@tools-state/component/component.selectors';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ComponentActions } from '@tools-state/component/component.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PageActions } from '@tools-state/page/page.actions';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { CopierService } from '@tools-state/util/copier.service';
import { ImageActions, UpdateImageSrc } from '@tools-state/image/image.actions';

export interface PageDuplicateData {
  page: Page;
  oldPageId?: string;
  rootSlot: Slot;
  rootComponents: BakeryComponent[];
  subEntities: ComponentSubEntities[];
}

@Injectable({ providedIn: 'root' })
export class PageDuplicateService {
  constructor(
    private store: Store<fromPages.State>,
    private componentHelper: ComponentHelper,
    private copierService: CopierService,
    private containersHelper: ComponentNameService
  ) {
  }

  duplicate(pageId: string): Observable<Action[]> {
    return this.store.pipe(
      select(getPageById, pageId),
      take(1),
      switchMap((page: Page) => this.getPageDataFromStore(page)),
      switchMap((pageData: PageDuplicateData) => this.duplicatePageList([pageData]))
    );
  }

  duplicatePageList(pageDuplicateDataList: PageDuplicateData[]): Observable<Action[]> {
    return this.clonePageList(pageDuplicateDataList).pipe(
      combineWith((data: PageDuplicateData[]) => this.cloneEntities(data)),
      switchMap((data: [PageDuplicateData[], [BakeryComponent[], Slot[]]]) => this.updateLinks(data)),
      map(([pageDataList, componentList, slotList]: [PageDuplicateData[], BakeryComponent[], Slot[]]) => {
        const addActions = [
          ...pageDataList.map((data: PageDuplicateData) => new PageActions.AddPage(data.page)),
          new ComponentActions.AddComponentList(componentList),
          new SlotActions.AddSlotList(slotList)
        ];
        const { page, component } = this.findPageAndComponentToSelect(addActions);
        return [
          ...addActions,
          new ProjectActions.UpdateProject(),
          new HistoryActions.Persist(),
          new PageActions.SetActivePage(page.id, false),
          new WorkingAreaActions.SyncState(),
          new ComponentActions.SelectComponent([component.id])
        ];
      })
    );
  }

  private clonePageList(pageDataList: PageDuplicateData[]): Observable<PageDuplicateData[]> {
    const pageIdMap: { [id: string]: string } = {};
    return this.store.pipe(
      select(getPageList),
      take(1),
      map((pages: Page[]) => {
        const pagesNames = pages.map(p => p.name);
        const pagesUrls = pages.map(p => p.url);
        return pageDataList.map((pageData: PageDuplicateData) => {
          const newPage: Page = {
            ...JSON.parse(JSON.stringify(pageData.page)),
            id: nextPageId(),
            name: getUniqueName(pagesNames, pageData.page.name),
            url: getUniqueName(pagesUrls, pageData.page.url),
            parentPageId: pageIdMap[pageData.page.parentPageId]
          };
          pageIdMap[pageData.page.id] = newPage.id;
          pagesNames.push(newPage.name);
          pagesUrls.push(newPage.url);
          pageData.oldPageId = pageData.page.id;
          pageData.page = newPage;
          return pageData;
        });
      })
    );
  }

  private getPageDataFromStore(page: Page): Observable<PageDuplicateData> {
    return this.store.pipe(
      select(getSlotByParentPageId, page.id),
      take(1),
      combineWith((rootSlot: Slot) => this.store.pipe(select(getSlotComponents, rootSlot.id))),
      combineWith(([, rootComponents]: [Slot, BakeryComponent[]]) => {
        return this.store.pipe(select(getSubEntitiesByComponentList, rootComponents));
      }),
      map(([[rootSlot, rootComponents], subEntities]: [[Slot, BakeryComponent[]], ComponentSubEntities[]]) => ({
        page,
        rootSlot,
        rootComponents,
        subEntities
      }))
    );
  }

  private cloneEntities(pageDataList: PageDuplicateData[]): Observable<[BakeryComponent[], Slot[]]> {
    const allComponents: BakeryComponent[] = [];
    const allSlots: Slot[] = [];
    const imagesToUpdate: UpdateImageSrc[] = [];
    for (const pageData of pageDataList) {
      const slotClone: Slot = {
        ...JSON.parse(JSON.stringify(pageData.rootSlot)),
        id: nextSlotId(),
        parentPageId: pageData.page.id
      };
      const ctx: ClipboardContext = this.copierService.clone({
        componentList: pageData.rootComponents,
        componentSubEntitiesList: pageData.subEntities
      });
      ctx.componentList.forEach((component: BakeryComponent) => (component.parentSlotId = slotClone.id));
      const { componentList, slotList } = this.componentHelper.extractComponentAndSlotList(ctx);
      allComponents.push(...componentList);
      allSlots.push(slotClone, ...slotList);
      this.collectImagesToCopy(componentList, imagesToUpdate);
    }

    // Copy image assets to current project
    this.store.dispatch(new ImageActions.UpdateImageSources(imagesToUpdate));

    return this.containersHelper
      .addComponentIndexIfNeeded(allComponents)
      .pipe(map((newComponentList: BakeryComponent[]) => [newComponentList, allSlots]));
  }

  private findPageAndComponentToSelect(actions: Action[]): { page: Page; component: BakeryComponent } {
    const pageAction: Action = actions.find((action: Action) => action.type === PageActions.ActionTypes.AddPage);
    const page = (pageAction as PageActions.AddPage).page;
    const slotAction: Action = actions.find((action: Action) => action.type === SlotActions.ActionTypes.AddSlotList);
    const slot: Slot = (slotAction as SlotActions.AddSlotList).slotList.find((s: Slot) => s.parentPageId === page.id);
    const componentAction: Action = actions.find(
      (action: Action) => action.type === ComponentActions.ActionTypes.AddComponentList
    );
    const component: BakeryComponent = (componentAction as ComponentActions.AddComponentList).componentList.find(
      (c: BakeryComponent) => c.parentSlotId === slot.id
    );
    return { page, component };
  }

  private updateLinks([pageDataList, [componentList, slotList]]: [PageDuplicateData[], [BakeryComponent[], Slot[]]]) {
    return this.store.pipe(
      select(getPageList),
      take(1),
      map((pageList: Page[]) => {
        for (const component of componentList) {
          if (linkDefinitions.includes(component.definitionId) && component.properties.url.pageId) {
            const linkedPageData: PageDuplicateData = pageDataList.find(
              (pageData: PageDuplicateData) => pageData.oldPageId === component.properties.url.pageId
            );
            if (linkedPageData) {
              component.properties.url.pageId = linkedPageData.page.id;
            } else if (!pageList.find((page: Page) => page.id === component.properties.url.pageId)) {
              component.properties.url = {
                external: true,
                path: ''
              };
            }
          }
        }
        return [pageDataList, componentList, slotList];
      })
    );
  }

  private collectImagesToCopy(components: OvenComponent[], images: UpdateImageSrc[]) {
    // Loop through cmps and find images with uploadUrls to save in storage and db
    components.forEach((cmp: BakeryComponent) => {
      // Loop through every breakpoint image
      Object.values(BreakpointWidth).forEach(bp => {
        const styles = cmp.styles[bp];
        if (!styles) {
          return;
        }

        if (cmp.definitionId === 'image') {
          this.extractImageSource(images, styles.src, cmp, bp);
        } else if ((cmp.definitionId === 'space' || cmp.definitionId === 'card') && styles.background) {
          this.extractImageSource(images, styles.background.imageSrc, cmp, bp);
        }
      });
    });
  }

  private extractImageSource(
    images: UpdateImageSrc[],
    imageSrc: OvenImageSrc,
    cmp: BakeryComponent,
    bp: BreakpointWidth
  ) {
    if (this.blobStorageAsset(imageSrc)) {
      const update: UpdateImageSrc = {
        image: imageSrc.uploadUrl,
        name: imageSrc.name,
        cmpId: cmp.id,
        breakpoint: bp
      };
      images.push(update);
    }
  }

  private blobStorageAsset(imageSrc: OvenImageSrc): boolean {
    return (
      imageSrc &&
      imageSrc.uploadUrl &&
      (imageSrc.active === 'upload' || !imageSrc.url) &&
      // TODO it's a dataurl however this image has to be stored at blob storage
      !imageSrc.uploadUrl.startsWith('data:image')
    );
  }
}
