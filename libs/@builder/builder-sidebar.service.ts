import { Injectable } from '@angular/core';
import { SidenavService } from '@gradii/triangle/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BuilderSidebarService {
  private opened: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly opened$: Observable<boolean> = this.opened.asObservable();

  constructor(private sidebarService: SidenavService) {
  }

  close() {
    this.opened.next(false);
    this.sidebarService.close('page-sidebar');
  }

  toggle() {
    this.opened.next(!this.opened.getValue());
    this.sidebarService.toggle('page-sidebar');
  }
}
