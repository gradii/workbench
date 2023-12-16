import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';

@Component({
  selector: 'ub-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./history.component.scss'],
  template: `
    <button
      class="bakery-button"
      nbButton
      ghost
      size="tiny"
      title="Undo"
      [disabled]="!(canBack$ | async) || mode === 'preview'"
      (click)="backHistory()"
    >
      <bc-icon name="corner-up-left-outline"></bc-icon>
    </button>

    <button
      class="bakery-button"
      nbButton
      ghost
      size="tiny"
      title="Redo"
      [disabled]="!(canForward$ | async) || mode === 'preview'"
      (click)="forwardHistory()"
    >
      <bc-icon name="corner-up-right-outline"></bc-icon>
    </button>
  `
})
export class HistoryComponent {
  @Input() mode: WorkingAreaMode;

  readonly canForward$ = this.historyFacadeService.canForward$;
  readonly canBack$ = this.historyFacadeService.canBack$;

  constructor(private historyFacadeService: HistoryFacadeService) {
  }

  forwardHistory() {
    this.historyFacadeService.forward();
  }

  backHistory() {
    this.historyFacadeService.back();
  }
}
