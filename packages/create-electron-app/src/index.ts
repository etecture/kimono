#!/usr/bin/env node

if (process.env.NODE_ENV === 'development') console.log('create-electron-app');

import runGenerator from '@kimono/generator-electron-app/lib/run';

runGenerator();
