import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { InteractiveTutorialDialogComponent } from '../../../tools/tutorial/interactive-tutorial/interactive-tutorial-dialog.component';
import { StepSizeProviderService } from '@shared/tutorial/step-size-provider.service';
import { TutorialService } from '@shared/tutorial/tutorial.service';
import { environment } from '../../../../environments/environment';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-tutorials-released-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StepSizeProviderService],
  styleUrls: ['./tutorials-released-notification.component.scss'],
  template: `
    <ub-step [url]="url" [style.width.px]="width$ | async" [style.height.px]="height$ | async"> </ub-step>

    <div class="footer">
      <button class="skip" nbButton size="small" appearance="ghost" (click)="skip()">
        Skip
      </button>

      <button nbButton size="small" status="primary" (click)="startTutorial()">
        start your journey
      </button>
    </div>
  `
})
export class TutorialsReleasedNotificationComponent {
  readonly width$: Observable<number> = this.stepSizeProvider.width$;
  readonly height$: Observable<number> = this.stepSizeProvider.height$;

  readonly url = this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.tutorialsPrefix}welcome-old-users`);

  constructor(
    private dialogRef: DialogRef<InteractiveTutorialDialogComponent>,
    private domSanitizer: DomSanitizer,
    private stepSizeProvider: StepSizeProviderService,
    private tutorialService: TutorialService
  ) {
  }

  skip(): void {
    this.dialogRef.close();
  }

  startTutorial(): void {
    this.tutorialService.startTutorial();
  }
}
