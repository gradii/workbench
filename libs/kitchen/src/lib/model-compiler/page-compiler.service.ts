import { Injectable } from '@angular/core';
import { KitchenPage, KitchenSlot, KitchenSlots, Scope } from '@common/public-api';

import { ScopeService } from '../workflow/util/scope.service';
import { ComponentCompilerService } from './component-compiler.service';

@Injectable()
export class PageCompilerService {
  constructor(private componentCompiler: ComponentCompilerService, private scopeService: ScopeService) {
  }

  compilePage(page: KitchenPage, preview: boolean): KitchenPage {
    const scope: Scope = this.scopeService.getGlobalScope();
    const updatedSlots: KitchenSlots = this.componentCompiler.compileSlots(page.slots, scope, preview);

    if (this.hasSubpages(page)) {
      return this.createPage(page, preview, updatedSlots);
    }

    return { ...page, slots: updatedSlots as { content: KitchenSlot } };
  }

  private hasSubpages(page: KitchenPage): boolean {
    return !!page.pageList && !!page.pageList.length;
  }

  private createPage(page: KitchenPage, preview: boolean, updatedSlots: KitchenSlots): KitchenPage {
    const updatedChildPages: KitchenPage[] = page.pageList.map((childPage: KitchenPage) => {
      return this.compilePage(childPage, preview);
    });
    return { ...page, pageList: updatedChildPages, slots: updatedSlots as { content: KitchenSlot } };
  }
}
