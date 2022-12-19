import { ɵmarkDirty, Directive, Input, OnDestroy, OnInit } from '@angular/core';
// import { NbSidebarComponent, NbSidebarService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({ selector: '[kitchenRegisterSidebar]' })
export class RegisterSidebarDirective implements OnInit, OnDestroy {
  @Input() set kitchenSidebarResponsive(responsive: boolean) {
    // if (this.host.responsive !== responsive) {
    //   this.host.responsive = responsive;
    //   this.host.toggleResponsive(responsive);
    // }
    // if (!responsive) {
    //   this.host.expand();
    // }
  }

  private destroyed: Subject<void> = new Subject<void>();

  constructor(
    // private sidebarService: NbSidebarService,
    // private host: NbSidebarComponent,
  ) {
  }

  ngOnInit() {
    // this.sidebarService
    //   .onToggle()
    //   .pipe(takeUntil(this.destroyed))
    //   .subscribe(() => ɵmarkDirty(this));
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}
