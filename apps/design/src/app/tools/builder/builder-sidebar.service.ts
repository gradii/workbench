import { Injectable } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BuilderSidebarService {
  private opened: BehaviorSubject<boolean> = new BehaviorSubject(false);

  readonly opened$: Observable<boolean> = this.opened.asObservable();

  constructor(private sidebarService: NbSidebarService) {
  }

  close() {
    this.opened.next(false);
    this.sidebarService.collapse('page-sidebar');
  }

  toggle() {
    this.opened.next(!this.opened.getValue());
    this.sidebarService.toggle(false, 'page-sidebar');
  }
}
