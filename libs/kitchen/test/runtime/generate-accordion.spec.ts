import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  actions: {
    // @ts-ignore
    init: [],
  },
  definitionId: 'accordion',
  id: 'hSqKZG_y_hB_r3E7-G6CD',
  index: 2,
  parentSlotId: '15786492785660.736525773611667',
  properties: {
    container: true,
    name: 'Accordion',
    options: [
      {
        id: 'item0',
        value: 'Item 1',
      },
      {
        id: 'item1',
        value: 'Item 2',
      },
    ],
  },
  styles: {
    xl: {
      multi: false,
      size: {
        heightAuto: true,
        heightUnit: 'px',
        heightValue: 200,
        widthAuto: false,
        widthUnit: '%',
        widthValue: 100,
      },
      visible: true,
    },
  },
};

describe('generate accordion', () => {
  it('should generate accordion', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<tri-accordion uid=\\"Accordion\\" triDrag>
      </tri-accordion>"
    `);
  });
});
