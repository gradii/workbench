import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import {
  AVAILABLE_BREAKPOINTS,
  Breakpoint
} from '@core/breakpoint/breakpoint';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector       : 'len-breakpoint-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./breakpoint-switch.component.scss'],
  template       : `
    <label *ngFor="let item of breakpoints" [class.checked]="breakpoint === item">
      <input [formControl]="selectedBreakpoint"
             [value]="item"
             [checked]="breakpoint === item"
             type="radio"/>
      <tri-icon [svgIcon]="item.icon"></tri-icon>
    </label>
  `
})
export class BreakpointSwitchComponent implements OnInit, OnDestroy {
  @Output() breakpointChange = new EventEmitter();
  @Input() breakpoint: Breakpoint;

  breakpoints: Breakpoint[] = AVAILABLE_BREAKPOINTS;
  selectedBreakpoint        = new UntypedFormControl(this.breakpoints[0]);

  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.selectedBreakpoint.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(this.breakpointChange);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
