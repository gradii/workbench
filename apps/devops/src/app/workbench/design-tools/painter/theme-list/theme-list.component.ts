import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Theme } from '@common';
import { UpgradeService } from '@core/upgrade/upgrade.service';
import { TriDialogService } from '@gradii/triangle/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DeleteThemeComponent } from './delete-theme.component';
import { NewThemeComponent } from './new-theme.component';
import { RenameThemeComponent } from './rename-theme.component';

@Component({
  selector       : 'len-theme-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./theme-list.component.scss'],
  template       : `
    <button triButton fullWidth ghost size="small" class="add-theme-button basic" (click)="newTheme()">
      Add new theme
      <tri-icon svgIcon="outline:plus"></tri-icon>
    </button>
    <div class="divider"></div>
    <len-theme-item
      *ngFor="let theme of themeList"
      [theme]="theme"
      [actions]="true"
      [canBeDeleted]="theme.id !== activeTheme.id"
      [class.active]="theme.id === activeTheme.id"
      (rename)="rename(theme)"
      (delete)="delete(theme)"
      (editClick)="editTheme.emit(theme)"
      (previewClick)="select(theme)"
    ></len-theme-item>
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

  constructor(private dialogService: TriDialogService,
              private upgradeService: UpgradeService) {
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
      .afterClosed().pipe(takeUntil(this.destroyed))
      .subscribe((name: string) => {
        if (name) {
          this.renameTheme.emit({ newName: name, id: theme.id });
        }
      });
  }

  delete(theme: Theme) {
    this.dialogService
      .open(DeleteThemeComponent, { context: { theme } })
      .afterClosed().pipe(takeUntil(this.destroyed))
      .subscribe((deleted: boolean) => {
        if (deleted) {
          this.deleteTheme.emit(theme.id);
        }
      });
  }

  private showCreateThemeDialog(): void {
    this.dialogService
      .open(NewThemeComponent)
      .afterClosed().pipe(takeUntil(this.destroyed))
      .subscribe((newTheme: Theme) => {
        if (newTheme && this.canCreate) {
          this.createNewTheme.emit(newTheme);
        }
      });
  }
}
