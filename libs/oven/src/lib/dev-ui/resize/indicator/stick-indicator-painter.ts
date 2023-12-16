import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';

import { noopRect, Rect } from '../model';
import { OverlayService, OverlayZIndex } from '../../overlay-adapter';
import { OverlayPositionBuilderService } from '../../overlay-position';
import { StickIndicatorComponent } from './stick-indicator.component';
import { RootComponentType } from '@common';

@Injectable({ providedIn: 'root' })
export class StickIndicatorPainter {
  private ref: OverlayRef;
  private destroySizeIndicator$ = new Subject();
  private rect = new BehaviorSubject<Rect>(noopRect());
  public readonly rect$: Observable<Rect> = this.rect.asObservable();
  private elementRef: ElementRef;
  private rootType: RootComponentType;

  constructor(private overlay: OverlayService, private overlayPositionBuilder: OverlayPositionBuilderService) {
  }

  init(el: ElementRef, rootType: RootComponentType) {
    this.elementRef = el;
    this.rootType = rootType;
  }

  show() {
    if (this.ref) {
      this.hide();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'center' }])
      .withViewportMargin(16)
      .withLockedPosition(false);

    this.ref = this.overlay.create({
      positionStrategy,
      overlayClass: OverlayZIndex.z1003,
      rootType: this.rootType
    });
    const componentRef: ComponentRef<StickIndicatorComponent> = this.ref.attach(
      new ComponentPortal(StickIndicatorComponent)
    );
    componentRef.instance.hostElement = this.elementRef.nativeElement;
    this.ref.updatePosition();

    this.rect$
      .pipe(takeUntil(this.destroySizeIndicator$))
      .subscribe((rect: Rect) => (componentRef.instance.rect = rect));
  }

  update(rect: Rect) {
    this.rect.next(rect);

    setTimeout(() => {
      if (this.ref) {
        this.ref.updatePosition();
      }
    });
  }

  hide() {
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
      this.destroySizeIndicator$.next();
    }
  }
}
