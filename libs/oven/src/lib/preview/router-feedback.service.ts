import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { MessageAction, OvenPage } from '@common';

import { OvenState } from '../state/oven-state.service';

/**
 * This service is listening Angular Router events and sends those events to the bakery.
 * We need this service since we ought to synchronize active pages between two applications.
 * That's why when we're doing navigation in oven, using menu or links or whatever in preview mode
 * we just need to notify bakery that route was changed. And in that case bakery will be able to react
 * on that event and activate an appropriate page on its side.
 * */
@Injectable({ providedIn: 'root' })
export class RouterFeedbackService {
  constructor(private router: Router, private state: OvenState) {
  }

  handleRouting(): void {
    const navigationEnd$: Observable<RouterEvent> = this.createNavigationEnd$();

    navigationEnd$
      .pipe(switchMap(() => this.findPage()))
      .subscribe((page: OvenPage) => this.sendPageSelectedMessage(page));
  }

  private createNavigationEnd$(): Observable<any> {
    return this.router.events.pipe(
      withLatestFrom(this.state.showDevUI$),
      filter(([routerEvent, showDevUI]) => !showDevUI && routerEvent instanceof NavigationEnd)
    );
  }

  private findPage(): Observable<Data> {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.data;
  }

  private sendPageSelectedMessage(page: OvenPage): void {
    this.state.emitMessage(MessageAction.PAGE_SELECTED, { id: page.id });
  }
}
