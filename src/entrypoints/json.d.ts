interface JSON {
  /**
   * Parses a JSON string, returning unknown instead of any.
   * Forces consumers to validate shape before use.
   * @example
   * const data = JSON.parse(text) // unknown
   */
  parse(
    text: string,
    reviver?: (this: unknown, key: string, value: unknown) => unknown
  ): unknown
}
