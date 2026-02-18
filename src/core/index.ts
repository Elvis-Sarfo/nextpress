// Core types and utilities
/**
 * NextPress Core Module
 * 
 * Central export point for all core CMS functionality including:
 * - Core types (branded IDs, Result type, errors)
 * - Collections (configuration, registry, field types)
 * - Events (event bus for CMS events)
 * - Content types (pages, posts, news)
 * - Navigation (menus, links)
 * - Comments
 * - Permissions (RBAC engine)
 * - Workflow
 */
export * from './core';

// Collections (Payload CMS-style)
export * from './collection';

// Events
export * from './events';

// Content types
export * from './page';
export * from './post';
export * from './news';

// Navigation
export * from './navigation';

// Comments
export * from './comments';

// Permissions
export * from './permissions';

// Workflow
export * from './workflow';

// Legacy exports - access via sub-paths
// export { TextField, RichTextField, etc. } from './content-schema/types'
// export * from './content'
