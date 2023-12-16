import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { DivideSpaceType, RootComponentType } from '@common';
import { fromEvent, Subject } from 'rxjs';
import { filter, skip, takeUntil } from 'rxjs/operators';

import { OverlayService, OverlayZIndex } from '../../overlay-adapter';
import { OverlayPositionBuilderService } from '../../overlay-position';
import { DivideSpaceLayoutListComponent } from './divide-space-layout-list.component';

@Directive({
  selector: '[ovenDivideSpaceDialog]'
})
export class DivideSpaceDialogDirective implements OnDestroy {
  @Input('ovenDivideSpaceDialog') hostRef: ElementRef;

  @Output() layoutClick: EventEmitter<DivideSpaceType> = new EventEmitter<DivideSpaceType>();

  private ref: OverlayRef;
  private componentRef: ComponentRef<DivideSpaceLayoutListComponent>;
  private destroyed: Subject<void> = new Subject<void>();

  constructor(private overlay: OverlayService, private overlayPositionBuilder: OverlayPositionBuilderService) {
  }

  ngOnDestroy() {
    this.hide();
  }

  toggle() {
    if (this.ref && this.ref.hasAttached()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.ref = this.createOverlay();
    this.componentRef = this.ref.attach(new ComponentPortal(DivideSpaceLayoutListComponent));

    this.componentRef.instance.layoutClick
      .pipe(takeUntil(this.destroyed))
      .subscribe((type: DivideSpaceType) => this.layoutClick.emit(type));

    fromEvent(document, 'click')
      .pipe(
        skip(1),
        takeUntil(this.destroyed),
        filter((e: Event) => !this.componentRef.location.nativeElement.contains(e.target as Node))
      )
      .subscribe(() => {
        this.hide();
      });
  }

  hide() {
    this.destroyed.next();
    if (this.ref && this.ref.hasAttached()) {
      this.ref.dispose();
    }
  }

  private createOverlay() {
    const positionStrategy = this.createPositionStrategy();
    return this.overlay.create({
      positionStrategy,
      overlayClass: OverlayZIndex.z1003,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      rootType: RootComponentType.Header
    });
  }

  private createPositionStrategy(): PositionStrategy {
    return this.overlayPositionBuilder.flexibleConnectedTo(this.hostRef).withPositions([
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -4,
        panelClass: 'top'
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 4,
        panelClass: 'bottom'
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -4,
        panelClass: 'top'
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 4,
        panelClass: 'bottom'
      }
    ]);
  }
}
