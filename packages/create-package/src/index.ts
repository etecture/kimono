#!/usr/bin/env node

if (process.env.NODE_ENV === 'development') console.log('create-package');

import runGenerator from '@kimono/generator-package/lib/run';

runGenerator();
