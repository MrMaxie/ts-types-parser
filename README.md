# TS Types Parser
Parse TypeScript types definitions into... something else.

## Using cases

Parsing TS types allows you automatically for example:

- Prepare SQL code to generate tables according to TS models
- Writing dynamic API in other languages and preparing other languages to work with data send by or for such TS script
- Writing validation for models in any language (for example in TS itself)

## Installing

* Use NPM like that:

```bash
npm i -g ts-types-parser
```

* ...or just clone repo.

## Usage

### CLI

* If you installed as global module:

```bash
ts-types-parser rules.js
```

* If clonned repo:

```bash
node cli.js rules.js
```

* Example `rules-file.js` file for CLI usage

```javascript

module.exports = p => {
    // Parser as p
    // ...and rules here :)
};

```

### Module

* If you installed as local module:

```javascript
const Parser = require('ts-types-parser');
const parser = new Parser;

// Your rules here

parser.run();
```

## Rules - Parser class

### Methods

#### `setSource(path: string | string[])`

Allows to setup new single or multiple sources files. That files should be valid **TypeScript** files, all of them will be joined into single long string.

*Remember: You have to add all needed files to sources with types because exports aren't resolved.*

---

#### `setTarget(path: string)`

Allows to setup file which will contain result. Whole file will be replaced if no delimiters are set.

---

#### `setDelimiters(start: string, end: string)`

Allows to setup delimiters for target file between which content will be replaced.

*Remember: Those delimiters are used inside regular expression so you have to escape all special charaters.*

---

#### `mainType(name: string)`

Given name will be used as "entry point" at parsing. For example: if your tree of types begins from `interface Main` or `type Main` you should call `p.mainType('Main')`. There can exists only single "main" type, if you need more recurslivy parsing then using multiple instances of Parser class will be solution.

---

#### `expandTypes(arr: string[])`

Given here types will be resolved at occurring. For example:

```javascript
// some.d.ts
type Point {
    x: number;
    y: number;
};

interface Main {
    one: Point;
    two: Point;
};
```

Without any expanding will iterate trough:

```
one # Point
two # Point
```

With `p.expandTypes(['Point'])` will iterate trough:

```
one   # Point
one   # object
one,x # number
one,y # number
two   # Point
two   # object
two,x # number
two,y # number
```

---

#### `setPathProxy(cb: (path: string[]) => any)`

Allows modify all paths before any call. For example:

```javascript
p.setPathProxy(x => x.filter(x => !/\d+$/.test(x)).join('#'));
```

---

#### `setIndent(indent: string)`

Allows to set custom indent (default is 4 spaces). This indent will be used at leveling your result.

---

#### `levelUp()`

#### `levelDown()`

Level up or down current indent.

---

#### `writeDescription(prefix: string = '// ')`

Write description block into result in current place. Example:

```javascript
// Automatically generated code by "ts-types-parser"
// Generated at Thu, 30 May 2019 22:07:35 GMT
// Source files:
// - types1.d.ts
// - types2.d.ts
```

---

#### `log({ optional: boolean, path: string, type: string })`

Uses same object such will be send to parser and log given data in such way:

```javascript
// test.d.ts
type Point {
    x?: number;
    y: number;
};

interface Main {
    one?: Point;
    two: Point;
};

// Result
one                                 # Point      [optional]
one                                 # object
one,x                               # number     [optional]
one,y                               # number
two                                 # Point
two                                 # object
two,x                               # number     [optional]
two,y                               # number
```

---

#### `used()`

Set current path as used. See event `unused` for more informations.

---

#### `write(txt: string)`

Push new line into result, also marks current path as used.

---

#### `run()`

Runs parser ...and occasionally yells with errors.

### Events

`type Entry = { path: string[] | any, type: string, optional: boolean };`

All paths in events are result of method which can be set using `p.setPathProxy(cb)`. Default paths are array of strings.

#### `walk -> Entry`

Just walk through all paths.

---

#### `type::<SOME_TYPE> -> Entry`

Will be emitted only when selected type occurs.

---

#### `unused -> Entry`

Will be emitted when none of callbacks didn't call `p.write()` or `p.used()`.

---

#### `level-up -> Entry`
#### `level-down -> Entry`

Fired when level of path has been level upped, it's something else than `p.levelUp()` and `p.levelDown()`. Useful when you need to close whole subtree in some scope. For Example:

```javascript
p.on('level-up', ({ path }) => {
    if (type === 'Array') {
        p.write('Array(10).fill(0).forEach((_, i) => {');
        p.levelUp();
    }
});

p.on('level-down', ({ path }) => {
    if (type === 'Array') {
        p.levelDown();
        p.write('});');
    }
});
```

will close Array content inside `.forEach`.

#### `done -> void`

Parsing done, but you still can write something at end of result.

## TODO

- [ ] Ironically I should rewrite this script in TypeScript
- [ ] Probably not all cases are parsed, for exmaple `union` types
- [ ] Script needs tests
- [ ] Script needs also more examples

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE.md) file for details