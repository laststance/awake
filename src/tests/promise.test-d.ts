/// <reference path="../entrypoints/promise.d.ts" />
import { expectTypeOf } from 'vitest'

const p = Promise.resolve(42)

p.catch((err) => {
  expectTypeOf(err).toEqualTypeOf<unknown>()
})

p.then(
  (val) => val,
  (err) => {
    expectTypeOf(err).toEqualTypeOf<unknown>()
  }
)
