import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  definitionId: 'header',
  id: 'header',
  index: 0,
  parentSlotId: 'headerParent',
  properties: {
    fixed: false,
    name: 'Header',
  },
  styles: {
    lg: {},
    md: {},
    sm: {},
    xl: {
      background: {
        color: {
          dataValue: 'default',
          value: 'default',
          withData: false,
        },
      },
      paddings: {
        paddingBottom: 16,
        paddingBottomUnit: 'px',
        paddingLeft: 16,
        paddingLeftUnit: 'px',
        paddingRight: 16,
        paddingRightUnit: 'px',
        paddingTop: 16,
        paddingTopUnit: 'px',
      },
      size: {
        heightAuto: false,
        heightUnit: 'px',
        heightValue: '80',
      },
      visible: true,
    },
    xs: {},
  },
};

describe('generate header', () => {
  it('should generate header', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<unknown-header>
      </unknown-header>"
    `);
  });
});
