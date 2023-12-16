import { ElementRef, Injectable } from '@angular/core';
import {
  NbAdjustableConnectedPositionStrategy,
  NbGlobalPositionStrategy,
  NbPosition,
  NbPositionBuilderService
} from '@nebular/theme';

export enum Position {
  BOTTOM_RIGHT = 'bottom-right',
  TOP_RIGHT = 'top-right',
}

const additionalPositions = {
  [Position.BOTTOM_RIGHT](offset) {
    return { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: offset };
  },
  [Position.TOP_RIGHT](offset) {
    return { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: offset };
  }
};

class AdjustableConnectedPositionStrategy extends NbAdjustableConnectedPositionStrategy {
  protected createPositions(): NbPosition[] {
    if (additionalPositions[this._position]) {
      return this.getPositions(this._position);
    } else {
      return super.createPositions();
    }
  }

  protected persistChosenPositions(positions: NbPosition[]) {
    if (additionalPositions[this._position]) {
      this.appliedPositions = this.getPositionsValue(positions);
    } else {
      super.persistChosenPositions(positions);
    }
  }

  private getPositions(currentPosition: string): any {
    if (currentPosition === Position.BOTTOM_RIGHT) {
      return [Position.BOTTOM_RIGHT, Position.TOP_RIGHT];
    }
    if (currentPosition === Position.TOP_RIGHT) {
      return [Position.TOP_RIGHT, Position.BOTTOM_RIGHT];
    }
    return [];
  }

  private getPositionsValue(positions: NbPosition[]): any {
    return positions.map(position => ({
      key: position,
      connectedPosition: additionalPositions[position](this.getValidOffset(position))
    }));
  }

  private getValidOffset(position: string): number {
    return position === Position.BOTTOM_RIGHT ? this._offset : -this._offset;
  }
}

@Injectable()
export class PositionBuilderService extends NbPositionBuilderService {
  global(): NbGlobalPositionStrategy {
    return new NbGlobalPositionStrategy();
  }

  connectedTo(elementRef: ElementRef): NbAdjustableConnectedPositionStrategy {
    return new AdjustableConnectedPositionStrategy(
      elementRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer
    )
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}
