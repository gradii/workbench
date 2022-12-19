import { Injectable } from '@angular/core';
import {
  BreakpointWidth, combineWith, getUniqueName, KitchenComponent, KitchenImageSrc, nextPageId, nextSlotId
} from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';
import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import {
  ComponentSubEntities, getSlotComponents, getSubEntitiesByComponentList, linkDefinitions
} from '@tools-state/component/component.selectors';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ImageActions, UpdateImageSrc } from '@tools-state/image/image.actions';
import { PageActions } from '@tools-state/page/page.actions';
import { Page } from '@tools-state/page/page.model';

import { getPageById, getPageList } from '@tools-state/page/page.selectors';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotByParentPageId } from '@tools-state/slot/slot.selectors';
import { ComponentHelper } from '@tools-state/util/component.helper';
import { CopierService } from '@tools-state/util/copier.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export interface PageDuplicateData {
  page: Page;
  oldPageId?: string;
  rootSlot: PuffSlot;
  rootComponents: PuffComponent[];
  subEntities: ComponentSubEntities[];
}

@Injectable({ providedIn: 'root' })
export class PageDuplicateService {
  constructor(
    private componentHelper: ComponentHelper,
    private copierService: CopierService,
    private containersHelper: ComponentNameService
  ) {
  }

  duplicate(pageId: string): Observable<any[]> {
    return getPageById(pageId).pipe(
      take(1),
      switchMap((page: Page) => this.getPageDataFromStore(page)),
      switchMap((pageData: PageDuplicateData) => this.duplicatePageList([pageData]))
    );
  }

  duplicatePageList(pageDuplicateDataList: PageDuplicateData[]): Observable<Action[]> {
    return this.clonePageList(pageDuplicateDataList).pipe(
      combineWith((data: PageDuplicateData[]) => this.cloneEntities(data)),
      switchMap((data: [PageDuplicateData[], [PuffComponent[], PuffSlot[]]]) => this.updateLinks(data)),
      map(([pageDataList, componentList, slotList]: [PageDuplicateData[], PuffComponent[], PuffSlot[]]) => {
        const addActions          = [
          ...pageDataList.map((data: PageDuplicateData) => PageActions.AddPage(data.page)),
          ComponentActions.AddComponentList(componentList),
          SlotActions.AddSlotList(slotList)
        ];
        const { page, component } = this.findPageAndComponentToSelect(addActions);
        return [
          ...addActions,
          ProjectActions.UpdateProject(),
          HistoryActions.Persist(),
          PageActions.SetActivePage(page.id, false),
          WorkingAreaActions.SyncState(),
          ComponentActions.SelectComponent([component.id])
        ];
      })
    );
  }

  private clonePageList(pageDataList: PageDuplicateData[]): Observable<PageDuplicateData[]> {
    const pageIdMap: { [id: string]: string } = {};
    return getPageList.pipe(
      take(1),
      map((pages: Page[]) => {
        const pagesNames = pages.map(p => p.name);
        const pagesUrls  = pages.map(p => p.url);
        return pageDataList.map((pageData: PageDuplicateData) => {
          const newPage: Page         = {
            ...JSON.parse(JSON.stringify(pageData.page)),
            id          : nextPageId(),
            name        : getUniqueName(pagesNames, pageData.page.name),
            url         : getUniqueName(pagesUrls, pageData.page.url),
            parentPageId: pageIdMap[pageData.page.parentPageId]
          };
          pageIdMap[pageData.page.id] = newPage.id;
          pagesNames.push(newPage.name);
          pagesUrls.push(newPage.url);
          pageData.oldPageId = pageData.page.id;
          pageData.page      = newPage;
          return pageData;
        });
      })
    );
  }

