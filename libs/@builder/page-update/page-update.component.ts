import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Page, PageUpdate } from '@tools-state/page/page.model';

@Component({
  selector: 'ub-page-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-page-form
      formTitle="Update Page"
      buttonLabel="UPDATE"
      [page]="page"
      [pages]="pages"
      (submitPage)="onUpdate($event)"
      (cancel)="cancel.emit()"
    >
    </ub-page-form>
  `
})
export class PageUpdateComponent {
  @Input() page: Page;
  @Input() pages: Page[];

  @Output() update = new EventEmitter<PageUpdate>();
  @Output() cancel = new EventEmitter<void>();

  onUpdate(changes: Partial<Page>) {
    this.update.emit({ id: this.page.id, changes });
  }
}
