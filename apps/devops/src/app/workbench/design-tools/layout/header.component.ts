import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { ProjectFacade } from '@tools-state/project/project-facade.service';
import { WorkingAreaMode } from '@tools-state/working-area/working-area.model';
// import { QuiteBarrierService } from '../tutorial/quite-barrier-dialog/quite-barrier.service';

@Component({
  selector: 'len-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() mode: WorkingAreaMode;
  @Input() canDownloadDataCode: boolean;
  @Input() canUseHosting: boolean;

  constructor(
    private projectFacade: ProjectFacade,
    // private quiteBarrierService: QuiteBarrierService,
    private router: Router
  ) {
  }

  get showProjectSettings(): boolean {
    return this.mode === WorkingAreaMode.BUILDER;
  }

  get showStateManagerButton(): boolean {
    return this.mode === WorkingAreaMode.DATA;
  }

  get showDataUnavailabilityNotice(): boolean {
    return this.showStateManagerButton && !this.canDownloadDataCode;
  }

  get showBreakpoints(): boolean {
    return this.mode !== WorkingAreaMode.DATA;
  }

  gotoProjects(): void {
    this.projectFacade.isTutorialInProgress$.pipe(take(1)).subscribe((progress: boolean) => {
      if (progress) {
        // this.quiteBarrierService.open();
      } else {
        this.router.navigate(['/projects']);
      }
    });
  }
}
