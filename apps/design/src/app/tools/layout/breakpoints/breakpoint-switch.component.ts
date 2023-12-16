import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AVAILABLE_BREAKPOINTS, Breakpoint } from '@core/breakpoint/breakpoint';

@Component({
  selector: 'ub-breakpoint-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breakpoint-switch.component.scss'],
  template: `
    <label *ngFor="let item of breakpoints">
      <input [formControl]="selectedBreakpoint" [value]="item" [checked]="breakpoint === item" type="radio" />
      <bc-icon [name]="item.icon"></bc-icon>
    </label>
  `
})
export class BreakpointSwitchComponent implements OnInit, OnDestroy {
  @Output() breakpointChange = new EventEmitter();
  @Input() breakpoint: Breakpoint;

  breakpoints: Breakpoint[] = AVAILABLE_BREAKPOINTS;
  selectedBreakpoint = new FormControl(this.breakpoints[0]);

  private destroyed$ = new Subject();

  ngOnInit(): void {
    this.selectedBreakpoint.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(this.breakpointChange);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
