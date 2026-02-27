# @laststance/awake

> TypeScript knows your types. Standard APIs should too.

A type-only TypeScript package that makes built-in JavaScript APIs **type-aware**. Domain types flow through `Object.keys`, `Array.filter`, `JSON.parse`, `querySelector`, and more — without any runtime cost.

## The Problem

```typescript
const user = { name: 'Alice', age: 30 }

// Default TypeScript
Object.keys(user)    // string[]           — type information lost
JSON.parse(text)     // any                — unsafe, anything goes
[1, null].filter(Boolean)  // (number | null)[]  — null not removed
document.querySelector('div > span.foo')   // Element | null  — generic

// With @laststance/awake
Object.keys(user)    // ('name' | 'age')[] — domain types preserved!
JSON.parse(text)     // unknown            — must validate first
[1, null].filter(Boolean)  // number[]     — falsy types removed!
document.querySelector('div > span.foo')   // HTMLSpanElement | null  — precise!
```

## Install

```bash
pnpm add -D @laststance/awake
# or
npm install -D @laststance/awake
```

## Activate

Choose one method:

### Option A: Triple-slash reference (recommended)

Create a `reset.d.ts` (or add to your existing `global.d.ts`):

```typescript
/// <reference types="@laststance/awake" />
```

### Option B: tsconfig `types` array

```json
{
  "compilerOptions": {
    "types": ["@laststance/awake"]
  }
}
```

### Option C: Selective rules

Only activate the rules you want:

```typescript
/// <reference types="@laststance/awake/object" />
/// <reference types="@laststance/awake/json" />
/// <reference types="@laststance/awake/dom" />
```

## Comparison with ts-reset

`@laststance/awake` is a **superset** of `@total-typescript/ts-reset`. You only need one package.

| Rule | ts-reset | awake |
|------|:--------:|:-----:|
| `Object.keys()` → `(keyof T)[]` | - | **Yes** |
| `Object.values()` → `T[keyof T][]` | - | **Yes** |
| `Object.entries()` → correlated `[K, T[K]]` pairs | - | **v2** |
| `Object.fromEntries()` → reconstructed type | - | **Yes** |
| `Object.freeze()` → deep readonly | - | **Yes** |
| `querySelector()` → inferred from CSS selector | - | **v2** |
| `querySelectorAll()` → inferred from CSS selector | - | **v2** |
| `CustomEvent` typed addEventListener | - | **v2** |
| `TypedFormData<T>` utility | - | **v2** |
| `TypedURLSearchParams<T>` utility | - | **v2** |
| `Serializable` type for structuredClone | - | **v2** |
| `JSON.parse()` → `unknown` | Yes | Yes |
| `Response.json()` → `unknown` | Yes | Yes |
| `Promise.catch` → `unknown` error | Yes | Yes |
| `Array.filter(Boolean)` → narrows falsy | Yes | Yes |
| `Array.includes()` → widened literals | Yes | Yes |
| `Array.indexOf/lastIndexOf()` → widened | Yes | Yes |
| `Array.isArray()` → `unknown[]` | Yes | Yes |
| `Set.has()` → widened literals | Yes | Yes |
| `Map.has()` → widened literals | Yes | Yes |
| `new Map()` → `Map<unknown, unknown>` | Yes | Yes |
| `localStorage/sessionStorage` → `unknown` | Yes | Yes |
| `structuredClone()` → type preserved | - | Yes |

## All Rules

### Object (flagship)

```typescript
const config = { debug: true, port: 3000, host: 'localhost' }

Object.keys(config)     // ('debug' | 'port' | 'host')[]
Object.values(config)   // (boolean | number | string)[]

// v2: entries returns correlated key-value pairs
Object.entries(config)
// (['debug', boolean] | ['port', number] | ['host', string])[]

// fromEntries reconstructs the type
const entries = [['a', 1], ['b', 2]] as ['a' | 'b', number][]
Object.fromEntries(entries) // { a: number; b: number }

// freeze is deep readonly
const frozen = Object.freeze({ db: { host: 'localhost' } })
frozen.db.host = 'x' // Type error! (standard TS allows this)
```

### DOM (v2)

```typescript
// querySelector infers element type from CSS selector
document.querySelector('div')              // HTMLDivElement | null
document.querySelector('div > span.foo')   // HTMLSpanElement | null
document.querySelector('input#email')      // HTMLInputElement | null
document.querySelector('div, span')        // HTMLDivElement | HTMLSpanElement | null
document.querySelector('svg > path')       // SVGPathElement | null

// querySelectorAll works too
document.querySelectorAll('li.item')       // NodeListOf<HTMLLIElement>
```

### CustomEvent (v2)

