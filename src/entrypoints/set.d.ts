/// <reference path="../utils.d.ts" />

interface Set<T> {
  /**
   * has() accepts widened value types.
   * @example
   * new Set<'admin' | 'user'>().has('editor') // no error
   */
  has(value: T | (Awake.WidenLiteral<T> & {})): boolean
}

interface ReadonlySet<T> {
  has(value: T | (Awake.WidenLiteral<T> & {})): boolean
}
