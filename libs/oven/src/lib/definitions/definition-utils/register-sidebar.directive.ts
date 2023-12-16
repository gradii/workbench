import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarComponent, NbSidebarService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RenderState } from '../../state/render-state.service';

@Directive({ selector: '[ovenRegisterSidebar]' })
export class RegisterSidebarDirective implements OnInit, OnDestroy {
  @Input() set ovenSidebarResponsive(responsive: boolean) {
    if (this.host.responsive !== responsive) {
      this.host.responsive = responsive;
      this.host.toggleResponsive(responsive);
    }
    if (!responsive) {
      this.host.expand();
    }
  }

  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    private sidebarService: NbSidebarService,
    private host: NbSidebarComponent,
    private cd: ChangeDetectorRef,
    private renderState: RenderState
  ) {
  }

  ngOnInit() {
    this.sidebarService
      .onToggle()
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}
