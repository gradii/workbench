import { Injectable } from '@angular/core';
import { OvenPage, OvenSlot, OvenSlots, Scope } from '@common';

import { ScopeService } from '../workflow/util/scope.service';
import { ComponentCompilerService } from './component-compiler.service';

@Injectable({ providedIn: 'root' })
export class PageCompilerService {
  constructor(private componentCompiler: ComponentCompilerService, private scopeService: ScopeService) {
  }

  compilePage(page: OvenPage, preview: boolean): OvenPage {
    const scope: Scope = this.scopeService.getGlobalScope();
    const updatedSlots: OvenSlots = this.componentCompiler.compileSlots(page.slots, scope, preview);

    if (this.hasSubpages(page)) {
      return this.createPage(page, preview, updatedSlots);
    }

    return { ...page, slots: updatedSlots as { content: OvenSlot } };
  }

  private hasSubpages(page: OvenPage): boolean {
    return !!page.pageList && !!page.pageList.length;
  }

  private createPage(page: OvenPage, preview: boolean, updatedSlots: OvenSlots): OvenPage {
    const updatedChildPages: OvenPage[] = page.pageList.map((childPage: OvenPage) => {
      return this.compilePage(childPage, preview);
    });
    return { ...page, pageList: updatedChildPages, slots: updatedSlots as { content: OvenSlot } };
  }
}
