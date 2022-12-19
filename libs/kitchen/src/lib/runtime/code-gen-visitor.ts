import { KitchenComponent, KitchenSlot } from '@common/public-api';
import { PureElementNode, PureNode } from './builder/builder-node/pure-node';
import { TemplateBuilder } from './builder/template-builder';
import { mixinSpaceFeature } from './feature-mixins/mixin-space-feature';
import { mixinAccordion } from './mixins/mixin-accordion';
import { mixinButton } from './mixins/mixin-button';
import { mixinCard } from './mixins/mixin-card';
import { mixinCheckbox } from './mixins/mixin-checkbox';
import { mixinContentSlot } from './mixins/mixin-content-slot';
import { mixinHeading } from './mixins/mixin-heading';
import { mixinIcon } from './mixins/mixin-icon';
import { mixinSlot } from './mixins/mixin-slot';
import { mixinSpace } from './mixins/mixin-space';

export class CodeGenVisitor extends mixinContentSlot(
  mixinSlot(
    mixinIcon(
      mixinAccordion(
        mixinCheckbox(
          mixinButton(
            mixinHeading(
              mixinCard(
                mixinSpace(
                  mixinSpaceFeature(
                    class {
                    }
                  )
                )
              )
            )
          )
        )
      )
    )
  )
) {

  ident            = 0;
  output: string[] = [];

  public templateBuilder = new TemplateBuilder();

  elementNode: PureElementNode;

  visitElement(node: KitchenComponent | KitchenSlot): PureElementNode {
    if (!Object.hasOwnProperty.call(node, 'definitionId')) {
      return this.visitElementSlot(node as KitchenSlot);
    } else {
      if ((node as KitchenComponent).definitionId === 'space') {
        return this.visitElementSpace(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'space-feature') {
        return this.visitElementSpaceFeature(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'card') {
        return this.visitElementCard(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'button') {
        return this.visitElementButton(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'checkbox') {
        return this.visitElementCheckbox(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'accordion') {
        return this.visitElementAccordion(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'heading') {
        return this.visitElementHeading(node as KitchenComponent);
      } else if ((node as KitchenComponent).definitionId === 'icon') {
        return this.visitElementIcon(node as KitchenComponent);
      } else {
        throw new Error('unknown element');
      }
    }
  }

  incIdent(level: number = 1) {
    this.ident += level;
  }

  decIdent(level: number = 1) {
    this.ident -= level;
  }

  write(content: string) {
    this.output.push(content);
  }

  writeLn(content: string) {
    this.output.push(`${content}`);
  }

  identWrite(content: string) {
    this.output.push(`${'  '.repeat(this.ident)}${content}`);
  }

  identWriteLn(content: string) {
    this.output.push(`${'  '.repeat(this.ident)}${content}\n`);
  }

  incWrite(content: string, ident?: number) {
    this.incIdent(ident);
    this.identWrite(content);
  }

  decWrite(content: string, ident?: number) {
    this.decIdent(ident);
    this.identWrite(content);
  }

  writeDec(content: string, ident?: number) {
    this.identWrite(content);
    this.decIdent(ident);
  }

  getOutput() {
    return this.output.join('');
  }

  flush() {
    const output = this.getOutput();
    this.output  = [];
    return output;
  }

  getElementOutput(elementNodes: PureNode[]){
    return this.templateBuilder.build(elementNodes);
  }
}