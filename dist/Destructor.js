"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destructors = void 0;
const Entity_1 = require("./Entity");
exports.destructors = new Map();
exports.destructors.set('ImportDeclaration', node => {
    console.log(node);
    return Entity_1.spawnEntity({
        kind: Entity_1.Kind.Any,
        child: [],
    });
});
