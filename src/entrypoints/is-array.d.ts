interface ArrayConstructor {
  /**
   * Standalone import for just the Array.isArray safety rule.
   */
  isArray(arg: unknown): arg is unknown[]
}
