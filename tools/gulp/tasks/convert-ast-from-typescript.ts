import {dest, series, src, task} from 'gulp';

const gulpTap = require('gulp-tap');

import ts = require('typescript');
import * as Vinyl from 'vinyl';

import * as fs from "fs";
import {factory, visitEachChild} from "typescript";

/**
 * if the method signature has multi declaration.
 * the `simple` use the simplest signature.
 * the `full` use the longest signature.
 */
enum GenerateMethodMode {
  Simple,
  Full
}


task('convert-ast-from-typescript', () => {
  // console.log('convert ast from typescript');

  return src('tools/typescript-srcs/**/types.ts', {
    base: 'tools'
  })
    .pipe(
      gulpTap((file: Vinyl) => {
        const sourceFile = ts.createSourceFile(file.path, (file.contents as Buffer).toString('utf8'),
          ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS
        );

        const mode = GenerateMethodMode.Simple;

        const result: any = [];

        const handledClass: string[] = [];


        ts.transform([sourceFile], [
          (context) => {
            const visit = (node) => {
              if (ts.isInterfaceDeclaration(node)) {
                if (node.name.escapedText === 'NodeFactory') {

                  return ts.visitEachChild(node, (child: ts.Node): any => {
                    if (ts.isMethodSignature(child) && child.type !== undefined && ts.isTypeReferenceNode(child.type)) {
                      const methodName = child.name;
                      const typeName = child.type.typeName
                      // let isValid = false;
                      if (ts.isIdentifier(methodName) && ts.isIdentifier(typeName)) {
                        // if (methodName.text !== 'createNodeArray') {
                        const methodNameString = methodName.text;
                        if (methodNameString.startsWith('create') &&
                          methodNameString.replace(/^create/g, '') === typeName.text
                        ) {
                          // isValid = true;
                          const parameters = child.parameters;

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


                          if (mode === GenerateMethodMode.Simple) {
                            if (!handledClass.includes(methodNameString)) {
                              handledClass.push(methodNameString)
                            } else {
                              return node;
                            }
                          }

                          result.push(
                            factory.createClassDeclaration(
                              undefined,
                              [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
                              factory.createIdentifier(methodNameString.replace(/^create/g, '')),
                              child.typeParameters,
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
                                )
                              ]
                            )
                          )

                          console.log(methodNameString)
                        }
                        // }
                      }
                      return child;
                    }
                  }, context)
                }
              }

              return ts.visitEachChild(node, (child) => visit(child), context);
            }
            return (node) => ts.visitNode(node, visit);
          }
        ])

        const transformedSourceFile = factory.createSourceFile(
          [
            ...ts.createSourceFile('', `
import {
  ArrayBindingElement, AssertsKeyword,
  AsteriskToken, AwaitKeyword,
  BinaryOperator,
  BinaryOperatorToken,
  BindingName,
  BooleanLiteral, CaseOrDefaultClause, ClassElement,
  ColonToken, ConciseBody,
  DotDotDotToken, EndOfFileToken,
  EntityName, EqualsGreaterThanToken, ExclamationToken,
  Expression,
  ForInitializer, JSDocNamespaceDeclaration, JSDocPropertyLikeTag,
  JsxAttributeLike, JsxChild, JsxClosingFragment, JsxTagNameExpression, KeywordTypeSyntaxKind,
  LiteralExpression,
  MinusToken,
  Modifier,
  ModifierFlags,
  ModifierSyntaxKind, ModuleBody, ModuleName, ModuleReference, NamedExportBindings, NamedImportBindings, NodeFlags,
  NullLiteral,
  ObjectLiteralElementLike,
  PlusToken,
  PostfixUnaryOperator,
  PrefixUnaryOperator, PropertyAccessEntityNameExpression,
  PropertyName,
  PropertyNameLiteral,
  PseudoBigInt,
  QuestionDotToken,
  QuestionToken,
  ReadonlyKeyword, ScriptTarget,
  Statement,
  SyntaxKind,
  TemplateLiteral,
  TokenFlags, Type,
  TypeElement,
  TypeNode, UnparsedSourceText
} from "typescript";
`, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TSX).statements,
            ...result],
          factory.createToken(ts.SyntaxKind.EndOfFileToken),
          ts.NodeFlags.None
        )

        const printer = ts.createPrinter();

        const transformedSourceFileContent = printer.printNode(
          ts.EmitHint.Unspecified,
          transformedSourceFile,
          transformedSourceFile
        );

        file.contents = Buffer.from(transformedSourceFileContent, 'utf8')


        return file;
      })
    )
    .pipe(
      dest('dist/convert-ast-from-typescript')
    );

})
