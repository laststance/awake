/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/array.d.ts" />
import { expectTypeOf } from 'vitest'

// filter(Boolean) removes falsy types
const mixed = [1, null, 'hello', undefined, false, 0] as (
  | number
  | string
  | null
  | undefined
  | false
)[]
const filtered = mixed.filter(Boolean)
expectTypeOf(filtered).toEqualTypeOf<(string | number)[]>()

// includes — widened literal acceptance on readonly arrays
const roles = ['admin', 'user'] as const
const check: boolean = roles.includes('editor' as string)

// Array.isArray — narrows to unknown[]
declare const val: unknown
if (Array.isArray(val)) {
  expectTypeOf(val).toEqualTypeOf<unknown[]>()
}
