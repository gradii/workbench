import { OverlayConfig as CdkOverlayConfig } from '@angular/cdk/overlay';
import { RootComponentType } from '@common/public-api';

export enum OverlayZIndex {
  z1001 = 'kitchen-z-index-1001',
  z1002 = 'kitchen-z-index-1002',
  z1003 = 'kitchen-z-index-1003',
  z1004 = 'kitchen-z-index-1004',
  z1005 = 'kitchen-z-index-1005',
}

export interface OverlayConfig extends CdkOverlayConfig {
  overlayClass?: OverlayZIndex;
  rootType?: RootComponentType;
}

//
// @Injectable()
// export class OverlayService {
//   constructor(private kitchenOverlay: KitchenOverlay,
//               protected layoutDirection: NbLayoutDirectionService) {
//   }
//
//   get scrollStrategies(): ScrollStrategyOptions {
//     return this.kitchenOverlay.scrollStrategies;
//   }
//
//   create(config?: OverlayConfig): OverlayRef {
//     config.panelClass = 'nb-theme-kitchen-dark';
//     const overlayRef  = this.kitchenOverlay.create(config);
//     if (config && config.overlayClass) {
//       const tokens = Array.isArray(config.overlayClass) ? config.overlayClass : [config.overlayClass];
//       overlayRef.hostElement.classList.add(...tokens);
//     }
//     this.layoutDirection.onDirectionChange().subscribe(dir => overlayRef.setDirection(dir));
//     return overlayRef;
//   }
// }
