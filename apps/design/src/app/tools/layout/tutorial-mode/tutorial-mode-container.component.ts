import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectFacade } from '@tools-state/project/project-facade.service';

@Component({
  selector: 'ub-tutorial-mode-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ub-tutorial-mode *ngIf="isTutorialInProgress$ | async"></ub-tutorial-mode> `
})
export class TutorialModeContainerComponent {
  isTutorialInProgress$: Observable<boolean> = this.projectFacade.isTutorialInProgress$;

  constructor(private projectFacade: ProjectFacade) {
  }
}
