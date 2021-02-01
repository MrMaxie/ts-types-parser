# TS Types Parser

Allows parse TypeScript types definitions into... something else.

<p align="center" width="100%">
    <img src="assets/logo-mini.png" alt="TS Types Parser" /><br/>
    Parser version <strong>2.0</strong> | TypeScript version <strong>4.1.3</strong><br/>
    <a href="#version-of-typescript">read why it's important information</a>
</p>

## Why?

🚧 **Documented and stable** - TypeScript at current version (4.1) isn't stable for AST traveling, this part of TS can change at any incoming version. This library provide you static and documented interface

📐 **Universal** - TS Types Parser allows you just read types from any correct file of TypeScript, also travel through imports, aliasing etc. to get that what you need and do it this whatever you need

🔍 **Focused** - AST traveling itself allows you to read tons of informations about current parsed code but this library expose mainly those types related

🔮 **Metaprogramming** - Thanks to that kind of libraries, you can prepare code using written earlier code, faster and without human factor bugs

## Using cases

Parsing TypeScript code to extract Types is thing which allows us - programmers - do awesome things in any needed case. Look at this functionality like on prolongation of DRY rule. At writting TypeScript code we thoroughly describe all used types/interfaces, but after transcompiling code into JavaScript we just loose those useful data. It's not that bad, but we should have possibility to use this informations at least at compiling time. Imagine such cases:

- Backend written in TypeScript will force you to write twice all of types from SQL databases, because you need to prepare SQL tables and the same types for TypeScript as well. Instead of that you can just only write TypeScript model and parsing script for SQL tables
  - [See example code](/examples/sql-from-types)

- Backend is written in other language, like PHP for example, and frontend is written in TypeScript. In such case you will need create all types twice - for backend and frontend at the same time. We can just write them once, for both of sides in TypeScript
  - [See example code](/examples/php-from-types)

- TypeScript application have to have runtime type checking for safer code, but writting tons of type checkings for same things isn't the best idea, even if we enclose them in functions like `isPhoneNumber()` it's need to be tested everywhere, why we just don't force our code to write self-testers?
  - [See example Code](/examples/ts-from-types)

## Version of TypeScript

Current version work with TypeScript 4.1. Static version of TypeScript allows us to preserve current standard of AST, sometimes it changes, we need to avoid it. Code will need some changes/tests after every patch of TypeScript, but if you don't use newest syntaxes from higher version that current version of this library then code will be parsed fine

## Installing

Simplest and recommended way is just use NPM like that:

```sh
npm install --save-exact ts-types-parser
```

## Usage

