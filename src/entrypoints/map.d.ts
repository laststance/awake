/// <reference path="../utils.d.ts" />

interface MapConstructor {
  /**
   * No-arg Map() defaults to Map<unknown, unknown>.
   * @example
   * const map = new Map() // Map<unknown, unknown>
   */
  new <K = unknown, V = unknown>(): Map<K, V>
}

interface Map<K, V> {
  /**
   * has() accepts widened key types.
   * @example
   * new Map<'a' | 'b', number>().has('c') // no error
   */
  has(key: K | (Awake.WidenLiteral<K> & {})): boolean
}

interface ReadonlyMap<K, V> {
  has(key: K | (Awake.WidenLiteral<K> & {})): boolean
}
