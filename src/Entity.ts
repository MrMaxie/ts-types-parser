import { Relation, Kind } from './entityData';
export { Kind, Relation };

type Child = {
    relation: Relation;
    entity: Entity;
};

type Source = {
    file: string;
    line: number;
    column: number;
};

export type Entity = {
    name?: string;
    kind: Kind;
    parent?: Entity;
    child: Child[];
    source?: Source;
    value?: undefined;
} & ({
    //
} | {
    kind: Kind.LiteralBoolean;
    value: boolean;
} | {
    kind: Kind.LiteralNumber;
    value: number;
} | {
    kind: Kind.LiteralString;
    value: string;
});

export const spawnEntity = (entity: Entity): Entity => {
    return Object.assign({}, {
        name: undefined,
        parent: undefined,
        source: undefined,
        value: undefined,
    }, entity);
};
