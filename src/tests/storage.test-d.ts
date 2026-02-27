/// <reference path="../entrypoints/storage.d.ts" />
import { expectTypeOf } from 'vitest'

const val = localStorage['my_key']
expectTypeOf(val).toEqualTypeOf<unknown>()
