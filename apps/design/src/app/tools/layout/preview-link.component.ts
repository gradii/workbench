import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsService } from '@common';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { fromWorkingArea } from '@tools-state/working-area/working-area.reducer';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';

@Component({
  selector: 'ub-preview-link',
  styleUrls: ['./preview-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      nbButton
      class="bakery-button preview-link"
      [routerLink]="backTool"
      [class.preview]="mode === 'preview'"
      ghost
      title="Preview"
      (click)="preparePreviewData()"
    >
      <bc-icon name="eye"></bc-icon>
    </a>
  `
})
export class PreviewLinkComponent {
  @Input() mode: WorkingAreaMode;

  previousMode: WorkingAreaMode;

  get backTool(): string {
    if (this.mode === WorkingAreaMode.PREVIEW) {
      return this.previousMode || WorkingAreaMode.BUILDER;
    } else {
      return WorkingAreaMode.PREVIEW;
    }
  }

  constructor(
    private projectFacade: ProjectFacade,
    private store: Store<fromWorkingArea.State>,
    private analytics: AnalyticsService
  ) {
  }

  preparePreviewData(): void {
    if (this.mode === WorkingAreaMode.PREVIEW) {
      return;
    }

    this.store.dispatch(new WorkingAreaActions.SyncAll());
    this.logAnalytics();
  }

  private logAnalytics(): void {
    this.previousMode = this.mode;
    this.projectFacade.activeProjectName$
      .pipe(take(1))
      .subscribe((name: string) => this.analytics.logPreviewProject(name));
  }
}
