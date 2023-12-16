import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

import { StepSizeProviderService } from '@shared/tutorial/step-size-provider.service';
import { StepFacade } from '@tools-state/tutorial-step/step.facade';

@Component({
  selector: 'ub-step-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StepSizeProviderService],
  template: `
    <ub-step [url]="url$ | async" [style.width.px]="width$ | async" [style.height.px]="height$ | async"> </ub-step>
  `
})
export class StepContainerComponent {
  readonly width$: Observable<number> = this.stepSizeProvider.width$;
  readonly height$: Observable<number> = this.stepSizeProvider.height$;

  readonly url$: Observable<SafeUrl> = this.stepFacade.stepUrl$;

  constructor(private stepFacade: StepFacade, private stepSizeProvider: StepSizeProviderService) {
  }
}
