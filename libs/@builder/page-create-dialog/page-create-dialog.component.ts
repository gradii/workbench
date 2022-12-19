import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TriDialogRef, TriDialogService } from '@gradii/triangle/dialog';
import { Page } from '@tools-state/page/page.model';
import { PageImportDialogComponent } from '../page-import/page-import-dialog.component';

@Component({
  selector       : 'page-create-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ub-page-form
      formTitle="New Page"
      buttonLabel="ADD"
      [pages]="pages"
      [showImport]="showImport"
      (importPage)="openImport()"
      (submitPage)="onCreate($event)"
      (cancel)="closeForm()"
    >
    </ub-page-form>
  `
})
export class PageCreateDialogComponent {
  @Input() pages: Page[];

  @Input() showImport: boolean;


  constructor(
    private dialogService: TriDialogService,
    private dialogRef: TriDialogRef<any>
  ) {
  }

  closeForm() {
    this.dialogRef.close()
  }

  openImport() {
    this.closeForm();
    this.dialogService.open(PageImportDialogComponent);
  }

  onCreate(page: Partial<Page>) {
    this.dialogRef.close(page)
  }
}