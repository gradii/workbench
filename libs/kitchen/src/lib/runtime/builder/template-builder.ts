import { isBoolean } from '@gradii/nanofn';
import { PureElementListNode, PureElementNode, PureNode, TemplateBuildCodeGenVisitor } from './builder-node/pure-node';

export function binding(value) {
  const fn = () => {
    return value;
  };

  fn.__binding__ = binding;
  return fn;
}

export function isBinding(value) {
  return typeof value === 'function' && value.hasOwnProperty('__binding__') &&
    value.__binding__ === binding;
}

export function resolveBinding(value: any, wrap: boolean = true) {
  if (isBoolean(value)) {
    return value;
  }
  return isBinding(value) ? value() : `'${value}'`;
}

export class TemplateBuilder {

  newElementNode(tagName: string, isSlot: boolean = false): PureElementNode {
    return new PureElementNode(tagName, isSlot);
  }

  build(elementNodes: PureNode[]): string {
    const templateBuildCodeGenVisitor = new TemplateBuildCodeGenVisitor();

    return templateBuildCodeGenVisitor.visitNode(new PureElementListNode(elementNodes));
  }

}
