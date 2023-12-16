import { Injectable } from '@angular/core';
import { RootComponentType } from '@common';
import { NbLayoutDirectionService, NbOverlayConfig, NbOverlayRef, NbScrollStrategyOptions } from '@nebular/theme';

import { OvenOverlay } from './overlay';

export enum OverlayZIndex {
  z1001 = 'oven-z-index-1001',
  z1002 = 'oven-z-index-1002',
  z1003 = 'oven-z-index-1003',
  z1004 = 'oven-z-index-1004',
  z1005 = 'oven-z-index-1005',
}

export interface OverlayConfig extends NbOverlayConfig {
  overlayClass?: OverlayZIndex;
  rootType?: RootComponentType;
}

@Injectable()
export class OverlayService {
  constructor(private ovenOverlay: OvenOverlay, protected layoutDirection: NbLayoutDirectionService) {
  }

  get scrollStrategies(): NbScrollStrategyOptions {
    return this.ovenOverlay.scrollStrategies;
  }

  create(config?: OverlayConfig): NbOverlayRef {
    config.panelClass = 'nb-theme-oven-dark';
    const overlayRef = this.ovenOverlay.create(config);
    if (config && config.overlayClass) {
      const tokens = Array.isArray(config.overlayClass) ? config.overlayClass : [config.overlayClass];
      overlayRef.hostElement.classList.add(...tokens);
    }
    this.layoutDirection.onDirectionChange().subscribe(dir => overlayRef.setDirection(dir));
    return overlayRef;
  }
}
