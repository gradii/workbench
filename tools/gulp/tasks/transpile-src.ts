import { dest, series, src, task } from 'gulp';

import * as fs from 'fs';
import { checkTypescriptNode, commonImportTransform } from '@devops-tools/reiki-ast';

const gulpTap = require('gulp-tap');

import ts = require('typescript');

const gulpFile = require('gulp-file');
const gulpClean = require('gulp-clean');

task('clean:dist', () => src('dist', { read: false, allowEmpty: true }).pipe(gulpClean(null)));

task('transpile-src', series(
  'clean:dist',
  async () => {
    src('apps/ide-betty/**/test-source/**/*{.js,.jsx,.ts,.tsx}')
      .pipe(
        gulpTap((file: any) => {
          console.log(file.path);

          const sourceFile = ts.createSourceFile(
            file.path,
            fs.readFileSync(file.path, { encoding: 'utf8' }),
            ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX
          );

          let transformationResult = ts.transform(sourceFile, [
            commonImportTransform(),

            checkTypescriptNode()
          ]);

          const transformedSourceFile = transformationResult.transformed[0];
          const printer = ts.createPrinter();

          const result = printer.printNode(
            ts.EmitHint.Unspecified,
            transformedSourceFile,
            transformedSourceFile
          );

          file.contents = Buffer.from(result);

        })
      )
      .pipe(
        dest('dist')
      );
  })
);
