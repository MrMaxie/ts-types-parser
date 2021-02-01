import { Node } from 'typescript';
import { Entity, Kind, spawnEntity } from './Entity';
import { realKindName } from './helpers';
export { Node };

type Destructor = (node: Node) => Entity;

export const destructors = new Map<keyof realKindName, Destructor>();

destructors.set('ImportDeclaration', node => {
    console.log(node);

    return spawnEntity({
        kind: Kind.Any,
        child: [],
    });
});