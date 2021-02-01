"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnEntity = exports.Kind = void 0;
const entityData_1 = require("./entityData");
Object.defineProperty(exports, "Kind", { enumerable: true, get: function () { return entityData_1.Kind; } });
const spawnEntity = (entity) => {
    return Object.assign({}, {
        name: undefined,
        parent: undefined,
        source: undefined,
        value: undefined,
    }, entity);
};
exports.spawnEntity = spawnEntity;
