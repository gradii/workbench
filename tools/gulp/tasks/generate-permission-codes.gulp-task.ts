import { dest, src, task } from 'gulp';
import { buildConfig } from '../../package-tools';
import { join } from 'path';
import through2 from 'through2';
import ts from 'typescript';

const rename = require('gulp-rename');
const parse = require('comment-parser');

// export function refactorIsAny<T extends ts.Node>(/*typeChecker: TypeChecker*/): ts.TransformerFactory<T> {
//   return (context) => {
//     const visit: ts.Visitor = (node) => {
//       if (ts.isDecorator(node)) {
//         return undefined;
//       }
//
//       if (
//         ts.isCallExpression(node) &&
//         ts.isIdentifier(node.expression)
//       ) {
//         if (node.expression.text === 'is_null' && node.arguments.length === 1) {
//           return ts.updateCall(node, ts.createIdentifier('isBlank'), undefined, node.arguments);
//         }
//         return node;
//       }
//
//       return ts.forEachChild(node, (child) => visit(child));
//     };
//
//     return (node) => ts.visitNode(node, visit);
//   };
// }


task('generate-permission-codes', async () => {
  console.log(buildConfig.projectDir);

  const projectDir = buildConfig.projectDir;
  const outputDir = join(buildConfig.outputDir, 'output-permission-code');

  src('libs/common/src/lib/permission-code.ts', {
    base: 'libs/common/src/lib/'
  })
    .pipe(
      through2.obj((file, _, cb) => {
        if (file.isBuffer()) {

          const filename = 'permission-code.ts';
          const code = file.contents.toString();

          const sourceFile = ts.createSourceFile(
            filename, code, ts.ScriptTarget.Latest
          );

          let output: any[] = [];

          const fullText = sourceFile.getFullText();
          const visit = (node: ts.Node) => {
            // Only consider exported nodes
            // if (!isNodeExported(node)) {
            //   return;
            // }

            if (ts.isPropertyDeclaration(node) && node.modifiers && node.modifiers.find(it => it.kind === ts.SyntaxKind.StaticKeyword) && node.name) {
              if (node.initializer && ts.isStringLiteral(node.initializer) &&
                ts.isIdentifier(node.name) &&
                (node.name as ts.Identifier).text === node.initializer.text) {
                const comments = (ts.getLeadingCommentRanges(fullText, node.getFullStart()) || []).map(it => {
                  const comment = fullText.substring(it.pos, it.end);
                  const parsed = parse(comment);
                  if (parsed.length > 0) {
                    return parsed.map(it => it.description).join('');
                  } else {
                    return (comment || '').replace(/^\/\//g, '').replace(/^\s*static .+?$/g, '').trim();
                  }
                });
                output.push({
                  permissionCode: node.name.text,
                  description   : comments.join('\n')
                });
              } else {
                console.error(`${(node.name as ts.Identifier).text} is not equal to initializer`);
              }
            } else {

              // This is a namespace, visit its children
              ts.forEachChild(node, visit);
            }
          };

          ts.forEachChild(sourceFile, visit);


          file.contents = Buffer.from(JSON.stringify(output, undefined, '  '));
          file.name = 'permission-code.json';

        }
        cb(null, file);
      }))
    .pipe(
      rename((path: any) => {
        path.extname = '.json';
      })
    )
    .pipe(
      dest(outputDir)
    );
});
