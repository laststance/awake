/**
 * Deep-clones a value, preserving its exact type instead of widening to `any`.
 * Note: TypeScript cannot constrain global function parameters when lib.dom.d.ts
 * declares an unconstrained overload. Use Awake.Serializable manually for stricter checks.
 * @example
 * structuredClone({ name: 'Alice' })  // { name: string } — type preserved
 * @see Awake.Serializable for compile-time validation of cloneable values
 */
declare function structuredClone<T>(
  value: T,
  options?: StructuredSerializeOptions
): T
