/// <reference path="../utils.d.ts" />
/// <reference path="../entrypoints/dom.d.ts" />
import { expectTypeOf } from 'vitest'

// Bare tag → correct element
expectTypeOf(document.querySelector('div')).toEqualTypeOf<HTMLDivElement | null>()
expectTypeOf(document.querySelector('span')).toEqualTypeOf<HTMLSpanElement | null>()
expectTypeOf(document.querySelector('input')).toEqualTypeOf<HTMLInputElement | null>()

// Descendant combinator → last tag wins
expectTypeOf(document.querySelector('main article p')).toEqualTypeOf<HTMLParagraphElement | null>()

// Child combinator with class suffix
expectTypeOf(document.querySelector('div > span.foo')).toEqualTypeOf<HTMLSpanElement | null>()

// Class-only selector → Element (no tag to infer)
expectTypeOf(document.querySelector('.my-class')).toEqualTypeOf<Element | null>()

// ID-only selector → Element
expectTypeOf(document.querySelector('#main')).toEqualTypeOf<Element | null>()

// Tag with class suffix
expectTypeOf(document.querySelector('input.large')).toEqualTypeOf<HTMLInputElement | null>()

// Tag with ID suffix
expectTypeOf(document.querySelector('div#app')).toEqualTypeOf<HTMLDivElement | null>()

// Comma-separated → union
expectTypeOf(document.querySelector('div, span')).toEqualTypeOf<HTMLDivElement | HTMLSpanElement | null>()

// Adjacent sibling combinator
expectTypeOf(document.querySelector('h1 + p')).toEqualTypeOf<HTMLParagraphElement | null>()

// General sibling combinator
expectTypeOf(document.querySelector('h2 ~ ul')).toEqualTypeOf<HTMLUListElement | null>()

// querySelectorAll
expectTypeOf(document.querySelectorAll('li')).toEqualTypeOf<NodeListOf<HTMLLIElement>>()
expectTypeOf(document.querySelectorAll('div, span')).toEqualTypeOf<NodeListOf<HTMLDivElement | HTMLSpanElement>>()

// Attribute selector on tag
expectTypeOf(document.querySelector('input[type="text"]')).toEqualTypeOf<HTMLInputElement | null>()

// Unknown/custom element → Element
expectTypeOf(document.querySelector('custom-element')).toEqualTypeOf<Element | null>()
