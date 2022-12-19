import { Injectable } from '@angular/core';
import { Scope } from '@common/public-api';

import { GlobalStateService, AppState } from '../global-state.service';

@Injectable()
export class ScopeService {
  constructor(private globalState: GlobalStateService) {
  }

  getGlobalScope(): Scope {
    const scope = new Scope({});
    const state: AppState = this.globalState.getActualState();

    scope.set('state', { ...state.userItems });

    const activeRouteData: { url: string; queryParams: { [key: string]: any } } = this.globalState.getRouteData();
    scope.set('activeRoute', activeRouteData);

    scope.set('localStorage', { ...state.localStorage });

    scope.set('ui', { ...state.componentValues });

    scope.set('routes', { ...state.routes });

    return scope;
  }
}
