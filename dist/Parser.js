"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const typescript_1 = require("typescript");
class Parser {
    constructor(
    /**
     * First file of parsed tree
     */
    entryFile) {
        this.entryFile = entryFile;
    }
    /**
     * Runs parsing
     */
    run() {
        const program = typescript_1.createProgram({
            rootNames: [this.entryFile],
            options: {},
        });
        const file = program.getSourceFile(this.entryFile);
        console.log(Object.keys(file));
    }
}
exports.Parser = Parser;
