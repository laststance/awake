/// <reference path="../utils.d.ts" />

interface ParentNode {
  /**
   * Returns the first element matching the CSS selector,
   * with its type inferred from the selector string.
   * @example
   * document.querySelector('div > span.foo') // HTMLSpanElement | null
   * document.querySelector('.my-class')      // Element | null
   * document.querySelector('input#email')    // HTMLInputElement | null
   */
  querySelector<S extends string>(
    selectors: S
  ): Awake.ResolveSelector<S> | null

  /**
   * Returns all elements matching the CSS selector,
   * with their type inferred from the selector string.
   * @example
   * document.querySelectorAll('li') // NodeListOf<HTMLLIElement>
   */
  querySelectorAll<S extends string>(
    selectors: S
  ): NodeListOf<Awake.ResolveSelector<S>>
}
