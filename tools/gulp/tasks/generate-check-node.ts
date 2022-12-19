import {dest, series, src, task} from 'gulp';

const gulpTap = require('gulp-tap');
import * as fse from 'fs-extra';

import ts = require('typescript');
import * as Vinyl from 'vinyl';

import * as fs from "fs";
import {factory, forEachChild, visitEachChild} from "typescript";


task('generate-check-node', () => {
  // console.log('convert ast from typescript');

  return src('tools/typescript-srcs/**/factory/nodeTests.ts', {
    base: 'tools'
  }).pipe(
    gulpTap((file) => {
      console.log(file.path)

      const sourceFile = ts.createSourceFile(file.path, (file.contents as Buffer).toString('utf8'),
        ts.ScriptTarget.ESNext, false, ts.ScriptKind.TSX
      );

      // console.log(sourceFile)
      const successNodes: any[] = [];
      const failureNodes: any[] = [];

      ts.transform(sourceFile, [
        (context) => {
          const expressionVisitor = (node) => {
            if (ts.isBinaryExpression(node)) {
              if (
                ts.isToken(node.operatorToken) &&
                node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken) {

              }
            }
          }

          const visitor = (node) => {
            if (ts.isSourceFile(node)) {
              return ts.visitEachChild(node, (child) => visitor(child), context)
            } else if (ts.isModuleDeclaration(node)) {
              if (node.body && ts.isModuleBlock(node.body)) {
                forEachChild(node.body, (child) => {
                  if (child) {
                    if (ts.isFunctionDeclaration(child)) {
                      const functionName = child.name && ts.isIdentifier(child.name) ? child.name.text : ''
                      successNodes.push(functionName);

                    } else {
                      failureNodes.push(child);
                    }
                  }

                  // return child;
                })
              }
            } else {
              return ts.visitEachChild(node, (child) => visitor(child), context)
            }
          }
          return (node) => ts.visitNode(node, visitor)
        }
      ])

      // console.log(successNodes);

      fse.outputFileSync('dist/convert-ast-from-typescript/check-node.json', JSON.stringify({
        checkNodes: successNodes,
        clazzes: successNodes.map(it => it.replace(/^is/g, ''))
      }, undefined, '  '))


    })
  ).pipe(
    dest('dist/generate-check-node')
  )

});
