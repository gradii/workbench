import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { DialogRef } from '@shared/dialog/dialog-ref';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';

@Component({
  selector: 'ub-save-continue-dialog',
  styleUrls: ['./quite-barrier-dialog.component.scss'],
  templateUrl: './quite-barrier-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuiteBarrierDialogComponent {
  constructor(
    private router: Router,
    private tutorialFacade: TutorialFacade,
    private dialogRef: DialogRef<QuiteBarrierDialogComponent>
  ) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  gotoProjects(): void {
    this.tutorialFacade.finish();
    this.router.navigate(['/projects']);
    this.dialogRef.close();
  }
}
