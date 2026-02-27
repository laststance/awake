interface Storage {
  /**
   * Dynamic bracket access returns unknown instead of string | null.
   * @example
   * const token = localStorage['auth_token'] // unknown
   */
  [name: string & {}]: unknown
}
