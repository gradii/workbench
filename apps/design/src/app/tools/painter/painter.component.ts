import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';

@Component({
  selector: 'ub-painter',
  styleUrls: ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-layout>
      <nb-sidebar right tag="painter-settings">
        <ub-painter-panel *ngIf="showPainter$ | async"></ub-painter-panel>
      </nb-sidebar>
    </nb-layout>
  `
})
export class PainterComponent {
  showPainter$: Observable<boolean> = this.themeFacade.activeTheme$.pipe(map(theme => !!theme));

  constructor(private themeFacade: ThemeFacade, private store: Store<fromWorkingArea.State>) {
  }

  ngOnInit() {
    this.store.dispatch(new WorkingAreaActions.SyncState());
  }
}
