import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { onlyLatestFrom } from '@common';

import { ComponentLinkService } from '@tools-state/component/component-link.service';
import { getLinkComponents } from '@tools-state/component/component.selectors';
import { Page } from '@tools-state/page/page.model';
import { getPageList } from '@tools-state/page/page.selectors';
import { PageActions } from '@tools-state/page/page.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { BakeryComponent } from '@tools-state/component/component.model';

@Injectable()
export class PageEffects {
  constructor(
    private actions$: Actions,
    private linkService: ComponentLinkService,
    private store: Store<fromTools.State>
  ) {
  }

  @Effect()
  syncLinkOnDelete = this.actions$.pipe(
    ofType(PageActions.ActionTypes.RemovePageList),
    onlyLatestFrom(this.store.select(getLinkComponents)),
    withLatestFrom(this.store.select(getPageList)),
    mergeMap(([linkList, pageList]: [BakeryComponent[], Page[]]) =>
      this.linkService.syncLinksAfterDelete(pageList, linkList)
    )
  );
}
