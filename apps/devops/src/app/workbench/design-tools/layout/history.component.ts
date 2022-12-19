import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';

@Component({
  selector: 'len-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./history.component.scss'],
  template: `
    <button
      triButton
      variant="text"
      ghost
      [disabled]="!(canBack$ | async) || mode === 'preview'"
      (click)="backHistory()"
    >
      <tri-icon svgIcon="outline:undo"></tri-icon>
    </button>

    <button
      triButton
      variant="text"
      ghost
      [disabled]="!(canForward$ | async) || mode === 'preview'"
      (click)="forwardHistory()"
    >
      <tri-icon svgIcon="outline:redo"></tri-icon>
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
