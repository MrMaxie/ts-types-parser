"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("./Entity");
const entities = [];
const t1 = new Entity_1.Entity(Entity_1.Kind.Any, false, 'test', undefined, [], false);
const t2 = new Entity_1.Entity(Entity_1.Kind.Void, false, 'test', undefined, [], false);
const t3 = new Entity_1.Entity(Entity_1.Kind.LiteralBoolean, false, 'test', undefined, [], false);
entities.push(t1, t2, t3);
const somet = entities.pop();
if (somet.kind === Entity_1.Kind.Void) {
    const r = somet.value;
}
if (somet.is(Entity_1.Kind.Void)) {
    const r = somet.value;
}
switch (somet.kind) {
    case Entity_1.Kind.Any:
        const r1 = somet.value;
    case 'literal-string':
        const r2 = somet.value;
}
