#!/usr/bin/env node
const fs     = require('fs');
const path   = require('path');
const Parser = require('./src/Parser');
const argv   = process.argv.slice(2);

const error = x => console.error('\x1b[31m%s\x1b[0m', x);

let isHelp    = false;
let isVerbose = false;

argv.forEach(x => {
    x = x.toLowerCase();

    if (['-h', '--help'].indexOf(x) !== -1)
        isHelp = true;

    if (['-v', '--verbose'].indexOf(x) !== -1)
        isVerbose = true;
});

if (isHelp) {
    console.log('Usage:')
    console.log('  ts-type-parser RULES-FILE.js [-v|--verbose] [-h|--help]')
    return;
}

let file = argv.filter(x => !/^\-/.test(x)).slice(0, 1)[0];

if (file)
    file = path.join(process.cwd(), file);

if (!fs.existsSync(file)) {
    error(`Given file ( ${file} ) does not exists`);
    return;
}

if (isVerbose) {
    // Make it loud~!
    process.on('uncaughtException', err => {
        console.error(`${(new Date).toUTCString()} uncaughtException:`)
        console.error(err.message);
        console.error(err.stack);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    });
}

const js = require(file);

if (js instanceof file === false) {
    error(`Given file ( ${file} ) does not exports function`);
    return;
}

const parser = new Parser();
js(parser);
parser.run();