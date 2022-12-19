import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  definitionId: 'icon',
  id: 'I7kn8fo3Exv9nHJzGuO5s',
  index: 0,
  parentSlotId: 'CMotr_DNKQtYmSlU25t9N',
  properties: {
    icon: 'fill:android',
    name: 'Icon',
    tooltip: '',
  },
  styles: {
    xl: {
      color: 'basic',
      size: {
        custom: false,
        customUnit: 'rem',
        customValue: 1.25,
        predefinedValue: '',
      },
      visible: true,
    },
  },
};

describe('generate icon', () => {
  it('should generate icon', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
"<tri-icon uid=\\"Icon\\" triDrag [triDragData]=\\"{id: 'I7kn8fo3Exv9nHJzGuO5s', name: 'Icon'}\\" svgIcon=\\"fill:android\\">
</tri-icon>"
`);
  });
});
