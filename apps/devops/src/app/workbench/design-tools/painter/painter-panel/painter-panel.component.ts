import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Theme } from '@common';
import { Observable } from 'rxjs';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { themeListAnimation, themeSettingsAnimation } from './painter-panel.animation';

@Component({
  selector: 'len-painter-panel',
  styleUrls: ['./painter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [themeSettingsAnimation, themeListAnimation],
  template: `
    <len-theme-list
      *ngIf="!themeEditing"
      @themeListAnimation
      [activeTheme]="activeTheme$ | async"
      [themeList]="themeList$ | async"
      [canCreate]="canCreateTheme$ | async"
      (createNewTheme)="createTheme($event)"
      (selectTheme)="selectTheme($event)"
      (renameTheme)="renameTheme($event)"
      (deleteTheme)="deleteTheme($event)"
      (editTheme)="editTheme($event)"
    ></len-theme-list>
    <len-theme-settings *ngIf="themeEditing" @themeSettingsAnimation (back)="themeEditing = false"></len-theme-settings>
  `
})
export class PainterPanelComponent {
  themeEditing = false;

  themeList$: Observable<Theme[]> = this.themeFacade.themeList$;
  activeTheme$: Observable<Theme> = this.themeFacade.activeTheme$;
  canCreateTheme$: Observable<boolean> = this.themeFacade.canCreateTheme$;

  constructor(private themeFacade: ThemeFacade) {
  }

  editTheme(theme: Theme) {
    this.themeFacade.selectTheme(theme.id);
    this.themeEditing = true;
  }

  createTheme(theme: Theme) {
    this.themeFacade.createTheme(theme);
  }

  selectTheme(id) {
    this.themeFacade.selectTheme(id);
  }

  deleteTheme(id: string) {
    this.themeFacade.deleteTheme(id);
  }

  renameTheme(data: { newName: string; id: string }) {
    this.themeFacade.renameTheme(data);
  }
}
