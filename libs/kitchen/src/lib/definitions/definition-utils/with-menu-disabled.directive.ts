import { Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Directive({ selector: '[kitchenWithMenuDisabled]' })
export class WithMenuDisabledDirective implements OnDestroy {
  @Input() set kitchenWithMenuDisabled(disabled$: Observable<boolean>) {
    this.listenDisabled(disabled$);
  }

  private disabledSubscription: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  private listenDisabled(disabled$: Observable<boolean>) {
    if (this.disabledSubscription) {
      this.disabledSubscription.unsubscribe();
    }
    this.disabledSubscription = disabled$.subscribe((disabled: boolean) => {
      if (disabled) {
        this.renderer.addClass(this.el.nativeElement, 'link-disabled');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'link-disabled');
      }
    });
  }

  ngOnDestroy() {
    if (this.disabledSubscription) {
      this.disabledSubscription.unsubscribe();
    }
  }
}
