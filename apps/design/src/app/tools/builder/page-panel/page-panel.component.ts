import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page, PageTreeNode, PageUpdate } from '@tools-state/page/page.model';

@Component({
  selector: 'ub-page-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-panel.component.scss'],
  template: `
    <div class="panel-content">
      <div class="panel-header">
        <span>PAGES</span>
        <ub-page-create
          [pages]="pageList$ | async"
          [canCreate]="canCreatePage$ | async"
          [pageImportAvailable]="pageImportAvailable$ | async"
          (create)="onCreate($event)"
        >
        </ub-page-create>
      </div>

      <div class="body">
        <ub-page-filter
          [pageFilter]="pageFilter$ | async"
          (pageFilterChange)="onUpdatePageFilter($event)"
        ></ub-page-filter>

        <ub-page-tree
          [isRoot]="true"
          [pages]="pageTree$ | async"
          [activePage]="activePage$ | async"
          [canRemovePages]="canRemovePages$ | async"
          (select)="onSelect($event)"
          (edit)="enablePageMode()"
          (remove)="onRemove($event)"
          (duplicate)="duplicate($event)"
        >
        </ub-page-tree>
      </div>
    </div>

    <ub-page-update
      *ngIf="updatePageMode"
      [page]="activePage$ | async"
      [pages]="availablePageParentList$ | async"
      (update)="onUpdate($event)"
      (cancel)="disablePageMode()"
    >
    </ub-page-update>
  `
})
export class PagePanelComponent {
  readonly pageList$: Observable<Page[]> = this.pageFacade.pageList$;
  readonly availablePageParentList$: Observable<Page[]> = this.pageFacade.availablePageParentList$;
  readonly pageTree$: Observable<PageTreeNode[]> = this.pageFacade.filteredPageTree$;
  readonly activePage$: Observable<Page> = this.pageFacade.activePage$;
  readonly canRemovePages$: Observable<boolean> = this.pageFacade.canRemovePages$;
  readonly pageFilter$: Observable<string> = this.pageFacade.pageFilter$;
  readonly canCreatePage$: Observable<boolean> = this.pageFacade.canCreatePage$;
  readonly pageImportAvailable$: Observable<boolean> = this.pageFacade.pageImportAvailable$;

  updatePageMode = false;

  constructor(private pageFacade: PageFacade) {
  }

  onCreate(page: Partial<Page>) {
    this.pageFacade.addPage(page);
  }

  onSelect(id: string) {
    this.pageFacade.setActivePageAndSync(id);
  }

  onUpdate(pageUpdate: PageUpdate) {
    this.updatePageMode = false;
    this.pageFacade.updatePage(pageUpdate);
  }

  onRemove(id: string) {
    this.pageFacade.removePage(id);
  }

  duplicate(id: string) {
    this.pageFacade.duplicate(id);
  }

  onUpdatePageFilter(filter: string) {
    this.pageFacade.updateFilter(filter);
  }

  enablePageMode() {
    this.updatePageMode = true;
  }

  disablePageMode() {
    this.updatePageMode = false;
  }
}
