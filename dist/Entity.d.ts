import { Relation, Kind } from './entityData';
export { Kind, Relation };
declare type Child = {
    relation: Relation;
    entity: Entity;
};
declare type Source = {
    file: string;
    line: number;
    column: number;
};
export declare type Entity = {
    name?: string;
    kind: Kind;
    parent?: Entity;
    child: Child[];
    source?: Source;
    value?: undefined;
} & ({} | {
    kind: Kind.LiteralBoolean;
    value: boolean;
} | {
    kind: Kind.LiteralNumber;
    value: number;
} | {
    kind: Kind.LiteralString;
    value: string;
});
export declare const spawnEntity: (entity: Entity) => Entity;
