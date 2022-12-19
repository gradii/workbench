import { Injectable } from '@angular/core';
import { ComponentActions } from '@tools-state/component/component.actions';

import { PuffComponent } from '@tools-state/component/component.model';
import { Page } from '@tools-state/page/page.model';

@Injectable({ providedIn: 'root' })
export class ComponentLinkService {
  constructor() {
  }

  syncLinksAfterDelete(pageList: Page[], linkList: PuffComponent[]) {
    return linkList
      .filter((link: PuffComponent) => !link.properties.url.external)
      .map((link: PuffComponent) => {
        const page = pageList.find((p: Page) => p.url === link.properties.url.path);
        if (page) {
          return null;
        } else {
          return ComponentActions.UpdateComponent({
            id        : link.id,
            properties: { ...link.properties, url: { path: '', external: true } }
          });
        }
      })
      .filter(action => !!action);
  }
}
