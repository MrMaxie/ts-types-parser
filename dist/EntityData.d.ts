export declare enum Kind {
    Any = "any",
    Void = "void",
    Boolean = "boolean",
    Number = "number",
    Bigint = "bigint",
    String = "string",
    Null = "null",
    Undefined = "undefined",
    Symbol = "symbol",
    Never = "never",
    Interface = "interface",
    Class = "class",
    Function = "function",
    Object = "object",
    Enum = "enum",
    Unknown = "unknown",
    Array = "array",
    Tuple = "tuple",
    Union = "union",
    Spread = "spread",
    LiteralBoolean = "literal-boolean",
    LiteralNumber = "literal-number",
    LiteralString = "literal-string",
    LiteralFunction = "literal-function",
    LiteralObject = "literal-object"
}
declare type KindValueMap = {
    [Kind.LiteralBoolean]: boolean;
    [Kind.LiteralNumber]: number;
    [Kind.LiteralString]: string;
};
export declare type KindValue<K extends Kind> = K extends keyof KindValueMap ? KindValueMap[K] : undefined;
export declare type Relation = 'union' | 'parameter' | 'generic' | 'property' | 'return' | 'dynamic-key' | 'spread';
export {};
