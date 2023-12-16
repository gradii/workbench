import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[ovenWithRadius]' })
export class WithRadiusDirective {
  private radius: { value: number; unit: 'px' | 'rem' } = null;

  @Input() set ovenWithRadius(radius: { value: number; unit: 'px' | 'rem' }) {
    if (radius) {
      this.radius = radius;
    }
  }

  @HostBinding('style.borderRadius') get radiusValue(): string {
    if (!this.radius) {
      return null;
    }
    return `${this.radius.value}${this.radius.unit}`;
  }
}
