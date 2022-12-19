import * as prettier from 'prettier';
import { PureElementNode, PureNode } from './builder/builder-node/pure-node';
import { CodeGenVisitor } from './code-gen-visitor';
import { dataTest } from './data.test';

describe('code-gen-visitor', () => {
  it('test generate code', () => {
    const codeGenVisitor        = new CodeGenVisitor();
    const elementNode: PureNode = codeGenVisitor.visitElement({
      componentList: [],
      'id'         : '1',
      'featureList': []
    });

    expect(elementNode.isSlot).toBe(true);
    expect(elementNode).toMatchSnapshot();
    const result = codeGenVisitor.getElementOutput([elementNode]);
    expect(result).toBe(
      `<div class="space direction-column" cdkScrollable uid="1" triDropFlexContainer id="1" triDropFlexContainerOrientation="vertical" kitchenRuntime kitchenRuntimeComponentId="1" kitchenRuntimeDefinitionId="slot"></div>`);
  });

  it('test generate code with element', () => {
    const codeGenVisitor                  = new CodeGenVisitor();
    const elementBuilder: PureElementNode = codeGenVisitor.visitElement(
      dataTest.content
    );


    let result = codeGenVisitor.getElementOutput([elementBuilder]);


    result = prettier.format(result, {
      parser: 'html'
    });
    expect(result).toMatchSnapshot();
  });

});