const { Parser } = require('./dist/Parser');
const { reverseKindId } = require('./dist/Helpers');

const parser = new Parser('./src/Entity.ts');
parser.run();