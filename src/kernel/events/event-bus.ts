import type { CmsEvent, CmsEventType, EventHandler } from './types.js';

/**
 * Synchronous event bus for internal CMS events.
 * Handlers are isolated - one failing handler doesn't affect others.
 */
export class EventBus {
  private handlers: Map<CmsEventType, Set<EventHandler>> = new Map();
  private globalHandlers: Set<EventHandler> = new Set();

  /**
   * Subscribe to a specific event type.
   * Returns an unsubscribe function.
   */
  on<T extends CmsEvent>(
    type: T['type'],
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);

    return () => {
      this.handlers.get(type)?.delete(handler as EventHandler);
    };
  }

  /**
   * Subscribe to all events.
   */
  onAll(handler: EventHandler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /**
   * Emit an event to all subscribed handlers.
   * Handlers are executed synchronously but isolated.
   */
  emit(event: CmsEvent): void {
    // Call type-specific handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        this.safeCall(handler, event);
      }
    }

    // Call global handlers
    for (const handler of this.globalHandlers) {
      this.safeCall(handler, event);
    }
  }

  /**
   * Emit an event and wait for all async handlers.
   */
  async emitAsync(event: CmsEvent): Promise<void> {
    const promises: Promise<void>[] = [];

    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        promises.push(this.safeCallAsync(handler, event));
      }
    }

    for (const handler of this.globalHandlers) {
      promises.push(this.safeCallAsync(handler, event));
    }

    await Promise.all(promises);
  }

  private safeCall(handler: EventHandler, event: CmsEvent): void {
    try {
      handler(event);
    } catch (error) {
      console.error(`Event handler error for ${event.type}:`, error);
    }
  }

  private async safeCallAsync(handler: EventHandler, event: CmsEvent): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Event handler error for ${event.type}:`, error);
    }
  }

  /**
   * Remove all handlers (useful for testing).
   */
  clear(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
  }
}

// Helper to create event with auto-generated id and timestamp
export function createEvent<T extends CmsEvent>(
  type: T['type'],
  principal: T['principal'],
  payload: T['payload']
): T {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    type,
    principal,
    payload,
  } as T;
}
