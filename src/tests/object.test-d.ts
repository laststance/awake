/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/object.d.ts" />
import { expectTypeOf } from 'vitest'

// Object.keys — propagates literal keys
const user = { name: 'Alice', age: 30 }
expectTypeOf(Object.keys(user)).toEqualTypeOf<('name' | 'age')[]>()

// Object.values — propagates value types
expectTypeOf(Object.values(user)).toEqualTypeOf<(string | number)[]>()

// v2: precise correlation — each key paired with its own value type
expectTypeOf(Object.entries(user)).toEqualTypeOf<
  (['name', string] | ['age', number])[]
>()

// Object.fromEntries — reconstructs type from entries
const entries = [['a', 1], ['b', 2]] as ['a' | 'b', number][]
const reconstructed = Object.fromEntries(entries)
expectTypeOf(reconstructed).toEqualTypeOf<{ a: number; b: number }>()

// Object.freeze — returns DeepReadonly
const config = Object.freeze({ db: { host: 'localhost', port: 5432 } })
expectTypeOf(config).toEqualTypeOf<{
  readonly db: { readonly host: string; readonly port: number }
}>()
