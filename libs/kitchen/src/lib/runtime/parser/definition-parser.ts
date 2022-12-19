/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { _DefinitionParserAst } from './_definition-parser-ast';
import { DefinitionLexer } from './definition-lexer';

export class DefinitionParser {
  constructor() {
  }

  static createParser(sqlString: string) {
    const _lexer: DefinitionLexer = new DefinitionLexer();
    const tokens                  = _lexer.tokenize(sqlString);
    return new _DefinitionParserAst(
      sqlString,
      undefined,
      0,
      tokens,
      sqlString.length,
      true,
      [],
      0
    );
  }

  static createPropertyBindingParser(sqlString: string) {
    const _lexer: DefinitionLexer = new DefinitionLexer();
    const tokens                  = _lexer.tokenize(sqlString);
    return new _DefinitionParserAst(
      sqlString,
      undefined,
      0,
      tokens,
      sqlString.length,
      true,
      [],
      0
    );
  }
}


