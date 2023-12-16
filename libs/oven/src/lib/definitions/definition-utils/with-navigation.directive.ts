import { Directive, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Directive({ selector: '[ovenWithNavigation]' })
export class WithNavigationDirective implements OnDestroy {
  @Input() set ovenWithNavigation(url: { path: string; external: boolean }) {
    if (url) {
      this.url = url;
    }
  }

  @Input() set navigationDisabled(disabled$: Observable<boolean>) {
    if (this.enabledSubscription) {
      this.enabledSubscription.unsubscribe();
    }
    disabled$.subscribe((disabled: boolean) => (this.enabled = !disabled));
  }

  @HostBinding('attr.href') get href() {
    return this.url.external ? this.url.path : '#';
  }

  @HostBinding('attr.target') get target() {
    return this.url.external ? '_blank' : null;
  }

  private url: { path: string; external: boolean } = { path: '', external: true };
  private enabledSubscription: Subscription;
  private enabled = false;

  constructor(private router: Router) {
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    if (!this.enabled) {
      $event.preventDefault();
      return;
    }
    if (!this.url.external) {
      this.router.navigateByUrl(this.url.path);
      $event.preventDefault();
    } else if (!this.url.path) {
      $event.preventDefault();
    }
  }

  ngOnDestroy() {
    if (this.enabledSubscription) {
      this.enabledSubscription.unsubscribe();
    }
  }
}
