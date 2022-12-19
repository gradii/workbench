import { task } from 'gulp';
import * as fs from "fs";
import * as fse from "fs-extra";
import Axios from "axios";
import globby = require("globby");

const gulpTap = require('gulp-tap');
const gulpFile = require('gulp-file');

task('import-torrent', async () => {
  const files = await globby(['**/ide-betty/**/bundle.*.js', '!**/*.formatted.js'])

  console.log(files);

  if (files.length > 0) {
    const bundleFile = files[0];
    const content: string = await fs.promises.readFile(bundleFile, { encoding: "utf8" });

    const regex = /\.bundle\."\+\{((?:\d+:"[a-z0-9]+",?)+)\}\[e\]\+"\.js"/img;

    const rst = regex.exec(content);

    if (rst && rst[1]) {
      const files = rst[1].split(',').map(it => {
        return it.replace(/(\d+):"([a-f0-9]+)"/ig, '$1.bundle.$2.js')
      })

      const baseDomain = 'https://ide-nl3.betty.services/'
      console.log(files);

      for (let it of files) {
        const url = baseDomain + it;
        const content = await Axios.get(url, {
          responseType: "text"
        }).then(res => res.data);
        await fse.outputFile(`apps/ide-betty/srcs/${it}`, content);

        let sourceMapContent = await Axios.get(url + '.map', {
          responseType: "text"
        }).then(res => res.data);
        if(typeof sourceMapContent === 'object') {
          await fse.outputFile(`apps/ide-betty/srcs/${it}.map`, JSON.stringify(sourceMapContent));
        }else {
          await fse.outputFile(`apps/ide-betty/srcs/${it}.map`, sourceMapContent);
        }
      }
    }

  }

  // src(['**/ide-betty/**/bundle.*.js', '!**/*.formatted.js']).pipe(
  //   gulpTap((file: any) => {
  //     console.log(file.path)
  //
  //
  //   }),
  // )
});
