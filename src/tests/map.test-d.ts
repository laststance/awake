/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/map.d.ts" />
import { expectTypeOf } from 'vitest'

// No-arg constructor → Map<unknown, unknown>
const map = new Map()
expectTypeOf(map).toEqualTypeOf<Map<unknown, unknown>>()

// has() accepts widened types
const literalMap = new Map<'a' | 'b', number>([['a', 1], ['b', 2]])
const result: boolean = literalMap.has('c' as string)
