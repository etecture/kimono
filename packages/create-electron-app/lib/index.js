#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV === 'development')
    console.log('create-electron-app');
const run_1 = __importDefault(require("@kimono/generator-electron-app/lib/run"));
run_1.default();
//# sourceMappingURL=index.js.map