import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Theme } from '@common';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DeleteThemeComponent } from './delete-theme.component';
import { NewThemeComponent } from './new-theme.component';
import { RenameThemeComponent } from './rename-theme.component';
import { UpgradeService } from '@core/upgrade/upgrade.service';

@Component({
  selector: 'ub-theme-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-list.component.scss'],
  template: `
    <button nbButton fullWidth ghost size="small" class="add-theme-button basic" (click)="newTheme()">
      Add new theme
      <nb-icon icon="plus"></nb-icon>
    </button>
    <div class="divider"></div>
    <ub-theme-item
      *ngFor="let theme of themeList"
      [theme]="theme"
      [actions]="true"
      [canBeDeleted]="theme.id !== activeTheme.id"
      [class.active]="theme.id === activeTheme.id"
      (rename)="rename(theme)"
      (delete)="delete(theme)"
      (editClick)="editTheme.emit(theme)"
      (previewClick)="select(theme)"
    ></ub-theme-item>
  `
})
export class ThemeListComponent implements OnDestroy {
  @Input() activeTheme: Theme;

  @Input() themeList: Theme[];

  @Input() canCreate: boolean;

  @Output() editTheme: EventEmitter<Theme> = new EventEmitter<Theme>();

  @Output() selectTheme: EventEmitter<string> = new EventEmitter<string>();

  @Output() deleteTheme: EventEmitter<string> = new EventEmitter<string>();

  @Output() renameTheme: EventEmitter<{ id: string; newName: string }> = new EventEmitter<{
    id: string;
    newName: string;
  }>();

  @Output() createNewTheme: EventEmitter<Theme> = new EventEmitter<Theme>();

  private destroyed: Subject<void> = new Subject<void>();

  constructor(private dialogService: NbDialogService, private upgradeService: UpgradeService) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  select(theme: Theme) {
    if (this.activeTheme.id !== theme.id) {
      this.selectTheme.emit(theme.id);
    }
  }

  newTheme() {
    if (this.canCreate) {
      this.showCreateThemeDialog();
    } else {
      this.upgradeService.accessThemeRequest();
    }
  }

  rename(theme: Theme) {
    this.dialogService
      .open(RenameThemeComponent, { context: { theme } })
      .onClose.pipe(takeUntil(this.destroyed))
      .subscribe((name: string) => {
        if (name) {
          this.renameTheme.emit({ newName: name, id: theme.id });
        }
      });
  }

  delete(theme: Theme) {
    this.dialogService
      .open(DeleteThemeComponent, { context: { theme } })
      .onClose.pipe(takeUntil(this.destroyed))
      .subscribe((deleted: boolean) => {
        if (deleted) {
          this.deleteTheme.emit(theme.id);
        }
      });
  }

  private showCreateThemeDialog(): void {
    this.dialogService
      .open(NewThemeComponent)
      .onClose.pipe(takeUntil(this.destroyed))
      .subscribe((newTheme: Theme) => {
        if (newTheme && this.canCreate) {
          this.createNewTheme.emit(newTheme);
        }
      });
  }
}
