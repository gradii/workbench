import { isBoolean, isObject } from '@gradii/nanofn';
import { escapeHtml } from '../../helper';
import { isBinding, resolveBinding } from '../template-builder';

interface SimpleNode {
}

export type PureNode = Comment | Element | PureText | PureElementListNode | PureElementNode;


export class PureElementListNode implements SimpleNode {
  constructor(public elementNodes: PureNode[] = []) {
  }

  addElementNode(elementNode: PureElementNode) {
    this.elementNodes.push(elementNode);
  }
}

export class PureElementNode implements SimpleNode {
  parent: PureElementNode | null = null;

  public attributes: PureAttribute[] = [];

  public classAttribute        = [];
  public classBindingAttribute = [];
  public styleAttribute        = [];
  public styleBindingAttribute = [];

  textContent = null;

  constructor(public tagName: string,
              public isSlot: boolean      = false,
              public children: PureNode[] = []) {
  }

  addClass(value) {
    this.classAttribute.push(value);
    return this;
  }


  addClassBinding(key, value) {
    this.classBindingAttribute.push({ key, value });
    return this;
  }

  addStyle(value) {
    this.styleAttribute.push(value);
    return this;
  }

  addStyleBinding(key, value) {
    this.styleBindingAttribute.push({ key, value });
    return this;
  }

  addAttribute(name: string, value: string = null) {
    this.attributes.push(new PureAttribute(name, value));
    return this;
  }

  addInputAttribute(name: string, value: string | Record<string, string | any>) {
    this.attributes.push(new PureInputAttribute(name, value));
    return this;
  }

  addOutputAttribute(name: string, value: string | Record<string, string | any>) {
    this.attributes.push(new PureOutputAttribute(name, value));
    return this;
  }

  addTextContent(value: string) {
    this.textContent = value;
    return this;
  }
}

export class PureText implements SimpleNode {
  constructor(
    public value: string) {
  }
}

export class PureAttribute implements SimpleNode {
  constructor(
    public name: string, public value: string | Record<string, string | any>
  ) {
  }
}

export class PureClassAttribute extends PureAttribute {
  public readonly name = 'class';

  constructor(
    public value: string[]) {
    super('class', value);
  }
}

export class PureInputAttribute extends PureAttribute implements SimpleNode {
  constructor(
    public name: string, public value: string | Record<string, string | any>) {
    super(name, value);
  }
}

export class PureOutputAttribute extends PureAttribute implements SimpleNode {
  constructor(
    public name: string, public value: string | Record<string, string | any>) {
    super(name, value);
  }
}

//
// export class SimpleElement implements SimpleNode {
//   constructor(
//     public name: string, public attrs: PureAttribute[], public children: Node[]) {
//   }
// }

export class PureComment implements SimpleNode {
  constructor(public value: string | null) {
  }
}

function safeHtmlTagName(tagName: string) {
  return tagName.replace(/[^a-z0-9-]/gi, '');
}

function safeHtmlAttributeName(name: string) {
  return name.replace(/[^a-z0-9-_]/gi, '');
}

export class TemplateBuildCodeGenVisitor {
  visitNode(node: PureNode): string {
    if (node instanceof PureElementNode) {
      return this.visitElementNode(node);
    } else if (node instanceof PureElementListNode) {
      return this.visitElementListNode(node);
    }
    return '';
  }

  visitElementNode(elementNode: PureElementNode): string {
    const tagName = safeHtmlTagName(elementNode.tagName);
    let output    = `<${tagName}`;
    if (elementNode.classAttribute.length > 0) {
      const classAttributes = elementNode.classAttribute.map(value => safeHtmlAttributeName(value));
      output += ` class="${classAttributes.join(' ')}"`;
    }
    if (elementNode.classBindingAttribute.length > 0) {
      const classAttributes = elementNode.classBindingAttribute
        .map(value => {
          const _value = resolveBinding(value.value);
          return `'${safeHtmlAttributeName(value.key)}':${_value}`;
        });
      output += ` [ngClass]="{${classAttributes}}"`;
    }

    elementNode.attributes.forEach(attribute => {
      const attributeName = safeHtmlAttributeName(attribute.name);
      if (attribute instanceof PureInputAttribute) {
        if (isBinding(attribute.value)) {
          const value = resolveBinding(attribute.value);
          output += ` [${attributeName}]="${value}"`;
        } else if (isObject(attribute.value)) {
          const value = Object.keys(attribute.value).map(key => {
            const value = attribute.value[key];
            if (isBoolean(value)) {
              return `'${key}':${value}`;
            } else if (isBinding(value)) {
              return `'${key}':${resolveBinding(value)}`;
            } else {
              return `'${key}':'${attribute.value[key]}'`;
            }
          }).join(',');
          output += ` [${attributeName}]="{${value}}"`;
        }
      } else if (attribute instanceof PureOutputAttribute) {
        const value = resolveBinding(attribute.value);
        output += ` (${attributeName})="${value}"`;
      } else {
        if (attribute.value == null) {
          output += ` ${attributeName}`;
        } else {
          output += ` ${attributeName}="${attribute.value}"`;
        }
      }
    });
    output += '>';
    if (elementNode.textContent) {
      output += escapeHtml(elementNode.textContent);
    }
    if (elementNode.children.length) {
      output += elementNode.children.map(child => this.visitNode(child)).join('');
    }
    output += `</${tagName}>`;
    return output;
  }

  private visitElementListNode(node: PureElementListNode) {
    return node.elementNodes.map(elementNode => this.visitNode(elementNode)).join('');
  }
}
