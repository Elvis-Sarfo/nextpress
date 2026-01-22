/**
 * Core types for the CMS kernel.
 *
 * Branded IDs prevent mixing up different ID types at compile time.
 * Result<T,E> provides explicit error handling without exceptions.
 */

// ============================================================================
// BRANDED ID TYPES
// ============================================================================

declare const __brand: unique symbol;
type Brand<T, B> = T & { [__brand]: B };

// Content IDs
export type PageId = Brand<string, 'PageId'>;
export type PostId = Brand<string, 'PostId'>;
export type NewsId = Brand<string, 'NewsId'>;
export type DocumentId = Brand<string, 'DocumentId'>; // Links draft/published versions

// Navigation & Utility IDs
export type MenuId = Brand<string, 'MenuId'>;
export type MenuItemId = Brand<string, 'MenuItemId'>;
export type LinkCollectionId = Brand<string, 'LinkCollectionId'>;
export type LinkId = Brand<string, 'LinkId'>;
export type CommentId = Brand<string, 'CommentId'>;

// System IDs
export type PrincipalId = Brand<string, 'PrincipalId'>;
export type RoleId = Brand<string, 'RoleId'>;
export type Locale = Brand<string, 'Locale'>;

export type ContentEntryId = Brand<string, 'ContentEntryId'>;
export type ContentVersionId = Brand<string, 'ContentVersionId'>;
export type ContentTypeId = Brand<string, 'ContentTypeId'>;

// Factory functions to create branded IDs
export const PageId = (id: string): PageId => id as PageId;
export const PostId = (id: string): PostId => id as PostId;
export const NewsId = (id: string): NewsId => id as NewsId;
export const DocumentId = (id: string): DocumentId => id as DocumentId;
export const MenuId = (id: string): MenuId => id as MenuId;
export const MenuItemId = (id: string): MenuItemId => id as MenuItemId;
export const LinkCollectionId = (id: string): LinkCollectionId => id as LinkCollectionId;
export const LinkId = (id: string): LinkId => id as LinkId;
export const CommentId = (id: string): CommentId => id as CommentId;
export const PrincipalId = (id: string): PrincipalId => id as PrincipalId;
export const RoleId = (id: string): RoleId => id as RoleId;
export const Locale = (code: string): Locale => code as Locale;

// Legacy factory functions (deprecated)
/** @deprecated Use PageId or PostId instead */
export const ContentEntryId = (id: string): ContentEntryId => id as ContentEntryId;
/** @deprecated Use dedicated version types */
export const ContentVersionId = (id: string): ContentVersionId => id as ContentVersionId;
/** @deprecated Content types are now explicit models */
export const ContentTypeId = (id: string): ContentTypeId => id as ContentTypeId;

// ============================================================================
// RESULT TYPE
// ============================================================================

export type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => result.ok;
export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => !result.ok;

// Unwrap with default
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T =>
  result.ok ? result.value : defaultValue;

// Map over success value
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  result.ok ? Ok(fn(result.value)) : result;

// ============================================================================
// DOMAIN ERROR
// ============================================================================

export type DomainErrorCode =
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'INVALID_STATE'
  | 'VALIDATION_FAILED'
  | 'PERMISSION_DENIED'
  | 'LOCKED'
  | 'CONFLICT'
  | 'INVALID_TRANSITION';

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DomainError';
  }

  // Factory methods
  static notFound(resource: string, id?: string): DomainError {
    return new DomainError(
      'NOT_FOUND',
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      { resource, id }
    );
  }

  static alreadyExists(resource: string, identifier: string): DomainError {
    return new DomainError(
      'ALREADY_EXISTS',
      `${resource} '${identifier}' already exists`,
      { resource, identifier }
    );
  }

  static invalidState(message: string, details?: Record<string, unknown>): DomainError {
    return new DomainError('INVALID_STATE', message, details);
  }

  static validationFailed(message: string, errors?: ValidationError[]): DomainError {
    return new DomainError('VALIDATION_FAILED', message, { errors });
  }

  static permissionDenied(action: string, resource: string): DomainError {
    return new DomainError(
      'PERMISSION_DENIED',
      `Permission denied: cannot ${action} on ${resource}`,
      { action, resource }
    );
  }

  static locked(resource: string, lockedBy: string): DomainError {
    return new DomainError(
      'LOCKED',
      `${resource} is locked by ${lockedBy}`,
      { resource, lockedBy }
    );
  }

  static conflict(message: string, details?: Record<string, unknown>): DomainError {
    return new DomainError('CONFLICT', message, details);
  }

  static invalidTransition(from: string, to: string, reason?: string): DomainError {
    return new DomainError(
      'INVALID_TRANSITION',
      reason || `Cannot transition from ${from} to ${to}`,
      { from, to }
    );
  }
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}
