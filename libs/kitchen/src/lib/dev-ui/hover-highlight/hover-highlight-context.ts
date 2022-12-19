import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable(/*{ providedIn: 'root' }*/)
export class HoverHighlightContext {
  private disabled = new BehaviorSubject<boolean>(false);
  readonly disabled$: Observable<boolean> = this.disabled;

  setDisabled(disabled: boolean): void {
    this.disabled.next(disabled);
  }
}
