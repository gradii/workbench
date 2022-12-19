import { KitchenComponent, KitchenSlot } from '@common';
import { mixinAccordion } from './mixins/mixin-accordion';
import { mixinButton } from './mixins/mixin-button';
import { mixinCard } from './mixins/mixin-card';
import { mixinHeading } from './mixins/mixin-heading';
import { mixinIcon } from './mixins/mixin-icon';
import { mixinSlot } from './mixins/mixin-slot';
import { mixinSpace } from './mixins/mixin-space';

export class CodeGenVisitor extends mixinSlot(
  mixinIcon(
    mixinAccordion(
      mixinButton(
        mixinHeading(
          mixinCard(
            mixinSpace(class {
            })
          )
        )
      )
    )
  )
) {
  ident            = 0;
  output: string[] = [];

  visit(node: KitchenComponent | KitchenSlot) {
    if (!Object.hasOwnProperty.call(node, 'definitionId')) {
      this.visitSlot(node as KitchenSlot);
    } else {
      switch ((node as KitchenComponent).definitionId) {
        case 'space':
          this.visitSpace(node as KitchenComponent);
          break;
        case 'card':
          this.visitCard(node as KitchenComponent);
          break;
        case 'button':
          this.visitButton(node as KitchenComponent);
          break;
        case 'accordion':
          this.visitAccordion(node as KitchenComponent);
          break;
        case 'heading':
          this.visitHeading(node as KitchenComponent);
          break;
        case 'icon':
          this.visitIcon(node as KitchenComponent);
          break;
        default:
          this.writeLn(`<unknown-${(node as KitchenComponent).definitionId}>`);
          this.writeLn(`</unknown-${(node as KitchenComponent).definitionId}>`);
          break;
      }
    }
  }

  incIdent(level: number = 1) {
    this.ident += level;
  }

  decIdent(level: number = 1) {
    this.ident -= level;
  }

  writeLn(content: string) {
    this.output.push(`${'  '.repeat(this.ident)}${content}`);
  }

  incWrite(content: string, ident?: number) {
    this.incIdent(ident);
    this.writeLn(content);
  }

  decWrite(content: string, ident?: number) {
    this.decIdent(ident);
    this.writeLn(content);
  }

  writeDec(content: string, ident?: number) {
    this.writeLn(content);
    this.decIdent(ident);
  }

  getOutput() {
    return this.output.join('\n');
  }

  flush() {
    const output = this.getOutput();
    this.output  = [];
    return output;
  }
}