import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { KitchenApp, KitchenPage } from '@common/public-api';
import { GlobalStateService } from '../workflow/global-state.service';

import { PageComponent } from './page.component';

/**
 * Angular Router wrapper that is used to provide routing creation interface from pages.
 * */
@Injectable({ providedIn: 'root' })
export class RouterService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalStateService: GlobalStateService) {
  }

  /**
   * Traverses given pages tree and registering appropriate routing configuration.
   * */
  registerPages(state: KitchenApp) {
    const pages                                            = state.routes || state.pageList;
    const pageMap: { [pageName: string]: { url: string } } = {};
    const config: Routes                                   = this.createConfig(pages, null, pageMap);
    this.globalStateService.setPageMap(pageMap);
    // this.router.resetConfig(config);
    return config;
  }

  private createConfig(pages: KitchenPage[], parent: Route, pageMap: { [pageId: string]: { url: string } }): Routes {
    const pagesToProcess: KitchenPage[] = [...pages];
    const routes: Routes             = [];
    for (const page of pagesToProcess) {
      const route: Route = this.createRoute(page, parent, pageMap);
      routes.push(route);
      if (page.pageList && page.pageList.length) {
        routes.push(...this.createConfig(page.pageList, route, pageMap));
      }
    }

    this.withPathMismatchRedirect(routes, parent);

    return routes;
  }

  private createRoute(page: KitchenPage, parent: Route, pageMap: { [pageId: string]: { url: string } }): Route {
    const path          = parent ? `${parent.path}/${page.url}` : page.url;
    pageMap[page.title] = { url: path };
    return {
      path,
      component: PageComponent,
      data     : page
    };
  }

  private withPathMismatchRedirect(routes: Routes, parent: Route) {
    // We need to add this redirect only for root level pages
    if (!parent) {
      const redirectTo = routes.length ? routes[0].path : '/';
      routes.push({ path: '**', redirectTo });
    }
  }
}
