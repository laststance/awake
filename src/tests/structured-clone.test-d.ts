/// <reference path="../entrypoints/structured-clone.d.ts" />
import { expectTypeOf } from 'vitest'

const original = { name: 'Alice', scores: [1, 2, 3] }
const clone = structuredClone(original)
expectTypeOf(clone).toEqualTypeOf<{ name: string; scores: number[] }>()

// v2: Awake.Serializable is available as a utility type for manual constraint
// Note: can't constrain structuredClone() itself — lib.dom.d.ts's unconstrained
// overload always matches as fallback. Use Serializable in your own APIs:
type CloneableConfig = Awake.Serializable
const safeClone = <T extends CloneableConfig>(val: T) => structuredClone(val)

// @ts-expect-error — Function is not Serializable when using the typed wrapper
safeClone(() => {})

// @ts-expect-error — symbol is not Serializable when using the typed wrapper
safeClone(Symbol('x'))
