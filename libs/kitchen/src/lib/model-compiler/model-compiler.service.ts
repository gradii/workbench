import { Injectable } from '@angular/core';
import { KitchenHeader, KitchenPage, KitchenSidebar, KitchenSlots, KitchenSpaceSlots, Scope, SyncMsg } from '@common/public-api';

import { AppState } from '../workflow/global-state.service';
import { ScopeService } from '../workflow/util/scope.service';
import { PageCompilerService } from './page-compiler.service';
import { ComponentCompilerService } from './component-compiler.service';

@Injectable()
export class ModelCompiler {
  constructor(
    private pageCompiler: PageCompilerService,
    private scopeService: ScopeService,
    private componentCompiler: ComponentCompilerService
  ) {
  }

  compile(syncMsg: SyncMsg, currentAppState: AppState, preview: boolean): SyncMsg {
    const { pageList, header, sidebar } = syncMsg.state;

    // ignore first render with empty model
    if (!header) {
      return syncMsg;
    }

    const updatedPages: KitchenPage[] = this.compilePages(pageList, preview);
    const updatedHeader: KitchenSlots = this.compileHeader(header, preview);
    const updatedSidebar: KitchenSlots = this.compileSidebar(sidebar, preview);

    return this.compileModel(syncMsg, updatedPages, header, sidebar, updatedHeader, updatedSidebar);
  }

  private compilePages(pages: KitchenPage[], preview: boolean): KitchenPage[] {
    return pages.map((page: KitchenPage) => this.pageCompiler.compilePage(page, preview));
  }

  private compileHeader(header: KitchenHeader, preview: boolean): KitchenSlots {
    const scope: Scope = this.scopeService.getGlobalScope();
    return this.componentCompiler.compileSlots(header.slots, scope, preview);
  }

  private compileSidebar(sidebar: KitchenSidebar, preview: boolean): KitchenSlots {
    const scope: Scope = this.scopeService.getGlobalScope();
    return this.componentCompiler.compileSlots(sidebar.slots, scope, preview);
  }

  private compileModel(
    syncMsg: SyncMsg,
    pageList: KitchenPage[],
    header: KitchenHeader,
    sidebar: KitchenSidebar,
    updatedHeader: KitchenSlots,
    updatedSidebar: KitchenSlots
  ): SyncMsg {
    return {
      ...syncMsg,
      state: {
        ...syncMsg.state,
        pageList,
        header: { ...header, slots: (updatedHeader as never) as KitchenSpaceSlots },
        sidebar: { ...sidebar, slots: (updatedSidebar as never) as KitchenSpaceSlots }
      }
    };
  }
}
