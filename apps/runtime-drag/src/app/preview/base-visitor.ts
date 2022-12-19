import { KitchenComponent, KitchenSlot } from '@common';

export interface BaseVisitor {
  visit(node: KitchenComponent | KitchenSlot): void;

  incIdent(level?: number): void;

  decIdent(level?: number): void;

  writeLn(content: string): void;

  incWrite(content: string, ident?: number): void;

  decWrite(content: string, ident?: number): void;

  writeDec(content: string, ident?: number): void;

  getOutput(): string;

  flush(): string;
}