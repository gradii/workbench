import { AfterViewInit, Directive, ElementRef, Inject, NgZone, OnDestroy } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { NB_DOCUMENT } from '@nebular/theme';

@Directive({ selector: '[ovenScrollableColumns]' })
export class ScrollableColumnsDirective implements AfterViewInit, OnDestroy {
  private cdkScrollable: CdkScrollable;
  private document: Document;

  constructor(@Inject(NB_DOCUMENT) document, private scrollDispatcher: ScrollDispatcher, private ngZone: NgZone) {
    this.document = document;
  }

  ngAfterViewInit(): void {
    const nativeElement: HTMLElement = this.getColumnsElement();
    nativeElement.style.overflowX = 'auto';
    this.createScrollable(nativeElement);
  }

  ngOnDestroy(): void {
    if (this.cdkScrollable) {
      this.cdkScrollable.ngOnDestroy();
    }
  }

  private getColumnsElement(): HTMLElement {
    return document.querySelector('.content > .columns');
  }

  private createScrollable(nativeElement: HTMLElement): void {
    const scrollableEl: ElementRef = { nativeElement };
    this.cdkScrollable = new CdkScrollable(scrollableEl, this.scrollDispatcher, this.ngZone);
    this.cdkScrollable.ngOnInit();
  }
}
