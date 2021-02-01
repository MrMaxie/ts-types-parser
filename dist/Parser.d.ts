import { Entity } from './Entity';
export declare class Parser {
    /**
     * First file of parsed tree
     */
    readonly entryFile: string;
    /**
     * Root of tree
     */
    root: Entity;
    constructor(
    /**
     * First file of parsed tree
     */
    entryFile: string);
    /**
     * Runs parsing
     */
    run(): void;
}
