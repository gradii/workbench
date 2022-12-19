import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  actions: {
    click: [],
    init: [],
  },
  definitionId: 'space',
  id: '15786492785670.13489939253231087',
  index: 0,
  parentSlotId: '3',
  properties: {
    container: false,
    name: 'Space1',
  },
  styles: {
    lg: {},
    md: {},
    sm: {},
    xl: {
      align: 'center',
      background: {
        color: {
          dataValue: 'transparent',
          value: 'transparent',
          withData: false,
        },
        imageSize: 'auto',
        imageSrc: {
          active: 'upload',
          name: '',
          uploadUrl: '',
          url: '',
        },
      },
      direction: 'row',
      height: {
        customUnit: '%',
        customValue: 100,
        type: 'auto',
      },
      justify: 'flex-start',
      overflowX: 'visible',
      overflowY: 'visible',
      visible: true,
      width: {
        customUnit: '%',
        customValue: 100,
        type: 'auto',
      },
    },
    xs: {},
  },
};

describe('generate space', () => {
  it('generate space', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
"  <div cdkScrollable triDropFlexContainer uid=\\"Space1\\" class=\\"space flex-row\\" triDropFlexContainerOrientation=\\"horizontal\\" [triDropFlexContainerData]=\\"{id: '15786492785670.13489939253231087', name: 'Space1', parentSlotId: '3'}\\" (triDropFlexContainerDropped)=\\"onDragDropped($event)\\">
  </div>"
`);
  });
});
