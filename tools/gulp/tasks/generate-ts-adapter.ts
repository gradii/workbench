import { dest, src, task } from 'gulp';
import { factory } from 'typescript';
import ts = require('typescript');
import { PropertyAccessExpression } from '@devops-tools/reiki-ast';

const gulpTap = require('gulp-tap');
const gulpFile = require('gulp-file');

task('generate-ts-adapter', () => {
  return src('libs/reiki-ts-adapter/**/reiki-ts-adapter.ts', {
    base: ''
  })
    .pipe(gulpTap(file => {
      const fileContents = (file.contents as Buffer).toString('utf8');

      const sourceFile = ts.createSourceFile('', fileContents, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

      const transformedSourceFiles = ts.transform([sourceFile], [
        (context => {
          const visitor = (node) => {
            if (
              ts.isReturnStatement(node) && ts.isCallExpression((<ts.ReturnStatement>node).expression!)

            ) {
              const expression = node.expression as ts.CallExpression;
              const methodName = expression.expression as ts.PropertyAccessExpression;
              const firstArg = expression.arguments[0];

              if (ts.isPropertyAccessExpression(expression.expression)) {
                const propertyAccessExpression = expression.expression;
                if (ts.isIdentifier(propertyAccessExpression.expression)) {
                  const clazzName = propertyAccessExpression.name.text.replace(/^update/g, '');
                  return factory.updateReturnStatement(
                    node,
                    factory.createCallExpression(
                      factory.createIdentifier('update'),
                      undefined,
                      [
                        factory.createNewExpression(
                          factory.createIdentifier(clazzName),
                          undefined,
                          expression.arguments.slice(1).map((it) => {
                            // if (ts.isCallExpression(it) && it.arguments && it.arguments.length > 0) {
                            //   const arguLength = it.arguments.length;
                            //
                            //   return factory.updateCallExpression(
                            //     it,
                            //     it.expression,
                            //     undefined,
                            //     [
                            //       ...(
                            //         arguLength - 2 > 0 ?
                            //           it.arguments.slice(0, arguLength - 2) :
                            //           []
                            //       ),
                            //       factory.createPropertyAccessExpression(
                            //         factory.createIdentifier('ts'),
                            //         factory.createIdentifier((it.arguments[arguLength - 1] as ts.Identifier).text)
                            //       )
                            //     ]
                            //   );
                            // }
                            return it;
                          })
                        ),
                        firstArg
                      ]
                    )
                  );
                }
              }

            }

            return ts.visitEachChild(node, (child) => visitor(child), context);
          };

          return (node) => ts.visitNode(node, visitor);
        })
      ]);

      const newSourceFile = transformedSourceFiles.transformed[0];

      const printer = ts.createPrinter();
      let output = printer.printFile(newSourceFile);

      file.contents = Buffer.from(output, 'utf8');

    }))
    .pipe(
      dest('dist/generate-ts-adapter')
    );
});
