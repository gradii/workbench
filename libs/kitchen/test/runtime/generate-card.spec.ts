import { CodeGenVisitor } from '../../src/lib/runtime/code-gen-visitor';

const definition = {
  actions     : {
    // @ts-ignore
    init: []
  },
  definitionId: 'card',
  id          : 'Gb63MmCEbha-cNDiTjp8a',
  index       : 1,
  parentSlotId: '15786492785660.736525773611667',
  properties  : {
    container : true,
    name      : 'Card2',
    showFooter: true,
    showHeader: true
  },
  styles      : {
    xl: {
      accent       : '',
      background   : {
        color    : 'default',
        imageSize: 'auto',
        imageSrc : {
          active   : 'upload',
          name     : '',
          uploadUrl: '',
          url      : ''
        }
      },
      bodyPadding  : true,
      footerPadding: true,
      headerPadding: true,
      size         : {
        heightAuto : true,
        heightUnit : 'px',
        heightValue: 300,
        widthAuto  : false,
        widthUnit  : '%',
        widthValue : 100
      },
      status       : '',
      visible      : true
    }
  }
};

describe('generate card', () => {
  it('should generate card', () => {
    const visitor = new CodeGenVisitor();

    visitor.visitCard(definition);
    const output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<tri-card uid=\\"Card2\\" triDrag [triDragData]=\\"{id: 'Gb63MmCEbha-cNDiTjp8a', name: 'Card2'}\\">
        <tri-card-header>
        </tri-card-header>
        <tri-card-body>
        </tri-card-body>
        <tri-card-footer>
        </tri-card-footer>
      </tri-card>"
    `);
  });

  it('shoud not show container when properties header/footer to be false', () => {
    let visitor = new CodeGenVisitor();

    let newDefinition = JSON.parse(JSON.stringify(definition));

    newDefinition.properties.showHeader = false;
    visitor.visitCard(newDefinition);

    let output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<tri-card uid=\\"Card2\\" triDrag [triDragData]=\\"{id: 'Gb63MmCEbha-cNDiTjp8a', name: 'Card2'}\\">
        <tri-card-body>
        </tri-card-body>
        <tri-card-footer>
        </tri-card-footer>
      </tri-card>"
    `);


    visitor                             = new CodeGenVisitor();
    newDefinition                       = JSON.parse(JSON.stringify(definition));
    newDefinition.properties.showFooter = false;
    visitor.visitCard(newDefinition);

    output = visitor.getOutput();
    expect(output).toMatchInlineSnapshot(`
      "<tri-card uid=\\"Card2\\" triDrag [triDragData]=\\"{id: 'Gb63MmCEbha-cNDiTjp8a', name: 'Card2'}\\">
        <tri-card-header>
        </tri-card-header>
        <tri-card-body>
        </tri-card-body>
      </tri-card>"
    `);
  });


});
