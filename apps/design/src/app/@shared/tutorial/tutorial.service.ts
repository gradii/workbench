import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';

import { TutorialDataService, TutorialProgress } from '@shared/tutorial/tutorial-data.service';
import { LoaderService } from '@core/loader.service';

const UI_BAKERY_BASICS_TUTORIAL_ID = 'bakerybasics';

@Injectable()
export class TutorialService implements OnDestroy {
  private destroy$ = new Subject();

  constructor(
    private tutorialDataService: TutorialDataService,
    private loader: LoaderService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  startTutorial(): void {
    this.initialize()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projectId: string) => {
        // tutorial: true query param is used to create a unique url for tutorials.
        const extras: NavigationExtras = { queryParams: { tutorial: true }, queryParamsHandling: 'merge' };
        this.router.navigate(['/tools', projectId, 'builder'], extras);
      });
  }

  startStartYourJourneyTutorial(): void {
    this.initialize()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projectId: string) => {
        // tutorial: true query param is used to create a unique url for tutorials.
        const queryParams = { 'start-your-journey': true, tutorial: true };
        const extras: NavigationExtras = { queryParams, queryParamsHandling: 'merge' };
        this.router.navigate(['/tools', projectId, 'builder'], extras);
      });
  }

  private initialize(): Observable<string> {
    this.loader.show();
    return this.tutorialDataService
      .initialize(UI_BAKERY_BASICS_TUTORIAL_ID)
      .pipe(map((tutorialProgress: TutorialProgress) => tutorialProgress.projectId));
  }
}
