/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/custom-event.d.ts" />
import { expectTypeOf } from 'vitest'

// Augment the global AwakeEventMap for testing
// Must use `declare global` because `import` makes this a module
declare global {
  interface AwakeEventMap {
    'user:login': { userId: string; timestamp: number }
    'cart:update': { items: string[]; total: number }
  }
}

const target = new EventTarget()

// addEventListener receives properly typed CustomEvent
target.addEventListener('user:login', (e) => {
  expectTypeOf(e.detail.userId).toEqualTypeOf<string>()
  expectTypeOf(e.detail.timestamp).toEqualTypeOf<number>()
})

target.addEventListener('cart:update', (e) => {
  expectTypeOf(e.detail.items).toEqualTypeOf<string[]>()
  expectTypeOf(e.detail.total).toEqualTypeOf<number>()
})

// Standard DOM events still work (no regression)
// Note: modern DOM spec types 'click' as PointerEvent, not MouseEvent
document.addEventListener('click', (e) => {
  expectTypeOf(e).toEqualTypeOf<PointerEvent>()
})
