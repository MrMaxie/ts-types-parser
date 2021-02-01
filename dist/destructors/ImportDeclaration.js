"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportDeclaration = void 0;
const Entity_1 = require("../Entity");
const Destructor_1 = require("../Destructor");
class ImportDeclaration extends Destructor_1.Destructor {
    run(parent, node) {
        return {
            child: false,
            entity: new Entity_1.Entity(Entity_1.Kind.Any, parent, undefined, undefined, [], false),
        };
    }
}
exports.ImportDeclaration = ImportDeclaration;
