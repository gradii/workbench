/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as asciiChars from './ascii-chars';
import type { Token } from './definition-lexer';
import { EOF, SyntaxKind } from './definition-lexer';

export class _DefinitionParserAst {
  index                     = 0;
  private rparensExpected   = 0;
  private rbracketsExpected = 0;
  private rbracesExpected   = 0;

  constructor(public input: string, public location: any, public absoluteOffset: number,
              public tokens: Token[], public inputLength: number, public parseAction: boolean,
              private errors: any[], private offset: number) {
  }

  get next(): Token {
    return this.peek(0);
  }

  /** Whether all the parser input has been processed. */
  get atEOF(): boolean {
    return this.index >= this.tokens.length;
  }

  /**
   * Index of the next token to be processed, or the end of the last token if all have been
   * processed.
   */
  get inputIndex(): number {
    return this.atEOF ? this.currentEndIndex : this.next.index + this.offset;
  }

  /**
   * End index of the last processed token, or the start of the first token if none have been
   * processed.
   */
  get currentEndIndex(): number {
    if (this.index > 0) {
      const curToken = this.peek(-1);
      return curToken.end + this.offset;
    }
    // No tokens have been processed yet; return the next token's start or the length of the input
    // if there is no token.
    if (this.tokens.length === 0) {
      return this.inputLength + this.offset;
    }
    return this.next.index + this.offset;
  }

  /**
   * Returns the absolute offset of the start of the current token.
   */
  get currentAbsoluteOffset(): number {
    return this.absoluteOffset + this.inputIndex;
  }

  advance() {
    this.index++;
  }

  consumeOptionalCharacter(code: number): boolean {
    if (this.next.isCharacter(code)) {
      this.advance();
      return true;
    } else {
      return undefined;
    }
  }

  consumeOptionalOperator(op: string): boolean {
    if (this.next.isOperator(op)) {
      this.advance();
      return true;
    } else {
      return undefined;
    }
  }

  eat() {
    const next = this.next;
    this.advance();
    return next;
  }

  error(message: string, index: number | null = null) {
    this.errors.push(new Error(`${message}, ${this.input}, ${index}, ${this.location}`));
    this.skip();
  }

  expectCharacter(code: number) {
    if (this.consumeOptionalCharacter(code)) {
      return;
    }
    this.error(`Missing expected ${String.fromCharCode(code)}`);
  }

  expectIdentifierOrKeyword(): string {
    const n = this.next;
    if (!n.isIdentifier() && !n.isKeyword()) {
      this.error(`Unexpected token ${n}, expected identifier or keyword`);
      return '';
    }
    this.advance();
    return n.toString() as string;
  }

  expectIdentifierOrKeywordOrString(): string {
    const n = this.next;
    if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
      this.error(`Unexpected token ${n}, expected identifier, keyword, or string`);
      return '';
    }
    this.advance();
    return n.toString() as string;
  }

  expectOperator(operator: string) {
    if (this.consumeOptionalOperator(operator)) {
      return;
    }
    this.error(`Missing expected operator ${operator}`);
  }

  parseBraceCondition() {

  }

  parseLtCondition() {
  }

  peek(offset: number): Token {
    const i = this.index + offset;
    return i < this.tokens.length ? this.tokens[i] : EOF;
  }

  peekKeyword(keyword: string): boolean {
    return this.next.kind == SyntaxKind.Keyword && this.next.strValue == keyword.toLowerCase();
  }

  peekKeywordAs(): boolean {
    return this.next.isKeywordAs();
  }

  peekKeywordJoin(): boolean {
    return this.next.isKeywordJoin();
  }

  peekKeywordLet(): boolean {
    return this.next.isKeywordLet();
  }

  private skip() {
    let n = this.next;
    while (this.index < this.tokens.length && !n.isCharacter(asciiChars.$SEMICOLON) &&
    (this.rparensExpected <= 0 || !n.isCharacter(asciiChars.$RPAREN)) &&
    (this.rbracesExpected <= 0 || !n.isCharacter(asciiChars.$RBRACE)) &&
    (this.rbracketsExpected <= 0 || !n.isCharacter(asciiChars.$RBRACKET))) {
      if (this.next.isError()) {
        this.errors.push(
          new Error(`this.next.toString()!, this.input, this.locationText(), this.location`));
      }
      this.advance();
      n = this.next;
    }
  }

}
