import { dest, series, src, task } from 'gulp';

import ts = require('typescript');

import { factory, forEachChild, visitEachChild } from 'typescript';


const rename = require('gulp-rename');
const parse = require('comment-parser');
const gulpTap = require('gulp-tap');


export class TsAstMirror {

  public static hasClazz() {

  }

  public static hasMethod(classDeclaration) {

  }
}

export class ReikiAstMirror {
  public static hasClazz() {

  }

  public static getClazz() {

  }

  public static hasMethod(classDeclaration) {

  }

  public static getMethods() {

  }
}

const result: string[] = [];
const resultNodes: any[] = [];

const resultClazz: any[] = [];


const checkNodes = [
  'NumericLiteral',
  'BigIntLiteral',
  'StringLiteral',
  'JsxText',
  'RegularExpressionLiteral',
  'NoSubstitutionTemplateLiteral',
  'TemplateHead',
  'TemplateMiddle',
  'TemplateTail',
  'Identifier',
  'QualifiedName',
  'ComputedPropertyName',
  'PrivateIdentifier',
  'SuperKeyword',
  'ImportKeyword',
  'CommaToken',
  'QuestionToken',
  'ExclamationToken',
  'TypeParameterDeclaration',
  'Parameter',
  'Decorator',
  'PropertySignature',
  'PropertyDeclaration',
  'MethodSignature',
  'MethodDeclaration',
  'ConstructorDeclaration',
  'GetAccessorDeclaration',
  'SetAccessorDeclaration',
  'CallSignatureDeclaration',
  'ConstructSignatureDeclaration',
  'IndexSignatureDeclaration',
  'TypePredicateNode',
  'TypeReferenceNode',
  'FunctionTypeNode',
  'ConstructorTypeNode',
  'TypeQueryNode',
  'TypeLiteralNode',
  'ArrayTypeNode',
  'TupleTypeNode',
  'NamedTupleMember',
  'OptionalTypeNode',
  'RestTypeNode',
  'UnionTypeNode',
  'IntersectionTypeNode',
  'ConditionalTypeNode',
  'InferTypeNode',
  'ParenthesizedTypeNode',
  'ThisTypeNode',
  'TypeOperatorNode',
  'IndexedAccessTypeNode',
  'MappedTypeNode',
  'LiteralTypeNode',
  'ImportTypeNode',
  'TemplateLiteralTypeSpan',
  'TemplateLiteralTypeNode',
  'ObjectBindingPattern',
  'ArrayBindingPattern',
  'BindingElement',
  'ArrayLiteralExpression',
  'ObjectLiteralExpression',
  'PropertyAccessExpression',
  'ElementAccessExpression',
  'CallExpression',
  'NewExpression',
  'TaggedTemplateExpression',
  'TypeAssertionExpression',
  'ParenthesizedExpression',
  'FunctionExpression',
  'ArrowFunction',
  'DeleteExpression',
  'TypeOfExpression',
  'VoidExpression',
  'AwaitExpression',
  'PrefixUnaryExpression',
  'PostfixUnaryExpression',
  'BinaryExpression',
  'ConditionalExpression',
  'TemplateExpression',
  'YieldExpression',
  'SpreadElement',
  'ClassExpression',
  'OmittedExpression',
  'ExpressionWithTypeArguments',
  'AsExpression',
  'NonNullExpression',
  'MetaProperty',
  'SyntheticExpression',
  'PartiallyEmittedExpression',
  'CommaListExpression',
  'TemplateSpan',
  'SemicolonClassElement',
  'Block',
  'VariableStatement',
  'EmptyStatement',
  'ExpressionStatement',
  'IfStatement',
  'DoStatement',
  'WhileStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'ContinueStatement',
  'BreakStatement',
  'ReturnStatement',
  'WithStatement',
  'SwitchStatement',
  'LabeledStatement',
  'ThrowStatement',
  'TryStatement',
  'DebuggerStatement',
  'VariableDeclaration',
  'VariableDeclarationList',
  'FunctionDeclaration',
  'ClassDeclaration',
  'InterfaceDeclaration',
  'TypeAliasDeclaration',
  'EnumDeclaration',
  'ModuleDeclaration',
  'ModuleBlock',
  'CaseBlock',
  'NamespaceExportDeclaration',
  'ImportEqualsDeclaration',
  'ImportDeclaration',
  'ImportClause',
  'NamespaceImport',
  'NamespaceExport',
  'NamedImports',
  'ImportSpecifier',
  'ExportAssignment',
  'ExportDeclaration',
  'NamedExports',
  'ExportSpecifier',
  'MissingDeclaration',
  'NotEmittedStatement',
  'SyntheticReference',
  'MergeDeclarationMarker',
  'EndOfDeclarationMarker',
  'ExternalModuleReference',
  'JsxElement',
  'JsxSelfClosingElement',
  'JsxOpeningElement',
  'JsxClosingElement',
  'JsxFragment',
  'JsxOpeningFragment',
  'JsxClosingFragment',
  'JsxAttribute',
  'JsxAttributes',
  'JsxSpreadAttribute',
  'JsxExpression',
  'CaseClause',
  'DefaultClause',
  'HeritageClause',
  'CatchClause',
  'PropertyAssignment',
  'ShorthandPropertyAssignment',
  'SpreadAssignment',
  'EnumMember',
  'UnparsedPrepend',
  'SourceFile',
  'Bundle',
  'UnparsedSource',
  'JSDocTypeExpression',
  'JSDocNameReference',
  'JSDocAllType',
  'JSDocUnknownType',
  'JSDocNullableType',
  'JSDocNonNullableType',
  'JSDocOptionalType',
  'JSDocFunctionType',
  'JSDocVariadicType',
  'JSDocNamepathType',
  'JSDoc',
  'JSDocTypeLiteral',
  'JSDocSignature',
  'JSDocAugmentsTag',
  'JSDocAuthorTag',
  'JSDocClassTag',
  'JSDocCallbackTag',
  'JSDocPublicTag',
  'JSDocPrivateTag',
  'JSDocProtectedTag',
  'JSDocReadonlyTag',
  'JSDocDeprecatedTag',
  'JSDocEnumTag',
  'JSDocParameterTag',
  'JSDocReturnTag',
  'JSDocThisTag',
  'JSDocTypeTag',
  'JSDocTemplateTag',
  'JSDocTypedefTag',
  'JSDocUnknownTag',
  'JSDocPropertyTag',
  'JSDocImplementsTag',
  'SyntaxList'
];

