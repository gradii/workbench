import { Injectable } from '@angular/core';
import { ComponentActions } from '@tools-state/component/component.actions';

import { BakeryComponent } from '@tools-state/component/component.model';
import { Page } from '@tools-state/page/page.model';

@Injectable({ providedIn: 'root' })
export class ComponentLinkService {
  constructor() {
  }

  syncLinksAfterDelete(pageList: Page[], linkList: BakeryComponent[]): ComponentActions.UpdateComponent[] {
    return linkList
      .filter((link: BakeryComponent) => !link.properties.url.external)
      .map((link: BakeryComponent) => {
        const page = pageList.find((p: Page) => p.url === link.properties.url.path);
        if (page) {
          return null;
        } else {
          return new ComponentActions.UpdateComponent({
            id: link.id,
            changes: { properties: { ...link.properties, url: { path: '', external: true } } }
          });
        }
      })
      .filter(action => !!action);
  }
}
