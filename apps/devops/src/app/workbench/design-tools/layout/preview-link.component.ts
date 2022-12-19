import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnalyticsService } from '@common';
import { dispatch } from '@ngneat/effects';

import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
import { take } from 'rxjs/operators';

@Component({
  selector       : 'len-preview-link',
  styleUrls      : ['./preview-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <a
      nbButton
      class="bakery-button preview-link"
      [routerLink]="backTool"
      [class.preview]="mode === 'preview'"
      ghost
      title="Preview"
      (click)="preparePreviewData()"
    >
      <tri-icon svgIcon="outline:eye"></tri-icon>
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
    private analytics: AnalyticsService
  ) {
  }

  preparePreviewData(): void {
    if (this.mode === WorkingAreaMode.PREVIEW) {
      return;
    }

    dispatch(WorkingAreaActions.SyncAll());
    this.logAnalytics();
  }

  private logAnalytics(): void {
    this.previousMode = this.mode;
    this.projectFacade.activeProjectName$
      .pipe(take(1))
      .subscribe((name: string) => this.analytics.logPreviewProject(name));
  }
}
