import { KitchenComponent, KitchenContentSlot, KitchenSlot } from '@common/public-api';
import { PureElementListNode, PureElementNode } from './builder/builder-node/pure-node';
import { TemplateBuilder } from './builder/template-builder';

export interface BaseVisitor {
  templateBuilder: TemplateBuilder;

  visitElement(node: KitchenComponent | KitchenSlot | KitchenContentSlot, ctx?: any): PureElementNode;

  visitSlot(node: KitchenSlot, ctx?: any): void;

  visitElementSlot(node: KitchenSlot, ctx?: any): PureElementNode;

  visitContentSlot(node: KitchenContentSlot, ctx?: any): void;

  visitElementContentSlot(node: KitchenContentSlot, ctx?: any): PureElementListNode | PureElementNode;

  incIdent(level?: number): void;

  decIdent(level?: number): void;

  writeLn(content: string): void;

  incWrite(content: string, ident?: number): void;

  decWrite(content: string, ident?: number): void;

  writeDec(content: string, ident?: number): void;

  getOutput(): string;

  flush(): string;
}