import { dest, src, task } from 'gulp';
import { factory } from 'typescript';
import ts = require('typescript');

const gulpTap = require('gulp-tap');
const gulpFile = require('gulp-file');

task('generate-ast-update', () => {
  return src('libs/reiki-ast/**/*.ast.ts', {
    base: ''
  })
    .pipe(gulpTap(file => {
      const fileContents = (file.contents as Buffer).toString('utf8');

      const sourceFile = ts.createSourceFile('', fileContents, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

      const transformedSourceFiles = ts.transform([sourceFile], [
        (context => {
          const visitClassDeclaration = (node: ts.ClassDeclaration) => {
            const visitedMembers = ts.visitNodes(node.members, visitUpdateMethodDeclaration);
            return factory.updateClassDeclaration(
              node,
              node.decorators, node.modifiers, node.name, node.typeParameters,
              [
                factory.createHeritageClause(
                  ts.SyntaxKind.ExtendsKeyword,
                  [factory.createExpressionWithTypeArguments(
                    factory.createIdentifier('Node'),
                    undefined
                  )]
                )
              ],
              visitedMembers
            );
          };

          const visitUpdateMethodDeclaration = (node) => {
            if (ts.isConstructorDeclaration(node)) {
              return factory.updateConstructorDeclaration(
                node, node.decorators, node.modifiers, node.parameters,
                factory.createBlock(
                  [factory.createExpressionStatement(factory.createCallExpression(
                    factory.createSuper(),
                    undefined,
                    []
                  ))],
                  true
                )
              );
            } else if (ts.isMethodDeclaration(node) &&
              ts.isIdentifier(node.name) &&
              node.name.text.startsWith('update') &&
              node.parameters && node.parameters.length > 0
            ) {
              return factory.updateMethodDeclaration(node,
                node.decorators,
                node.modifiers,
                node.asteriskToken,
                node.name,
                node.questionToken,
                node.typeParameters,
                node.parameters,
                node.type,
                factory.createBlock(
                  [factory.createReturnStatement(factory.createConditionalExpression(
                    node.parameters.reduce<ts.Expression>((prev: ts.Expression | undefined, curr) => {
                      if (prev) {
                        return factory.createBinaryExpression(
                          prev,
                          factory.createToken(ts.SyntaxKind.BarBarToken),
                          factory.createBinaryExpression(
                            factory.createPropertyAccessExpression(
                              factory.createThis(),
                              factory.createIdentifier((curr.name as ts.Identifier).text)
                            ),
                            factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                            factory.createIdentifier((curr.name as ts.Identifier).text)
                          )
                        );
                      } else {
                        return factory.createBinaryExpression(
                          factory.createPropertyAccessExpression(
                            factory.createThis(),
                            factory.createIdentifier((curr.name as ts.Identifier).text)
                          ),
                          factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                          factory.createIdentifier((curr.name as ts.Identifier).text)
                        );
                      }
                      //@ts-ignore
                    }, null as ts.Expression) as ts.Expression,


                    factory.createToken(ts.SyntaxKind.QuestionToken),
                    factory.createCallExpression(
                      factory.createIdentifier('update'),
                      undefined,
                      [
                        factory.createNewExpression(
                          factory.createIdentifier((node.name as ts.Identifier).text.replace(/^update/g, '')),
                          undefined,
                          node.parameters.map(it => it.name as ts.Identifier)
                        ),
                        factory.createThis()
                      ]
                    ),
                    factory.createToken(ts.SyntaxKind.ColonToken),
                    factory.createThis()
                  ))],
                  true
                )
              );
            }

            return node;
          };


          const visitor = (node) => {
            if (ts.isClassDeclaration(node)) {
              return visitClassDeclaration(node);
            }

            return ts.visitEachChild(node, (child) => visitor(child), context);
          };

          return (node) => ts.visitNode(node, visitor);
        })
      ]);


      const newSourceFile = transformedSourceFiles.transformed[0];

      const printer = ts.createPrinter();
      let output = printer.printFile(newSourceFile);
      output = `import {Node} from './common.ast'\n` + output;

      file.contents = Buffer.from(output, 'utf8');

    }))
    .pipe(
      dest('dist/generate-ast-update')
    );
});
