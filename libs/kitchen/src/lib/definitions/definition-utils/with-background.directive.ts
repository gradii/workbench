import { Directive, HostBinding, Input } from '@angular/core';
import { KitchenBackground, KitchenImageSrc } from '@common/public-api';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

export const backgroundStyleMap = {
  transparent: 'unset',
  primary: 'var(--color-primary-default)',
  success: 'var(--color-success-default)',
  warning: 'var(--color-warning-default)',
  danger: 'var(--color-danger-default)',
  info: 'var(--color-info-default)',
  alternate: 'var(--background-alternative-color-1)',
  disabled: 'var(--bg-disabled-color)',
  hint: 'var(--bg-hint-color)',
  default: 'var(--background-basic-color-1)'
};

@Directive({
  selector: '[kitchenWithBackground]'
})
export class WithBackgroundDirective {
  private background: KitchenBackground;

  @Input() set kitchenWithBackground(background: KitchenBackground) {
    this.background = background;
  }

  @HostBinding('style.background-image')
  get image() {
    if (!this.background) {
      return '';
    }

    const imageSrc: KitchenImageSrc = this.background.imageSrc;
    if (imageSrc && (imageSrc.uploadUrl || imageSrc.url)) {
      return this.getImageSource(imageSrc);
    }

    return '';
  }

  @HostBinding('style.background-size')
  get size() {
    return this.background && this.background.imageSize;
  }

  @HostBinding('style.background-color')
  get backgroundColor(): SafeStyle {
    if (!this.background) {
      return;
    }
    return this.sanitizer.bypassSecurityTrustStyle(backgroundStyleMap[this.background.color]);
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  getImageSource(imageSrc: KitchenImageSrc) {
    if (imageSrc.active === 'upload') {
      return `url(${this.getUrlOnUploadTab(imageSrc)})`;
    } else if (imageSrc.active === 'url') {
      return `url(${this.getUrlOnUrlTab(imageSrc)})`;
    }
  }

  private getUrlOnUploadTab(imageSrc: KitchenImageSrc): string {
    if (imageSrc.uploadUrl) {
      return imageSrc.uploadUrl;
    } else {
      return imageSrc.url;
    }
  }

  private getUrlOnUrlTab(imageSrc: KitchenImageSrc): string {
    if (imageSrc.url) {
      return imageSrc.url;
    } else {
      return imageSrc.uploadUrl;
    }
  }
}
