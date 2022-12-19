import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UpgradeService } from '@core/upgrade/upgrade.service';
import { TriDialogService } from '@gradii/triangle/dialog';

import { Page } from '@tools-state/page/page.model';
import { tap } from 'rxjs/operators';
import { PageCreateDialogComponent } from '../page-create-dialog/page-create-dialog.component';
import { PageImportDialogComponent } from '../page-import/page-import-dialog.component';

@Component({
  selector       : 'ub-page-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./page-create.component.scss'],
  template       : `
    <tri-icon
      svgIcon="eva-outline:file-add-outline"
      triTooltip="Add Page"
      triTooltipPosition="bottom"
      triTooltipClass="add-pages-tooltip"
      triTooltipTrigger="hover"
      (click)="openForm()"
    >
    </tri-icon>
  `
})
export class PageCreateComponent {
  @Input() pages: Page[];

  @Input() canCreate: boolean;

  @Input() pageImportAvailable: boolean;

  @Output() create = new EventEmitter<Partial<Page>>();

  formActive = false;

  constructor(private dialogService: TriDialogService,
              private upgradeService: UpgradeService) {
  }

  openForm() {
    if (this.canCreate) {
      // this.formActive = true;
      this.dialogService.open(PageCreateDialogComponent, {
        context: {
          pages     : this.pages,
          showImport: this.pageImportAvailable
        }
      }).beforeClosed().pipe(
        tap((page) => {
          if (page) {
            this.onCreate(page);
          }
        })
      ).subscribe();
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
