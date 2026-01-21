import type { ContentEntryId, ContentVersionId, ContentTypeId, PrincipalId, Locale } from '../core/types.js';

// ============================================================================
// EVENT TYPES
// ============================================================================

export type CmsEventType =
  | 'CONTENT_CREATED'
  | 'CONTENT_UPDATED'
  | 'CONTENT_PUBLISHED'
  | 'CONTENT_UNPUBLISHED'
  | 'CONTENT_SCHEDULED'
  | 'CONTENT_DELETED'
  | 'CONTENT_LOCKED'
  | 'CONTENT_UNLOCKED'
  | 'SCHEMA_CREATED'
  | 'SCHEMA_UPDATED'
  | 'SCHEMA_DELETED';

interface BaseEvent {
  id: string;
  timestamp: Date;
  principal: PrincipalId;
}

export interface ContentCreatedEvent extends BaseEvent {
  type: 'CONTENT_CREATED';
  payload: {
    entryId: ContentEntryId;
    versionId: ContentVersionId;
    typeId: ContentTypeId;
  };
}

export interface ContentUpdatedEvent extends BaseEvent {
  type: 'CONTENT_UPDATED';
  payload: {
    entryId: ContentEntryId;
    versionId: ContentVersionId;
    typeId: ContentTypeId;
  };
}

export interface ContentPublishedEvent extends BaseEvent {
  type: 'CONTENT_PUBLISHED';
  payload: {
    entryId: ContentEntryId;
    versionId: ContentVersionId;
    typeId: ContentTypeId;
    locale: Locale;
    slug: string;
    previousVersionId?: ContentVersionId;
  };
}

export interface ContentUnpublishedEvent extends BaseEvent {
  type: 'CONTENT_UNPUBLISHED';
  payload: {
    entryId: ContentEntryId;
    versionId: ContentVersionId;
    typeId: ContentTypeId;
  };
}

export interface ContentScheduledEvent extends BaseEvent {
  type: 'CONTENT_SCHEDULED';
  payload: {
    entryId: ContentEntryId;
    versionId: ContentVersionId;
    typeId: ContentTypeId;
    scheduledAt: Date;
  };
}

export interface ContentDeletedEvent extends BaseEvent {
  type: 'CONTENT_DELETED';
  payload: {
    entryId: ContentEntryId;
    typeId: ContentTypeId;
  };
}

export interface ContentLockedEvent extends BaseEvent {
  type: 'CONTENT_LOCKED';
  payload: {
    entryId: ContentEntryId;
    lockedBy: PrincipalId;
    expiresAt: Date;
  };
}

export interface ContentUnlockedEvent extends BaseEvent {
  type: 'CONTENT_UNLOCKED';
  payload: {
    entryId: ContentEntryId;
  };
}

export interface SchemaCreatedEvent extends BaseEvent {
  type: 'SCHEMA_CREATED';
  payload: {
    typeId: ContentTypeId;
    name: string;
  };
}

export interface SchemaUpdatedEvent extends BaseEvent {
  type: 'SCHEMA_UPDATED';
  payload: {
    typeId: ContentTypeId;
    name: string;
    version: number;
  };
}

export interface SchemaDeletedEvent extends BaseEvent {
  type: 'SCHEMA_DELETED';
  payload: {
    typeId: ContentTypeId;
    name: string;
  };
}

export type CmsEvent =
  | ContentCreatedEvent
  | ContentUpdatedEvent
  | ContentPublishedEvent
  | ContentUnpublishedEvent
  | ContentScheduledEvent
  | ContentDeletedEvent
  | ContentLockedEvent
  | ContentUnlockedEvent
  | SchemaCreatedEvent
  | SchemaUpdatedEvent
  | SchemaDeletedEvent;

// Event handler type
export type EventHandler<T extends CmsEvent = CmsEvent> = (event: T) => void | Promise<void>;
