import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TutorialBriefFacade } from '@tools-state/tutorial-brief/tutorial-brief.facade';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'tutorial-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./interactive-tutorial-dialog.component.scss'],
  template: `
    <ub-tutorial-dialog [nbSpinner]="loading$ | async" icon="brush" title="Interactive Tutorials" (close)="close()">
      <ub-interactive-tutorial-description ubTutorialDialogContent></ub-interactive-tutorial-description>

      <ub-interactive-tutorial-playlist ubTutorialDialogPlaylist></ub-interactive-tutorial-playlist>
    </ub-tutorial-dialog>
  `
})
export class InteractiveTutorialDialogComponent implements OnInit {
  readonly loading$: Observable<boolean> = this.tutorialFacade.loading$;

  constructor(
    private dialogRef: DialogRef<InteractiveTutorialDialogComponent>,
    private tutorialFacade: TutorialBriefFacade
  ) {
  }

  ngOnInit(): void {
    this.tutorialFacade.loadTutorials();
  }

  close(): void {
    this.dialogRef.close();
  }
}
