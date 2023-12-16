import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsService, OvenApp, OvenComponent, OvenHeader, OvenPage, OvenSidebar, OvenSlot } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NB_DOCUMENT, NB_WINDOW } from '@nebular/theme';

import { environment } from '../../environments/environment';
import { calcPagesNumber } from '@tools-state/download/download-util';
import { BakeryApp } from '@tools-state/app/app.model';
import { PageTreeNode } from '@tools-state/page/page.model';
import { BakeryComponent } from '@tools-state/component/component.model';
import { Slot } from '@tools-state/slot/slot.model';

@Injectable({ providedIn: 'root' })
export class FBDownloadService {
  private window: Window;
  private document: Document;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private analytics: AnalyticsService,
    @Inject(NB_DOCUMENT) document,
    @Inject(NB_WINDOW) window
  ) {
    this.window = window;
    this.document = document;
  }

  generateApplication(
    app: BakeryApp,
    name: string,
    userData: { email; usingType; industryType; employeesAmount }
  ): Observable<void> {
    const ovenApp = this.convertState(app);
    return this.http
      .post(
        `${environment.apiUrl}/form-builder/generate-application`,
        { app: JSON.stringify(ovenApp), name, ...userData },
        { responseType: 'arraybuffer' }
      )
      .pipe(map((zip: ArrayBuffer) => this.downloadFile(zip, name, ovenApp)));
  }

  convertState(app: BakeryApp): OvenApp {
    return {
      pageList: this.convertPageList(app.rootPageList, app.componentList, app.slotList),
      header: this.buildLayoutPart(app.componentList, app.slotList, 'headerSlot'),
      sidebar: this.buildLayoutPart(app.componentList, app.slotList, 'sidebarSlot'),
      layout: app.layout,
      theme: app.theme,
      workflowList: [],
      storeItemList: [],
      favicon: app.favicon,
      code: app.code,
      uiPropertyData: []
    };
  }

  private convertPageList(
    rootPageList: PageTreeNode[],
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): OvenPage[] {
    return rootPageList.map((page: PageTreeNode) => ({
      id: page.id,
      title: page.name,
      url: page.url,
      layout: page.layout,
      pageList: this.convertPageList(page.children, componentList, slotList),
      slots: this.getPageSlots(page, componentList, slotList)
    }));
  }

  private getPageSlots(page: PageTreeNode, componentList: BakeryComponent[], slotList: Slot[]): { content: OvenSlot } {
    const slotData: Slot = slotList.find((slot: Slot) => slot.parentPageId === page.id);
    const slotComponents: OvenComponent[] = this.getSlotComponentList(slotData.id, componentList, slotList);

    return { content: new OvenSlot(slotComponents, slotData.id) };
  }

  private getSlotComponentList(slotId: string, componentList: BakeryComponent[], slotList: Slot[]): OvenComponent[] {
    return componentList
      .filter((component: BakeryComponent) => component.parentSlotId === slotId)
      .map((component: BakeryComponent) => this.convertComponent(component, componentList, slotList))
      .sort((a, b) => a.index - b.index);
  }

  private convertComponent(
    component: BakeryComponent,
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): OvenComponent {
    return {
      id: component.id,
      definitionId: component.definitionId,
      styles: component.styles,
      properties: component.properties,
      actions: component.actions,
      slots: this.getComponentSlots(component, componentList, slotList),
      index: component.index
    };
  }

  private getComponentSlots(
    component: BakeryComponent,
    componentList: BakeryComponent[],
    slotList: Slot[]
  ): { [key: string]: OvenSlot } {
    const slots = {};
    const slotsL = slotList.filter((slot: Slot) => slot.parentComponentId === component.id);

    for (const slot of slotsL) {
      const comps = componentList
        .filter((comp: BakeryComponent) => comp.parentSlotId === slot.id)
        .map((comp: BakeryComponent) => this.convertComponent(comp, componentList, slotList))
        .sort((a, b) => a.index - b.index);

      slots[slot.name] = new OvenSlot(comps, slot.id);
    }

    return slots;
  }

  private buildLayoutPart(
    componentList: BakeryComponent[],
    slotList: Slot[],
    layoutSlotName: string
  ): OvenHeader | OvenSidebar {
    const layoutSlot = slotList.find((slot: Slot) => slot[layoutSlotName]);
    const slotComponents: OvenComponent[] = this.getSlotComponentList(layoutSlot.id, componentList, slotList);
    return {
      slots: {
        content: new OvenSlot(slotComponents, layoutSlot.id)
      }
    };
  }

  private downloadFile(zip: ArrayBuffer, name: string, app: OvenApp) {
    const blob = new Blob([zip], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const element = this.document.createElement('a');
    element.setAttribute('href', url.toString());
    element.setAttribute('download', `${name}.zip`);
    element.style.display = 'none';
    this.document.body.appendChild(element);
    element.click();
    this.document.body.removeChild(element);

    const size = blob.size / 1024;
    const pagesNumber = calcPagesNumber(app);
    this.analytics.logDownloadCode(name, pagesNumber, `${Math.round(size)} Kb`, 'formBuilder');
  }
}