  private getPageDataFromStore(page: Page): Observable<PageDuplicateData> {
    return getSlotByParentPageId(page.id).pipe(
      take(1),
      combineWith((rootSlot: PuffSlot) => getSlotComponents(rootSlot.id)),
      combineWith(([, rootComponents]: [PuffSlot, PuffComponent[]]) => {
        return getSubEntitiesByComponentList(rootComponents);
      }),
      map(([[rootSlot, rootComponents], subEntities]: [[PuffSlot, PuffComponent[]], ComponentSubEntities[]]) => ({
        page,
        rootSlot,
        rootComponents,
        subEntities
      }))
    );
  }

  private cloneEntities(pageDataList: PageDuplicateData[]): Observable<[PuffComponent[], PuffSlot[]]> {
    const allComponents: PuffComponent[] = [];
    const allSlots: PuffSlot[]                 = [];
    const imagesToUpdate: UpdateImageSrc[] = [];
    for (const pageData of pageDataList) {
      const slotClone: PuffSlot       = {
        ...JSON.parse(JSON.stringify(pageData.rootSlot)),
        id          : nextSlotId(),
        parentPageId: pageData.page.id
      };
      const ctx: ClipboardContext = this.copierService.clone({
        componentList           : pageData.rootComponents,
        componentSubEntitiesList: pageData.subEntities
      });
      ctx.componentList.forEach((component: PuffComponent) => (component.parentSlotId = slotClone.id));
      const { componentList, slotList } = this.componentHelper.extractComponentAndSlotList(ctx);
      allComponents.push(...componentList);
      allSlots.push(slotClone, ...slotList);
      this.collectImagesToCopy(componentList, imagesToUpdate);
    }

    // Copy image assets to current project
    dispatch(ImageActions.UpdateImageSources(imagesToUpdate));

    return this.containersHelper
      .addComponentIndexIfNeeded(allComponents)
      .pipe(map((newComponentList: PuffComponent[]) => [newComponentList, allSlots]));
  }

  private findPageAndComponentToSelect(actions: Action[]): { page: Page; component: PuffComponent } {
    const pageAction: Action         = actions.find(
      (action: Action) => action.type === PageActions.ActionTypes.AddPage);
    const page                       = pageAction.page;
    const slotAction: Action         = actions.find(
      (action: Action) => action.type === SlotActions.ActionTypes.AddSlotList);
    const slot: PuffSlot                 = slotAction.slotList.find(
      (s: PuffSlot) => s.parentPageId === page.id);
    const componentAction: Action    = actions.find(
      (action: Action) => action.type === ComponentActions.ActionTypes.AddComponentList
    );
    const component: PuffComponent = componentAction.componentList.find(
      (c: PuffComponent) => c.parentSlotId === slot.id
    );
    return { page, component };
  }

  private updateLinks([pageDataList, [componentList, slotList]]: [PageDuplicateData[], [PuffComponent[], PuffSlot[]]]) {
    return getPageList.pipe(
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
                path    : ''
              };
            }
          }
        }
        return [pageDataList, componentList, slotList];
      })
    );
  }

  private collectImagesToCopy(components: KitchenComponent[], images: UpdateImageSrc[]) {
    // Loop through cmps and find images with uploadUrls to save in storage and db
    components.forEach((cmp: PuffComponent) => {
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
    imageSrc: KitchenImageSrc,
    cmp: PuffComponent,
    bp: BreakpointWidth
  ) {
    if (this.blobStorageAsset(imageSrc)) {
      const update: UpdateImageSrc = {
        image     : imageSrc.uploadUrl,
        name      : imageSrc.name,
        cmpId     : cmp.id,
        breakpoint: bp
      };
      images.push(update);
    }
  }

  private blobStorageAsset(imageSrc: KitchenImageSrc): boolean {
    return (
      imageSrc &&
      imageSrc.uploadUrl &&
      (imageSrc.active === 'upload' || !imageSrc.url) &&
      // TODO it's a dataurl however this image has to be stored at blob storage
      !imageSrc.uploadUrl.startsWith('data:image')
    );
  }
}