Register custom events for type-safe `addEventListener`:

```typescript
// In your project's global.d.ts:
interface AwakeEventMap {
  'user:login': { userId: string; timestamp: number }
  'cart:update': { items: string[]; total: number }
}

// Then in your code:
target.addEventListener('user:login', (e) => {
  e.detail.userId    // string — fully typed!
  e.detail.timestamp // number
})

// Standard DOM events are unaffected
document.addEventListener('click', (e) => { /* standard event — unaffected */ })
```

### JSON

```typescript
const data = JSON.parse('{"name":"Alice"}') // unknown
// Must narrow before use:
if (typeof data === 'object' && data !== null && 'name' in data) {
  data.name // OK
}
```

### Array

```typescript
// filter(Boolean) removes falsy types
const items = [1, null, 'hello', undefined, 0, false]
items.filter(Boolean) // (number | string)[]

// includes/indexOf accept widened literals
const roles = ['admin', 'user'] as const
roles.includes('editor') // No type error — any string accepted

// isArray narrows to unknown[], not any[]
if (Array.isArray(value)) {
  value // unknown[] — must narrow elements
}
```

### Promise

```typescript
fetch('/api').catch((err) => {
  err // unknown — must check before use
  if (err instanceof Error) {
    err.message // OK
  }
})
```

### Fetch

```typescript
const res = await fetch('/api/user')
const data = await res.json() // unknown — validate with Zod, etc.
```

### Map / Set

```typescript
// Empty Map defaults to Map<unknown, unknown>
const map = new Map() // Map<unknown, unknown>

// has() accepts widened types
const roles = new Set<'admin' | 'user'>(['admin', 'user'])
roles.has(inputRole) // No error even if inputRole is string
```

### Storage

```typescript
const token = localStorage['auth_token'] // unknown — must validate
if (typeof token === 'string') {
  token.trim() // OK
}
```

### structuredClone

```typescript
const clone = structuredClone({ name: 'Alice', scores: [1, 2, 3] })
// { name: string; scores: number[] } — type preserved, not widened to any
```

### Utility Types (v2)

These live in the `Awake` namespace — use via casting:

```typescript
// TypedFormData: schema-aware FormData
const fd = new FormData() as Awake.TypedFormData<{ username: string; avatar: File }>
fd.get('username')  // string | null
fd.get('avatar')    // File | null
// fd.get('unknown') // Type error!

// TypedURLSearchParams: schema-aware URLSearchParams
const params = new URLSearchParams() as Awake.TypedURLSearchParams<{ page: string; sort: string }>
params.get('page')  // string | null
// params.get('foo') // Type error!

// Serializable: constraint for structuredClone-safe values
// Catches Function, Symbol, WeakMap, WeakSet, Promise at compile time
const safeClone = <T extends Awake.Serializable>(val: T) => structuredClone(val)
safeClone({ x: 1 })    // OK
// safeClone(() => {})  // Type error: Function not Serializable
```

## Available Entrypoints

| Import | Rules |
|--------|-------|
| `@laststance/awake` | All recommended rules (default) |
| `@laststance/awake/all` | Everything including experimental |
| `@laststance/awake/object` | Object.keys/values/entries/fromEntries/freeze |
| `@laststance/awake/array` | filter(Boolean), includes, indexOf, isArray |
| `@laststance/awake/json` | JSON.parse → unknown |
| `@laststance/awake/promise` | catch/then → unknown error |
| `@laststance/awake/fetch` | Response.json() → unknown |
| `@laststance/awake/map` | Map constructor + has widening |
| `@laststance/awake/set` | Set.has widening |
| `@laststance/awake/storage` | localStorage/sessionStorage → unknown |
| `@laststance/awake/dom` | querySelector/querySelectorAll CSS selector types |
| `@laststance/awake/is-array` | Standalone Array.isArray → unknown[] |
| `@laststance/awake/structured-clone` | structuredClone type preservation |
| `@laststance/awake/custom-event` | Typed CustomEvent addEventListener |
| `@laststance/awake/form` | TypedFormData + TypedURLSearchParams utilities |

## TypeScript Compatibility

Requires **TypeScript >= 5.0.0**.

## A Note on Soundness

TypeScript intentionally returns `string[]` from `Object.keys()` because of structural subtyping — an object can have more keys at runtime than its type declares. `@laststance/awake` trades theoretical soundness for practical type propagation. If you work with `as const` objects or well-defined interfaces, this trade-off is almost always worth it.

For projects that prefer strict soundness, import only the safety rules:

```typescript
/// <reference types="@laststance/awake/json" />
/// <reference types="@laststance/awake/promise" />
/// <reference types="@laststance/awake/fetch" />
```

## License

MIT
