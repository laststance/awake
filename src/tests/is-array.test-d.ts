/// <reference path="../entrypoints/is-array.d.ts" />
import { expectTypeOf } from 'vitest'

declare const val: unknown
if (Array.isArray(val)) {
  expectTypeOf(val).toEqualTypeOf<unknown[]>()
}
