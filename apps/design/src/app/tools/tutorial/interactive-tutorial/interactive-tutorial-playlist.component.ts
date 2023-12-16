import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { TutorialBrief } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { TutorialBriefFacade } from '@tools-state/tutorial-brief/tutorial-brief.facade';

@Component({
  selector: 'ub-interactive-tutorial-playlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./interactive-tutorial-playlist.component.scss'],
  templateUrl: './interactive-tutorial-playlist.component.html'
})
export class InteractiveTutorialPlaylistComponent {
  readonly selectedTutorialId$: Observable<string> = this.tutorialFacade.selectedTutorialId$;
  readonly tutorials$: Observable<TutorialBrief[]> = this.tutorialFacade.tutorials$;

  constructor(private tutorialFacade: TutorialBriefFacade) {
  }

  selectTutorial(tutorialId: string): void {
    this.tutorialFacade.selectTutorial(tutorialId);
  }
}
