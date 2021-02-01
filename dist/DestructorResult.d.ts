import { Node } from 'typescript';
import { Entity } from './Entity';
export declare class DestructorResult {
    constructor(
    /**
     * Determine if result can contain more data and contains
     * deeper nodes
     */
    child: Node | false, 
    /**
     * Result entity, can be only one because it must to be known
     * where place childs
     */
    entities: Entity);
}