task('generate-from-factory', () => {
  // console.log('convert ast from typescript');

  return src('tools/typescript-srcs/**/factory/nodeFactory.ts', {
    base: 'tools'
  })
    .pipe(gulpTap((file) => {
        console.log(file.path);
        const fileContents = (file.contents as Buffer).toString('utf8');
        const sourceFile = ts.createSourceFile('', fileContents, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

        ts.transform(sourceFile, [
          (context) => {
            const visitor = (node) => {
              if (ts.isFunctionDeclaration(node)) {
                if (node.name && ts.isIdentifier(node.name) && node.name.text === 'createNodeFactory') {
                  return visitorCreateNodeFactory(node, context, fileContents);
                }
              }
              return ts.visitEachChild(node, (child) => visitor(child), context);
            };

            return (node) => {
              return ts.visitNode(node, visitor);
            };
          }
        ]);


        for (let resultNode of resultNodes) {
          const resultName = resultNode.name;
          // if (!checkNodes.includes(resultName)) {
          //   continue;
          // }

          const createNode = resultNode.create;
          const updateNode = resultNode.update;
          const parameters = createNode.parameters;

          const visitedParameters = parameters.map(p => {
            return factory.createParameterDeclaration(
              p.decorators,
              [factory.createModifier(ts.SyntaxKind.PublicKeyword)],
              p.dotDotDotToken,
              p.name,
              p.questionToken,
              p.type,
              p.initializer
            );
          });

          resultClazz.push(
            factory.createClassDeclaration(
              undefined,
              [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
              factory.createIdentifier(resultNode.name),
              createNode.typeParameters,
              undefined,
              [
                factory.createConstructorDeclaration(
                  undefined,
                  undefined,

                  visitedParameters,

                  factory.createBlock(
                    [],
                    true
                  )
                ),
                ...(updateNode ? [factory.createMethodDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier(`update${resultNode.name}`),
                  undefined,
                  undefined,
                  updateNode.parameters.slice(1),
                  updateNode.type,
                  factory.createBlock(
                    [],
                    true
                  )
                )] : [])
              ]
            )
          );
        }

        // for (let node of resultNodes) {
        //   const line = sourceFile.getLineAndCharacterOfPosition(node.pos);
        //   console.log(line);
        // }


        const transformedSourceFile = factory.createSourceFile(resultClazz, factory.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.JavaScriptFile);

        const printer = ts.createPrinter();

        const transformedSourceFileContent = printer.printNode(
          ts.EmitHint.Unspecified,
          transformedSourceFile,
          transformedSourceFile
        );

        file.contents = Buffer.from(transformedSourceFileContent, 'utf8');

        return file;
      })
    ).pipe(dest('dist/generate-from-factory'));
});


function visitorCreateNodeFactory(node: ts.FunctionDeclaration, context, fullText) {

  const visitor = (node) => {
    if (ts.isFunctionDeclaration(node)) {
      if (node.name && node.name.text === 'createNodeFactory' && node.body && ts.isBlock(node.body)) {
        ts.visitNodes(node.body.statements, (child) => visitor(child));
      } else if (node.name && ts.isIdentifier(node.name) && (node.name.text.startsWith('create') || node.name.text.startsWith('update'))) {
        const comments = (ts.getLeadingCommentRanges(fullText, node.getFullStart()) || []).map(it => {
          const comment = fullText.substring(it.pos, it.end);
          const parsed = parse(comment);
          if (parsed.length > 0) {
            return parsed.map(it => it.description).join('');
          } else {
            return (comment || '').replace(/^\/\//g, '').replace(/^\s*static .+?$/g, '').trim();
          }
        });

        console.log(comments, node.name.text);

        if (comments.includes('@api')) {
          const name = node.name.text.replace(/(^create|^update)/g, '');
          const resultNode = resultNodes.find(it => it.name === name);

          if (node.name.text.startsWith('create')) {
            if (resultNode) {
              resultNode.create = node;
            } else {
              resultNodes.push({
                name: name,
                create: node
              });
            }
          } else if (node.name.text.startsWith('update')) {
            if (resultNode) {
              resultNode.update = node;
            } else {
              resultNodes.push({
                name: name,
                update: node
              });
            }
          }
        }

        // output.push({
        //   permissionCode: node.name.text,
        //   description   : comments.join('\n')
        // });
        return node;
      }
    }

    return node;
  };

  function visitParameter(node: ts.FunctionDeclaration, context, fullText) {

  }


  const visited = ts.visitNode(node, visitor);
  console.log(result);
  console.log(result.length);

  return visited;
}
