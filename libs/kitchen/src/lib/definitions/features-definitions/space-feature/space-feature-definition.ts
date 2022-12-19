import { BreakpointWidth, KitchenFeature, KitchenType, nextComponentId } from '@common';

export function spaceFeatureFactory(
  align?: string,
): KitchenFeature {
  return {
    id: nextComponentId(),
    type: KitchenType.Feature,
    definitionId: 'space-feature',
    styles: {
      [BreakpointWidth.Desktop]: {
        visible: true,
        direction: 'row',
        justify: 'flex-start',
        align: align || 'flex-start',
      }
    },
    properties: {
      container: false,
      name: 'Space'
    }
  };
}