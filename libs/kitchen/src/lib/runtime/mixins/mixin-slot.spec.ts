/**
 *
 */

import { KitchenType } from '@common/models/kitchen.models';
import { CodeGenVisitorTest } from './mixin-base.spec';
import { mixinSlot } from './mixin-slot';

describe('mixin-slot', () => {

  it('test slot', () => {
    const SlotVisitor = mixinSlot(CodeGenVisitorTest);

    const slotVisitor = new SlotVisitor();

    slotVisitor.visitSlot(
      {
        componentList: [],
        featureList  : [],
        id           : 'slot-1'
      }
    );

    const result = slotVisitor.getOutput();
    expect(result).toBe(`  <div cdkScrollable triDropFlexContainer uid="slot-1" triDropFlexContainerOrientation="vertical" class="space direction-column" _kitchenRuntime _kitchenRuntimeComponentId="slot-1" _kitchenRuntimeDefinitionId="slot"
  >
  </div>`);
  });

  it('test slot should be horizontal', () => {
    const SlotVisitor = mixinSlot(CodeGenVisitorTest);

    const slotVisitor = new SlotVisitor();

    slotVisitor.visitSlot(
      {
        componentList: [],
        featureList  : [],
        id           : 'slot-1',
        direction    : 'horizontal'
      }
    );

    const result = slotVisitor.getOutput();

    expect(result).toBe(`  <div cdkScrollable triDropFlexContainer uid="slot-1" triDropFlexContainerOrientation="horizontal" class="space direction-row" _kitchenRuntime _kitchenRuntimeComponentId="slot-1" _kitchenRuntimeDefinitionId="slot"
  >
  </div>`);
  });

  it('test slot should be vertical', () => {
    const SlotVisitor = mixinSlot(CodeGenVisitorTest);

    const slotVisitor = new SlotVisitor();

    slotVisitor.visitSlot(
      {
        componentList: [],
        featureList  : [],
        id           : 'slot-1',
        direction    : 'vertical'
      }
    );

    const result = slotVisitor.getOutput();

    expect(result).toBe(`  <div cdkScrollable triDropFlexContainer uid="slot-1" triDropFlexContainerOrientation="vertical" class="space direction-column" _kitchenRuntime _kitchenRuntimeComponentId="slot-1" _kitchenRuntimeDefinitionId="slot"
  >
  </div>`);
  });

  it('test should call visit when componentList has content', () => {
    // @ts-ignore
    const backUp = CodeGenVisitorTest.prototype.visit;
    const spyVisit = jest.fn();
    // @ts-ignore
    CodeGenVisitorTest.prototype.visit = spyVisit;
    const SlotVisitor = mixinSlot(CodeGenVisitorTest);

    const slotVisitor = new SlotVisitor();

    slotVisitor.visitSlot(
      {
        componentList: [
          {
            id: 'component-1',
            type: KitchenType.Component,
            definitionId: 'component-xyz',
            parentSlotId: 'slot-1',
            styles: {},
            properties: {},
          }
        ],
        featureList  : [],
        id           : 'slot-1',
        direction    : 'vertical'
      }
    );

     slotVisitor.getOutput();

    expect(spyVisit).toBeCalled();
    expect(spyVisit).toBeCalledTimes(1);

    slotVisitor.visitSlot(
      {
        componentList: [
          {
            id: 'component-1',
            type: KitchenType.Component,
            definitionId: 'component-xyz',
            parentSlotId: 'slot-1',
            styles: {},
            properties: {},
          },
          {
            id: 'component-2',
            type: KitchenType.Component,
            definitionId: 'component-xyz',
            parentSlotId: 'slot-1',
            styles: {},
            properties: {},
          }
        ],
        featureList  : [],
        id           : 'slot-1',
        direction    : 'vertical'
      }
    );

    slotVisitor.getOutput();

    expect(spyVisit).toBeCalledTimes(1 + 2);

    // @ts-ignore
    CodeGenVisitorTest.prototype.visit = backUp;
  });

  it('test slot feature', () => {
    // @ts-ignore
    const backUp = CodeGenVisitorTest.prototype.visit;
    const spyVisit = jest.fn().mockImplementation(function () {
      this.write(' featue-test-slot-feature')
    });
    // @ts-ignore
    CodeGenVisitorTest.prototype.visit = spyVisit;

    const SlotVisitor = mixinSlot(CodeGenVisitorTest);

    const slotVisitor = new SlotVisitor();

    slotVisitor.visitSlot(
      {
        componentList: [],
        featureList  : [
          {
            'id'          : 'LhJzILpx121ToMms8yK_Z',
            'type'        : 1,
            'definitionId': 'space-feature',
            'hostId'      : 'v0iBzyWMoGZ532tdQ76dX',
            'styles'      : {
              'xl': {
                'visible'   : true,
                'direction' : 'row',
                'justify'   : 'flex-start',
                'align'     : 'flex-start',
                'height'    : { 'type': 'auto', 'customValue': 48, 'customUnit': 'px' },
                'paddings'  : {},
                'overflowX' : 'visible',
                'overflowY' : 'visible',
                'width'     : { 'type': 'auto', 'customValue': 48, 'customUnit': 'px' },
                'background': {
                  'color'    : 'transparent',
                  'imageSrc' : { 'url': '', 'uploadUrl': '', 'name': '', 'active': 'upload' },
                  'imageSize': 'auto'
                }
              }
            },
            'properties'  : { },
            'actions'     : { 'init': [], 'click': [] },
            'index'       : 0
          }
        ],
        id           : 'slot-1',
        direction    : 'vertical'
      }
    );

    const result = slotVisitor.getOutput();

    expect(result).toBe(`  <div featue-test-slot-feature cdkScrollable triDropFlexContainer uid="slot-1" triDropFlexContainerOrientation="vertical" class="space direction-column" _kitchenRuntime _kitchenRuntimeComponentId="slot-1" _kitchenRuntimeDefinitionId="slot"
  >
  </div>`);

    // @ts-ignore
    CodeGenVisitorTest.prototype.visit = backUp;
  });
});