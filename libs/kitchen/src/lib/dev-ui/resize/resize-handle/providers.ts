import { RectCalculator } from '../resize-strategy/rect-calculator';
import { HostSizeCalculator } from '../resize-strategy/host-size-calculator';
import { CollisionHighlightCalculator } from '../resize-strategy/collision-highlight-calculator';
import { ResizeCalculationHelperFactory } from '../resize-strategy/resize-calculation-helper';
import { ResizeContextResolver } from '../resize-strategy/resize-context-resolver';
import { Resizer } from '../resize-strategy/resizer';
import { SizeMapper } from '../size-mapper';
import { ResizeStrategy } from '../resize-strategy/resize-strategy';
import { CollisionDetector } from '../resize-strategy/collision-detector';
import { ResizeMediator } from '../resize-mediator';
import { MultiplierResolver } from '../resize-strategy/multiplier-resolver';
import { MousedownProvider } from '../resize-strategy/mousedown-provider';

export const providers = [
  MultiplierResolver,
  RectCalculator,
  HostSizeCalculator,
  CollisionHighlightCalculator,
  ResizeCalculationHelperFactory,
  ResizeContextResolver,
  Resizer,
  SizeMapper,
  ResizeStrategy,
  CollisionDetector,
  ResizeMediator,
  MousedownProvider
];
