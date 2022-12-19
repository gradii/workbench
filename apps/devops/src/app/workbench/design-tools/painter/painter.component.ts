import { ChangeDetectionStrategy, Component } from '@angular/core';
import { dispatch } from '@ngneat/effects';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector       : 'len-painter',
  styleUrls      : ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-layout>
      <div right tag="painter-settings">
        <len-painter-panel *ngIf="showPainter$ | async"></len-painter-panel>
      </div>
    </tri-layout>
  `
})
export class PainterComponent {
  showPainter$: Observable<boolean> = this.themeFacade.activeTheme$.pipe(map(theme => !!theme));

  constructor(private themeFacade: ThemeFacade) {
  }

  ngOnInit() {
    dispatch(WorkingAreaActions.SyncState());
  }
}
