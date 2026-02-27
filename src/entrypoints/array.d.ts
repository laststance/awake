/// <reference path="../utils.d.ts" />

interface Array<T> {
  /**
   * filter(Boolean) narrows out falsy types.
   * @example
   * [1, null, 'hi', undefined].filter(Boolean) // (number | string)[]
   */
  filter<S extends T>(
    predicate: BooleanConstructor,
    thisArg?: unknown
  ): Awake.NonFalsy<S>[]

  /**
   * includes() accepts widened literal types.
   * @example
   * (['admin', 'user'] as const).includes('editor') // no error
   */
  includes(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): boolean

  /**
   * indexOf() accepts widened literal types.
   */
  indexOf(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): number

  /**
   * lastIndexOf() accepts widened literal types.
   */
  lastIndexOf(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): number
}

interface ReadonlyArray<T> {
  filter<S extends T>(
    predicate: BooleanConstructor,
    thisArg?: unknown
  ): Awake.NonFalsy<S>[]

  includes(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): boolean

  indexOf(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): number

  lastIndexOf(
    searchElement: T | (Awake.WidenLiteral<T> & {}),
    fromIndex?: number
  ): number
}

interface ArrayConstructor {
  /**
   * Array.isArray narrows to unknown[] instead of any[].
   * @example
   * if (Array.isArray(value)) { value[0] } // unknown, not any
   */
  isArray(arg: unknown): arg is unknown[]
}
