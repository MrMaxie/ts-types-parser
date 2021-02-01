import { createProgram } from 'typescript';
import { Entity } from './Entity';
import { destructors } from './destructors';

export class Parser {
    /**
     * Root of tree
     */
    root: Entity;

    constructor(
        /**
         * First file of parsed tree
         */
        public readonly entryFile: string,
    ) {}

    /**
     * Runs parsing
     */
    run() {
        const program = createProgram({
            rootNames: [this.entryFile],
            options: {},
        });
        const file = program.getSourceFile(this.entryFile);
        console.log(Object.keys(file));
    }
}
