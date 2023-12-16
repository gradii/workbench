import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComponentSettingsTabsService {
  private readonly currentSelectedTabIndex = new BehaviorSubject<number>(0);
  readonly currentSelectedTabIndex$ = this.currentSelectedTabIndex.asObservable();

  setNextSelectedTab(nextTabIndex: number): void {
    this.currentSelectedTabIndex.next(nextTabIndex);
  }
}
