import { Injectable } from '@angular/core';
import { KitchenApp, KitchenComponent, KitchenPage, KitchenSlot, RootComponentType } from '@common/public-api';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { KitchenState } from '../state/kitchen-state.service';

@Injectable(/*{ providedIn: 'root' }*/)
export class ComponentHelper {
  constructor(private kitchenState: KitchenState) {
  }

  /**
   * Return component list by `ids` array
   */
  getDataForCopy(): Observable<{ components: KitchenComponent[] }> {
    return combineLatest([this.kitchenState.app$, this.kitchenState.activeComponentIdList$]).pipe(
      take(1),
      map(([app, ids]: [KitchenApp, string[]]) => {
        const components = this.getComponentListByIds(app, ids);
        return { components };
      })
    );
  }

  private getComponentListByIds(app: KitchenApp, ids: string[]): KitchenComponent[] {
    const result: KitchenComponent[] = [];
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
    return this.kitchenState.app$.pipe(
      map((app: KitchenApp) => {
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
  findCmpInSlot(slot: KitchenSlot, id: string): KitchenComponent {
    const result: KitchenComponent[] = [];
    this.extractCmps(slot, [id], result, true);
    return result.length ? result[0] : null;
  }

  /**
   * Collect components by ids from page list
   * Universal method used in search
   */
  private extractCmpsFromPages(
    pageList: KitchenPage[],
    ids: string[],
    cmps: KitchenComponent[],
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
  private extractCmps(slot: KitchenSlot, ids: string[], cmps: KitchenComponent[], findFirst: boolean = false): void {
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
