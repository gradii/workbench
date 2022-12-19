/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {Direction, Directionality} from '@angular/cdk/bidi';
import {EventEmitter, Injectable, OnDestroy} from '@angular/core';

@Injectable()
export class PuffAppDirectionality implements Directionality, OnDestroy {
  readonly change = new EventEmitter<Direction>();

  get value(): Direction {
    return this._value;
  }
  set value(value: Direction) {
    this._value = value;
    this.change.next(value);
  }
  private _value: Direction = 'ltr';

  ngOnDestroy() {
    this.change.complete();
  }
}
