import { Directionality } from '@angular/cdk/bidi';
import {
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { DomPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT, Location } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { RootComponentType } from '@common/public-api';

import { OverlayConfig } from './overlay-adapter';
import { KitchenOverlayContainer } from './overlay-container';

let nextUniqueId = 0;

@Injectable()
export class KitchenOverlay {
  private _appRef: ApplicationRef;

  constructor(
    public scrollStrategies: ScrollStrategyOptions,
    private _overlayContainer: KitchenOverlayContainer,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _positionBuilder: OverlayPositionBuilder,
    private _keyboardDispatcher: OverlayKeyboardDispatcher,
    private _injector: Injector,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any,
    private _directionality: Directionality,
    private _overlayOutsideClickDispatcher: OverlayOutsideClickDispatcher,
    private _location?: Location
  ) {
  }

  create(config?: OverlayConfig): OverlayRef {
    const host = this._createHostElement(config.rootType);
    const pane = this._createPaneElement(host);
    const portalOutlet = this._createPortalOutlet(pane);
    const overlayConfig = { ...config };

    overlayConfig.direction = overlayConfig.direction || this._directionality.value;

    return new OverlayRef(
      portalOutlet,
      host,
      pane,
      overlayConfig,
      this._ngZone,
      this._keyboardDispatcher,
      this._document,
      this._location,
      this._overlayOutsideClickDispatcher
    );
  }

  position(): OverlayPositionBuilder {
    return this._positionBuilder;
  }

  private _createPaneElement(host: HTMLElement): HTMLElement {
    const pane = this._document.createElement('div');
    pane.id = `cdk-overlay-${nextUniqueId++}`;
    pane.classList.add('cdk-overlay-pane');
    host.appendChild(pane);
    return pane;
  }

  private _createHostElement(type: RootComponentType): HTMLElement {
    const host = this._document.createElement('div');
    this._overlayContainer.getContainerElement(type).appendChild(host);
    return host;
  }

  private _createPortalOutlet(pane: HTMLElement): DomPortalOutlet {
    if (!this._appRef) {
      this._appRef = this._injector.get<ApplicationRef>(ApplicationRef);
    }
    return new DomPortalOutlet(pane, this._componentFactoryResolver, this._appRef, this._injector);
  }
}
