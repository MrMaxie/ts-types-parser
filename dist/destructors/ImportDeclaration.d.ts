import { Entity, Kind } from '../Entity';
import { Destructor, Node } from '../Destructor';
export declare class ImportDeclaration extends Destructor {
    run(parent: Entity | false, node: Node): {
        child: false;
        entity: Entity<Kind.Any>;
    };
}
