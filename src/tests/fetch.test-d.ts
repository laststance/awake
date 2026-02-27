/// <reference path="../entrypoints/fetch.d.ts" />
import { expectTypeOf } from 'vitest'

declare const response: Response
response.json().then((data) => {
  expectTypeOf(data).toEqualTypeOf<unknown>()
})
