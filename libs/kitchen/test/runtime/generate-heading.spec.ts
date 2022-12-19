import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  definitionId: 'heading',
  id: '0i4zYZ_D2bFSxNlw3TnMK',
  index: 0,
  parentSlotId: 'lHHKVQ-8okGuDbbGqO6mU',
  properties: {
    alignment: 'left',
    italic: false,
    name: 'Heading2',
    text: 'Card Header',
    transform: 'none',
    type: 'h6',
  },
  styles: {
    xl: {
      color: 'basic',
      visible: true,
    },
  },
};

describe('generate heading', () => {
  it('generate heading', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<h6 uid=\\"Heading2\\" triDrag [triDragData]=\\"{id: '0i4zYZ_D2bFSxNlw3TnMK', name: 'Heading2'}\\">
        Card Header
      </h6>"
    `);
  });
});
