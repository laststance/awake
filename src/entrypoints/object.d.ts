/// <reference path="../utils.d.ts" />

interface ObjectConstructor {
  /**
   * Returns enumerable own property names with preserved key types.
   * awake: returns (keyof T & string)[] instead of string[].
   * @example
   * const user = { name: 'Alice', age: 30 }
   * Object.keys(user) // ('name' | 'age')[]
   */
  keys<T extends object>(o: T): (keyof T & string)[]

  /**
   * Returns enumerable own property values with preserved types.
   * @example
   * const user = { name: 'Alice', age: 30 }
   * Object.values(user) // (string | number)[]
   */
  values<T extends object>(o: T): T[keyof T][]

  /**
   * Returns enumerable own [key, value] pairs with precisely correlated types.
   * Each tuple pairs exactly one key with its own value type.
   * @example
   * const user = { name: 'Alice', age: 30 }
   * Object.entries(user) // (['name', string] | ['age', number])[]
   */
  entries<T extends object>(o: T): Awake.Entries<T>[]

  /**
   * Creates an object from key-value pairs with preserved types.
   * @example
   * Object.fromEntries([['a', 1], ['b', 2]] as ['a' | 'b', number][])
   * // { a: number; b: number }
   */
  fromEntries<K extends PropertyKey, V>(
    entries: Iterable<readonly [K, V]>
  ): { [P in K]: V }

  /**
   * Freezes an object with deep readonly type.
   * @example
   * const cfg = Object.freeze({ db: { host: 'localhost' } })
   * cfg.db.host = 'x' // TS error
   */
  freeze<T extends object>(o: T): Awake.DeepReadonly<T>
}
