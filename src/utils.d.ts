/**
 * Awake shared utility types.
 * All entrypoints reference this via /// <reference path="../utils.d.ts" />
 */
declare namespace Awake {
  // ─── v1 types ────────────────────────────────────────────────────────────

  /**
   * Widens a literal type to its base primitive.
   * @example WidenLiteral<'foo'> → string
   * @example WidenLiteral<42> → number
   */
  type WidenLiteral<T> =
    T extends string ? string
    : T extends number ? number
    : T extends boolean ? boolean
    : T extends bigint ? bigint
    : T extends symbol ? symbol
    : T

  /**
   * Removes all falsy types from a union.
   * @example NonFalsy<string | null | undefined> → string
   */
  type NonFalsy<T> = T extends false | 0 | 0n | '' | null | undefined
    ? never
    : T

  /**
   * Recursively makes all properties readonly.
   * @example DeepReadonly<{ a: { b: number } }> → { readonly a: { readonly b: number } }
   */
  type DeepReadonly<T> =
    T extends (infer U)[]
      ? ReadonlyArray<DeepReadonly<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T

  // ─── v2: Precise Object.entries ──────────────────────────────────────────

  /**
   * Produces a union of correlated [key, value] tuple types from an object.
   * Each member pairs exactly one key with its own value type.
   * @example Entries<{ name: string; age: number }> → ['name', string] | ['age', number]
   */
  type Entries<T extends object> = {
    [K in keyof T]-?: [K & string, T[K]]
  }[keyof T]

  // ─── v2: DOM Selector types ──────────────────────────────────────────────

  /**
   * Maps a bare HTML tag name to its DOM element interface.
   * Falls back to Element for custom elements or unrecognized tags.
   * @example TagToElement<'div'> → HTMLDivElement
   * @example TagToElement<'custom-el'> → Element
   */
  type TagToElement<Tag extends string> =
    Tag extends keyof HTMLElementTagNameMap
      ? HTMLElementTagNameMap[Tag]
      : Tag extends keyof SVGElementTagNameMap
        ? SVGElementTagNameMap[Tag]
        : Element

  /**
   * Strips class, id, attribute, and pseudo suffixes from a CSS token.
   * Returns the bare tag name, or empty string if no tag prefix.
   * @example StripSuffix<'input.large'> → 'input'
   * @example StripSuffix<'.my-class'> → ''
   */
  type StripSuffix<S extends string> =
    S extends `${infer Tag}.${string}` ? StripSuffix<Tag>
    : S extends `${infer Tag}#${string}` ? StripSuffix<Tag>
    : S extends `${infer Tag}[${string}` ? StripSuffix<Tag>
    : S extends `${infer Tag}:${string}` ? StripSuffix<Tag>
    : S

  /**
   * Extracts the last combinator-separated token from a selector.
   * Handles descendant ( ), child (>), adjacent (+), sibling (~).
   * @example LastToken<'div > span.foo'> → 'span.foo'
   * @example LastToken<'main article p'> → 'p'
   */
  type LastToken<S extends string> =
    S extends `${string} > ${infer After}` ? LastToken<After>
    : S extends `${string} + ${infer After}` ? LastToken<After>
    : S extends `${string} ~ ${infer After}` ? LastToken<After>
    : S extends `${string} ${infer After}` ? LastToken<After>
    : S

  /**
   * Trims leading and trailing spaces from a string type.
   * @example Trim<' span '> → 'span'
   */
  type Trim<S extends string> =
    S extends ` ${infer R}` ? Trim<R>
    : S extends `${infer L} ` ? Trim<L>
    : S

  /**
   * Resolves a single (non-comma) CSS selector to its element type.
   * @example ResolveSingle<'div > span.foo'> → HTMLSpanElement
   */
  type ResolveSingle<S extends string> = TagToElement<StripSuffix<LastToken<S>>>

  /**
   * Resolves a (potentially comma-separated) CSS selector to a union of element types.
   * @example ResolveSelector<'div, span'> → HTMLDivElement | HTMLSpanElement
   * @example ResolveSelector<'main > p.intro'> → HTMLParagraphElement
   */
  type ResolveSelector<S extends string> =
    S extends `${infer A},${infer B}`
      ? ResolveSingle<Trim<A>> | ResolveSelector<Trim<B>>
      : ResolveSingle<Trim<S>>

  // ─── v2: Serializable ────────────────────────────────────────────────────

  /**
   * Values that can be safely passed to structuredClone().
   * Excludes Function, Symbol, WeakMap, WeakSet, Promise (DataCloneError at runtime).
   * @example
   * structuredClone({ a: 1 })   // OK
   * structuredClone(() => {})   // TS error: Function not assignable to Serializable
   */
  type Serializable =
    | string
    | number
    | boolean
    | null
    | undefined
    | bigint
    | Date
    | RegExp
    | Error
    | Blob
    | File
    | ArrayBuffer
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array
    | DataView
    | SerializableArray
    | SerializableObject
    | SerializableMap
    | SerializableSet

  /** @internal Enables recursive Array<Serializable> without circular alias error */
  interface SerializableArray extends Array<Serializable> {}
  /** @internal Enables recursive { [key: string]: Serializable } */
  interface SerializableObject extends Record<string, Serializable> {}
  /** @internal Enables recursive Map<Serializable, Serializable> */
  interface SerializableMap extends Map<Serializable, Serializable> {}
  /** @internal Enables recursive Set<Serializable> */
  interface SerializableSet extends Set<Serializable> {}

  // ─── v2: TypedFormData / TypedURLSearchParams ────────────────────────────

  /**
   * A FormData subtype with typed get/set/has/append based on schema T.
   * Cast a FormData instance to this type for schema-aware type checking.
   * @example
   * const fd = new FormData() as Awake.TypedFormData<{ name: string; avatar: File }>
   * fd.get('name')    // string | null
   * fd.get('avatar')  // File | null
   */
  interface TypedFormData<T extends Record<string, string | File>> {
    get<K extends keyof T & string>(name: K): T[K] | null
    set<K extends keyof T & string>(name: K, value: T[K]): void
    set<K extends keyof T & string>(name: K, value: Blob, filename?: string): void
    has<K extends string>(name: K): K extends keyof T ? true : boolean
    append<K extends keyof T & string>(name: K, value: T[K]): void
    append<K extends keyof T & string>(name: K, value: Blob, filename?: string): void
    delete<K extends keyof T & string>(name: K): void
    getAll<K extends keyof T & string>(name: K): T[K][]
  }

  /**
   * A URLSearchParams subtype with typed get/set/has based on schema T.
   * Cast a URLSearchParams instance to this type for schema-aware type checking.
   * @example
   * const p = new URLSearchParams() as Awake.TypedURLSearchParams<{ page: string }>
   * p.get('page')   // string | null
   */
  interface TypedURLSearchParams<T extends Record<string, string>> extends URLSearchParams {
    get<K extends keyof T & string>(name: K): string | null
    set<K extends keyof T & string>(name: K, value: string): void
    has<K extends string>(name: K): K extends keyof T ? true : boolean
    append<K extends keyof T & string>(name: K, value: string): void
    delete<K extends keyof T & string>(name: K): void
    getAll<K extends keyof T & string>(name: K): string[]
  }
}
