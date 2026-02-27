/// <reference path="../utils.d.ts" />

/**
 * User-extensible event type registry for strongly-typed custom events.
 * Augment this interface in your project to register custom events:
 * @example
 * // In your project's types/events.d.ts:
 * interface AwakeEventMap {
 *   'user:login': { userId: string; timestamp: number }
 * }
 *
 * // Then in your code:
 * target.addEventListener('user:login', (e) => {
 *   e.detail.userId  // string — fully typed!
 * })
 */
interface AwakeEventMap {}

interface EventTarget {
  /**
   * Adds a strongly-typed listener for events registered in AwakeEventMap.
   * For unregistered event names, falls back to default EventTarget behavior.
   */
  addEventListener<K extends keyof AwakeEventMap>(
    type: K,
    listener: (this: EventTarget, ev: CustomEvent<AwakeEventMap[K]>) => void,
    options?: boolean | AddEventListenerOptions
  ): void

  /**
   * Removes a strongly-typed listener for events registered in AwakeEventMap.
   */
  removeEventListener<K extends keyof AwakeEventMap>(
    type: K,
    listener: (this: EventTarget, ev: CustomEvent<AwakeEventMap[K]>) => void,
    options?: boolean | EventListenerOptions
  ): void
}
