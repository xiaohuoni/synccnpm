#!/usr/bin/env node

const { join } = require('path')
const { sync } = require('@umijs/utils/compiled/cross-spawn')
const chalk = require('@umijs/utils/compiled/chalk').default
const { winPath } = require("@umijs/utils");
const scriptPathAsStr = JSON.stringify(join(__dirname, `../syncCnpm.ts`))
const tsx = winPath(join(__dirname, '../node_modules/.bin/tsx'));

const spawn = sync(
  tsx,
  [scriptPathAsStr],
  {
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  }
)
if (spawn.status !== 0) {
  console.log(chalk.red(`sync cnpm execute fail`))
  process.exit(1)
}