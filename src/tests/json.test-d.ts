/// <reference path="../entrypoints/json.d.ts" />
import { expectTypeOf } from 'vitest'

const parsed = JSON.parse('{"name":"Alice"}')
expectTypeOf(parsed).toEqualTypeOf<unknown>()
