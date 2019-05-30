const ts = require('typescript');
const { createSourceFile, SyntaxKind: SK } = ts;
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

/**
 * Makes in-string padding
 */
const strPadding = (str, n, c) => {
    const val = str.valueOf();
    if ( Math.abs(+n) <= val.length )
        return val;
    const  m = Math.max((Math.abs(n) - str.length) || 0, 0);
    const pad = Array(m + 1).join(String(c || ' ').charAt(0));
    return (n < 0) ? pad + val : val + pad;
};

/**
 * Object.fromEntries ponyfill
 */
function fromEntries (iterable) {
    return [...iterable]
        .reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {})
}

module.exports = class Parser extends EventEmitter {
    constructor() {
        super();

        // Content of types
        this._types = new Map;

        this._expandTypes = [];
        this._mainType = 'Main';
        this._mainFlow = new Map;
        this._currentPath = [];

        this._result  = [];
        this._target  = '';
        this._sources = [];
        this._indent  = '    ';
        this._level   = 0;
        this._used    = false;
        this._unused  = [];

        this._pathProxy = x => x;
    }

    /**
     * Sets source file
     * @param {string|string[]} path
     */
    setSource(path) {
        if (typeof path === 'string') {
            path === [path];
        }

        path.filter(x => typeof x === 'string');

        if (path instanceof Array === false && path.length > 0) {
            throw new Error('Source files should be a string');
            return;
        }

        const test = path.map(x => fs.existsSync(x)).filter(x => !x);

        if (test.length) {
            throw new Error(`Source file must exists. Given ${path}`);
            return;
        }

        this._sources = path;
    }

    /**
     * Sets target file
     * @param {string} path
     */
    setTarget(path) {
        this._target = path;
    }

    /**
     * Allows change all paths
     * @param {(x: string) => string} cb
     */
    setPathProxy(cb) {
        this._pathProxy = cb;
    }

    /**
     * Sets target file delimiters
     * @param {string} start
     * @param {string} end
     */
    setDelimiters(start, end) {
        this._dStart = start;
        this._dEnd = end;
    }

    /**
     * Allow decide which ref types should be expanded
     * @param {string[]} arr
     */
    expandTypes(arr) {
        if (arr instanceof Array) {
            this._expandTypes = this._expandTypes.concat(arr);
        }
    }

    levelUp() {
        this._level += 1;
    }

    levelDown() {
        this._level -= 1;
    }

    setIndent(x) {
        this._indent = x;
    }

    /**
     * Main type will be start of expanding
     * @param {string} name
     */
    mainType(name) {
        this._mainType = name;
    }

    writeDescription(prefix = '//') {
        this._result.push(
            `${prefix}Automatically generated code by "ts-types-parser"`,
            `${prefix}Generated at ${(new Date).toUTCString()}`,
            `${prefix}Source files:`,
            this._sources.map(x => `${prefix}- ${path.basename(x)}`).join('\r\n'),
            '',
        );
    }

    log({ optional, path, type }) {
        const opt = optional ? '[optional]' : '';
        console.log(`${strPadding(String(path), 35)} # ${strPadding(String(type), 10)} ${opt}`);
    }

    /**
     * Sets as silent used
     */
    used() {
        this._used = true;
    }

    /**
     * Allows to write text into result
     * @param {string} txt
     */
    write(txt) {
        if (typeof txt === 'string') {
            this.used();
            this._result.push([
                Array(this._level).fill(this._indent).join(''),
                txt
            ].join(''));
        }
    }

    _send(type, optional) {
        const path = this._getCurrentPath();

        const data = {
            path: this._getCurrentPath(),
            type,
            optional,
        };

        this._used = false;
        this.emit('walk', data);
        this.emit(`type::${type}`, data);
        if (!this._used) {
            this.emit('unused', data);
        }
    }

    _getCurrentPath() {
        return this._pathProxy(this._currentPath.slice(0));
    }

    /**
     * Read each single node
     * @param {ts.Node} n
     */
    _readNode(n) {
        let name = n.name && n.name.escapedText ? n.name.escapedText : null;

        // Get type
        const optional = Boolean(n.questionToken);
        let type = fromEntries([
            [SK.TypeLiteral,      'object'],
            [SK.TypeReference,    'ref'],
            [SK.FalseKeyword,     'false'],
            [SK.TrueKeyword,      'true'],
            [SK.NullKeyword,      'null'],
            [SK.AnyKeyword,       'any'],
            [SK.BooleanKeyword,   'boolean'],
            [SK.NumberKeyword,    'number'],
            [SK.ObjectKeyword,    'object'],
            [SK.StringKeyword,    'string'],
            [SK.UndefinedKeyword, 'undefined'],
            [SK.BigIntKeyword,    'bigint'],
        ])[n.type.kind] || undefined;

        if (type === 'ref') {
            type = n.type.typeName.escapedText;
        }

        let levelData = {};
        if (name) {
            this._currentPath.push(name);
            levelData = {
                path: this._getCurrentPath(),
                name,
                type,
            };
            this.emit('level-up', levelData);
        }

        if (type) {
            this._send(type, optional);
        }

        // Expand type
        switch (n.type.kind) {
            case SK.IntersectionType:
                n.type.types.forEach(member => {
                    this._readNode({ type: member });
                });
                break;

            case SK.SourceFile:
                n.statements.forEach(member => {
                    this._readNode(member);
                });
                break;

            case SK.TypeLiteral:
                n.type.members.forEach(member => {
                    this._readNode(member);
                });
                break;

            case SK.TypeReference:
                const typeName = n.type.typeName.escapedText;

                if (typeName === 'Array') {
                    this._currentPath.push('*');
                    n.type.typeArguments.forEach(member => {
                        this._readNode({ type: member });
                    });
                    this._currentPath.pop();
                }

                if (this._types.has(typeName) && this._expandTypes.indexOf(typeName) >= 0) {
                    this._readType(this._types.get(typeName));
                }
                break;

            // Special
            case SK.UnionType:
                console.warn('# Found union type! Union types cannot be parsed because they aren\'t unambiguous. If you need to use that type try to alias it.');
                break;

            default:
                if (!type) {
                    console.warn('# Unknown type:', n);
                }
                break;

        }

        if (name) {
            this._currentPath.pop();
            this.emit('level-down', levelData);
        }
    }

    /**
     * Set any type or interface as type
     * @param {ts.Node} s
     */
    _readFileStatement(s) {
        switch (s.kind) {
            case SK.InterfaceDeclaration:
            case SK.TypeAliasDeclaration:
                console.log('# Found declaration of:', s.name.escapedText);
                this._types.set(s.name.escapedText, s);
                break;

            // Ignored statements
            case SK.ImportDeclaration:
            case SK.ExportDeclaration:
                break;

            default:
                console.warn('# Unknown statement:', s)
        }
    }

    /**
     * Reads interface and type into data
     * @param {ts.Node} n
     */
    _readType(n) {
        switch (n.kind) {
            case SK.InterfaceDeclaration:
                n.members.forEach(member => {
                    this._readNode(member);
                });

                (n.heritageClauses || []).forEach(h => {
                    (h.types || []).forEach(ht => {
                        if (!ht.expression || !ht.expression.escapedText) {
                            return;
                        }

                        const htName = ht.expression.escapedText;

                        if (!htName || !this._types.has(htName)) {
                            return;
                        }

                        this._readType(this._types.get(htName));
                    });
                });
                break;

            case SK.TypeAliasDeclaration:
                n.name = null;
                this._readNode(n)
                break;
        }
    }

    /**
     * Reads file statements
     * @param {ts.Node} n
     */
    _readFile(n) {
        const { _mainType } = this;

        n.statements.forEach(member => {
            this._readFileStatement(member);
        });

        if (this._types.has(_mainType)) {
            console.log('# Found main type:', _mainType);
            this._readType(this._types.get(_mainType));
        } else {
            console.warn('# Not found main type:', _mainType);
        }
    }

    run() {
        const { _sources, _target, _dStart, _dEnd } = this;

        if (typeof _target !== 'string' || !_target) {
            throw new Error('Target file path cannot be empty.');
        }

        if (_sources instanceof Array === false || !_sources.length) {
            throw new Error('Sources files paths cannot be empty.');
        }

        console.log(`Source: ${_sources}`);
        console.log(`Target: ${_target}`);

        // Parse typescript files
        const joinedSources = _sources.map(x => fs.readFileSync(x, 'utf8')).join('\r\n');
        const fileNode = ts.createSourceFile('', joinedSources);

        // Read node file
        this._readFile(fileNode);
        this.emit('done');

        let targetContent = fs.readFileSync(_target, 'utf8');

        this._result.unshift('', '');
        this._result.push('', '');

        let res = this._result.join('\r\n');

        if (_dStart && _dEnd) {
            const defIntend = new RegExp(`([\t ]*?)(?:${_dStart})`, 'im').exec(targetContent)[1] || '';

            res = targetContent.replace(
                new RegExp(`^([^]*?(?:${_dStart}))[^]*?((?:${_dEnd})[^]*?)$`, 'i'),
                `$1${res.replace(/(\r\n|\n)/gm, `$1${defIntend}`)}$2`
            );
        }

        fs.writeFile(_target, res, { flag: 'w' }, err => {
            if (err) throw err;
            console.log('Done~!')
        });
    }
}
