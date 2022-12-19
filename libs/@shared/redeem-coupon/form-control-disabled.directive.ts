import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, pairwise, takeUntil, tap } from 'rxjs/operators';

@Directive({ selector: '[ubFormControlDisabled]' })
export class FormControlDisabledDirective implements OnInit, OnDestroy {
  private disabled$ = new Subject<boolean>();
  private destroyed$ = new Subject<boolean>();

  constructor(private control: NgControl, private el: ElementRef) {
  }

  @Input() set ubFormControlDisabled(disabled: boolean) {
    this.disabled$.next(disabled);
  }

  ngOnInit(): void {
    this.disabled$
      .pipe(
        takeUntil(this.destroyed$),
        tap((disabled: boolean) => {
          if (disabled) {
            this.control.control.disable();
          } else {
            this.control.control.enable();
          }
        }),
        pairwise(),
        filter(([prev, curr]) => prev && !curr)
      )
      .subscribe(() => this.el.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
