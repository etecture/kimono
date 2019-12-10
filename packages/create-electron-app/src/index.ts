#!/usr/bin/env node

process.env.DEBUG = `yeoman:generator${(process.env.DEBUG && ` ${process.env.DEBUG || ''}`) || ''}`;

if (process.env.NODE_ENV === 'development') console.log('[@kimono/create-electron-app]');

import runGenerator from '@kimono/generator-electron-app/lib/run';

async function run() {
  try {
    await runGenerator();
  } catch (error) {
    console.error('[@kimono/create-electron-app] failed', error);
  }
}

run();
