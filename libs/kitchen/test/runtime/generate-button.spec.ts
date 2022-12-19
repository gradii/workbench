import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  actions: {
    // @ts-ignore
    click: [],
  },
  definitionId: 'button',
  id: 'rmFqmZy844Jpk8-6zUZz9',
  index: 0,
  parentSlotId: 'lAH6YoNK0QnzfZiifkIFS',
  properties: {
    color: 'primary',
    disabled: false,
    icon: 'star',
    name: 'Button',
    text: 'Button',
    variant: 'fill',
  },
  styles: {
    xl: {
      iconPlacement: 'none',
      size: 'medium',
      visible: true,
      width: {
        customUnit: 'px',
        customValue: 220,
        type: 'auto',
      },
    },
  },
};

describe('generate button', () => {
  it('should generate button', () => {
    const visitor = new CodeGenVisitor();

    visitor.visit(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(
      `"<button triButton uid=\\"Button\\" triDrag [triDragData]=\\"{id: 'rmFqmZy844Jpk8-6zUZz9', name: 'Button', parentSlotId: 'lAH6YoNK0QnzfZiifkIFS'}\\" color=\\"primary\\" [disabled]=\\"false\\" icon=\\"star\\" variant=\\"fill\\">Button</button>"`
    );
  });
});
