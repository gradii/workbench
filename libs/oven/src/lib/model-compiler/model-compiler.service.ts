import { Injectable } from '@angular/core';
import { OvenHeader, OvenPage, OvenSidebar, OvenSlots, OvenSpaceSlots, Scope, SyncMsg } from '@common';

import { AppState } from '../workflow/global-state.service';
import { ScopeService } from '../workflow/util/scope.service';
import { PageCompilerService } from './page-compiler.service';
import { ComponentCompilerService } from './component-compiler.service';

@Injectable({ providedIn: 'root' })
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

    const updatedPages: OvenPage[] = this.compilePages(pageList, preview);
    const updatedHeader: OvenSlots = this.compileHeader(header, preview);
    const updatedSidebar: OvenSlots = this.compileSidebar(sidebar, preview);

    return this.compileModel(syncMsg, updatedPages, header, sidebar, updatedHeader, updatedSidebar);
  }

  private compilePages(pages: OvenPage[], preview: boolean): OvenPage[] {
    return pages.map((page: OvenPage) => this.pageCompiler.compilePage(page, preview));
  }

  private compileHeader(header: OvenHeader, preview: boolean): OvenSlots {
    const scope: Scope = this.scopeService.getGlobalScope();
    return this.componentCompiler.compileSlots(header.slots, scope, preview);
  }

  private compileSidebar(sidebar: OvenSidebar, preview: boolean): OvenSlots {
    const scope: Scope = this.scopeService.getGlobalScope();
    return this.componentCompiler.compileSlots(sidebar.slots, scope, preview);
  }

  private compileModel(
    syncMsg: SyncMsg,
    pageList: OvenPage[],
    header: OvenHeader,
    sidebar: OvenSidebar,
    updatedHeader: OvenSlots,
    updatedSidebar: OvenSlots
  ): SyncMsg {
    return {
      ...syncMsg,
      state: {
        ...syncMsg.state,
        pageList,
        header: { ...header, slots: (updatedHeader as never) as OvenSpaceSlots },
        sidebar: { ...sidebar, slots: (updatedSidebar as never) as OvenSpaceSlots }
      }
    };
  }
}
