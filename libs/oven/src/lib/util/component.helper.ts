import { Injectable } from '@angular/core';
import { OvenApp, OvenComponent, OvenPage, OvenSlot, RootComponentType } from '@common';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { OvenState } from '../state/oven-state.service';

@Injectable({ providedIn: 'root' })
export class ComponentHelper {
  constructor(private ovenState: OvenState) {
  }

  /**
   * Return component list by `ids` array
   */
  getDataForCopy(): Observable<{ components: OvenComponent[] }> {
    return combineLatest([this.ovenState.app$, this.ovenState.activeComponentIdList$]).pipe(
      take(1),
      map(([app, ids]: [OvenApp, string[]]) => {
        const components = this.getComponentListByIds(app, ids);
        return { components };
      })
    );
  }

  private getComponentListByIds(app: OvenApp, ids: string[]): OvenComponent[] {
    const result: OvenComponent[] = [];
    // Collect components from header
    this.extractCmps(app.header.slots.content, ids, result);

    // Collect components from header
    this.extractCmps(app.sidebar.slots.content, ids, result);

    // Collect components from page list
    this.extractCmpsFromPages(app.pageList, ids, result);

    return result;
  }

  /**
   * Return `true` if component in header, otherwise - `false`
   */
  findComponentRootType(id: string): Observable<RootComponentType> {
    return this.ovenState.app$.pipe(
      map((app: OvenApp) => {
        if (this.findCmpInSlot(app.header.slots.content, id)) {
          return RootComponentType.Header;
        }

        if (this.findCmpInSlot(app.sidebar.slots.content, id)) {
          return RootComponentType.Sidebar;
        }

        return RootComponentType.Page;
      })
    );
  }

  /**
   * Return component by id from header
   */
  findCmpInSlot(slot: OvenSlot, id: string): OvenComponent {
    const result: OvenComponent[] = [];
    this.extractCmps(slot, [id], result, true);
    return result.length ? result[0] : null;
  }

  /**
   * Collect components by ids from page list
   * Universal method used in search
   */
  private extractCmpsFromPages(
    pageList: OvenPage[],
    ids: string[],
    cmps: OvenComponent[],
    findFirst: boolean = false
  ): void {
    for (const page of pageList) {
      // Extract cmps from current page
      this.extractCmps(page.slots.content, ids, cmps, findFirst);
      // Check if there is another pages
      if (page.pageList && page.pageList.length) {
        this.extractCmpsFromPages(page.pageList, ids, cmps, findFirst);
      }
    }
  }

  /**
   * Collect components by ids from header
   * Universal method used in search
   */
  private extractCmps(slot: OvenSlot, ids: string[], cmps: OvenComponent[], findFirst: boolean = false): void {
    for (const component of slot.componentList) {
      if (ids.includes(component.id)) {
        cmps.push(component);
      }
      if (component.slots) {
        for (const [, cmpSlot] of Object.entries(component.slots)) {
          this.extractCmps(cmpSlot, ids, cmps, findFirst);
        }
      }
    }
  }
}
