import { Injectable } from '@angular/core';
import { onlyLatestFrom } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';

import { ComponentLinkService } from '@tools-state/component/component-link.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { getLinkComponents } from '@tools-state/component/component.selectors';
import { PageActions } from '@tools-state/page/page.actions';
import { Page } from '@tools-state/page/page.model';
import { getPageList } from '@tools-state/page/page.selectors';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PageEffects {
  constructor(
    private linkService: ComponentLinkService
  ) {
  }

  syncLinkOnDelete = createEffect((actions) => actions.pipe(
    ofType(PageActions.RemovePageList),
    onlyLatestFrom(getLinkComponents),
    withLatestFrom(getPageList),
    mergeMap(([linkList, pageList]: [PuffComponent[], Page[]]) =>
      this.linkService.syncLinksAfterDelete(pageList, linkList)
    )
  ));
}
