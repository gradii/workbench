import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { InteractiveTutorialDialogComponent } from '../interactive-tutorial/interactive-tutorial-dialog.component';
import { StepSizeProviderService } from '@shared/tutorial/step-size-provider.service';
import { TutorialFacade } from '@tools-state/tutorial/tutorial.facade';
import { environment } from '../../../../environments/environment';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-start-your-journey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StepSizeProviderService],
  styleUrls: ['./start-your-journey.component.scss'],
  template: `
    <ub-step [url]="url" [style.width.px]="width$ | async" [style.height.px]="height$ | async"> </ub-step>

    <div class="footer">
      <button class="skip" nbButton size="small" appearance="ghost" (click)="skip()">
        Skip
      </button>

      <button nbButton size="small" status="info" (click)="startTutorial()">
        start your journey
      </button>
    </div>
  `
})
export class StartYourJourneyComponent {
  @Input() tutorialProgressId: string;

  readonly width$: Observable<number> = this.stepSizeProvider.width$;
  readonly height$: Observable<number> = this.stepSizeProvider.height$;

  readonly url = this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.tutorialsPrefix}welcome`);

  constructor(
    private dialogRef: DialogRef<InteractiveTutorialDialogComponent>,
    private domSanitizer: DomSanitizer,
    private stepSizeProvider: StepSizeProviderService,
    private router: Router,
    private tutorialFacade: TutorialFacade
  ) {
  }

  skip(): void {
    this.goToProjects();
  }

  startTutorial(): void {
    this.tutorialFacade.start(this.tutorialProgressId);
    this.dialogRef.close();
  }

  private goToProjects(): void {
    this.router.navigate(['/projects'], { queryParams: { 'create-new-project': true } });
  }
}
