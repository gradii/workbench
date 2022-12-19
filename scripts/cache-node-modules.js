#!/usr/bin/env node


/**
 * Script that builds the dev-app as a static web package that will be
 * deployed to the currently configured Firebase project.
 */

const { join }       = require('path');
const fs             = require('fs');
const { execSync }   = require('child_process');
const { createHash } = require('crypto');

/** Path to the project directory. */
const projectDirPath = join(__dirname, '../');

// Go to project directory.
process.chdir(projectDirPath);


const PROJECT_NAME = 'workbench';

const yarnLockContent = fs.readFileSync('yarn.lock');
const yarnLockHash    = createHash('sha1').update(yarnLockContent).digest('hex');
const buildTarDir     = `${process.env.HOME}/.cache/node-modules-tar/${PROJECT_NAME}`;
const outputTgz       = `${buildTarDir}/${PROJECT_NAME}_${yarnLockHash}.tgz`;

console.log(`outputTgz: ${outputTgz}`);

//build devops
async function buildCache() {

  const fileMap = [
    {
      key   : `${PROJECT_NAME}-node-modules`,
      cwd   : './',
      source: ['node_modules'],
      output: outputTgz
    }
  ];

  fs.rmdirSync(buildTarDir, { recursive: true, force: true });
  fs.mkdirSync(buildTarDir, { recursive: true });

  for (const val of fileMap) {
    process.chdir(val.cwd);
    execSync(`tar czf ${val.output} ${val.source.join(' ')}`, { stdio: 'inherit' });

    console.log(`${val.key} .. tarball has been created ..`);
  }
}

async function extractCache() {
  execSync(`tar zxf ${outputTgz}`, { stdio: 'inherit' });
  console.log(`${outputTgz} .. success ..`);
}

function checkCacheExist() {
  return fs.existsSync(outputTgz);
}

function runYarnInstall() {
  execSync(`yarn install`, { stdio: 'inherit' });
}

try {
  if (fs.existsSync('node_modules/@angular/core')) {
    console.log('node_modules exist. exit...');
    return;
  }
  if (checkCacheExist()) {
    console.log('found cached node_modules. extract...');
    extractCache().then();
  } else {
    console.log('cache not exist. build first...');
    runYarnInstall();
    console.log('compress node_modules...');
    buildCache().then();
  }

} catch (e) {
  process.exit(-1);
}
