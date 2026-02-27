interface Body {
  /**
   * Parses response body as JSON, returning unknown instead of any.
   * @example
   * const data = await res.json() // unknown
   */
  json(): Promise<unknown>
}
