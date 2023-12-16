import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { Page } from '@tools-state/page/page.model';
import { PageImportDialogComponent } from '../page-import/page-import-dialog.component';
import { UpgradeService } from '@core/upgrade/upgrade.service';

@Component({
  selector: 'ub-page-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-create.component.scss'],
  template: `
    <ub-page-form
      *ngIf="formActive"
      formTitle="New Page"
      buttonLabel="ADD"
      [pages]="pages"
      [showImport]="pageImportAvailable"
      (importPage)="openImport()"
      (submitPage)="onCreate($event)"
      (cancel)="closeForm()"
    >
    </ub-page-form>
    <nb-icon
      icon="file-add"
      nbTooltip="Add Page"
      nbTooltipPlacement="bottom"
      nbTooltipClass="add-pages-tooltip"
      nbTooltipTrigger="hover"
      (click)="openForm()"
    >
    </nb-icon>
  `
})
export class PageCreateComponent {
  @Input() pages: Page[];

  @Input() canCreate: boolean;

  @Input() pageImportAvailable: boolean;

  @Output() create = new EventEmitter<Partial<Page>>();

  formActive = false;

  constructor(private dialogService: NbDialogService, private upgradeService: UpgradeService) {
  }

  openForm() {
    if (this.canCreate) {
      this.formActive = true;
    } else {
      this.upgradeService.accessNewPageRequest();
    }
  }

  closeForm() {
    this.formActive = false;
  }

  openImport() {
    this.closeForm();
    this.dialogService.open(PageImportDialogComponent);
  }

  onCreate(page: Partial<Page>) {
    if (this.canCreate) {
      this.create.emit(page);
      this.formActive = false;
    }
  }
}
