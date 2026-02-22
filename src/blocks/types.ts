/**
 * Block Type Schema Types
 *
 * These types describe the schema for block type definitions.
 * Each block type declares its content fields (rendered once per locale)
 * and optional repeatable element fields.
 */

import type { ComponentType } from 'react';

export type BlockFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'toggle'
  | 'radio'
  | 'select'
  | 'image'
  | 'icon';

export interface BlockField {
  name: string;
  type: BlockFieldType;
  label?: string;
  required?: boolean;
  /** For radio/select fields — list of options */
  options?: { label: string; value: string }[];
  /** Hint for image fields, e.g. "3800x1630" (display only) */
  size?: string;
}

export interface BlockTypeDefinition {
  /** Matches the `type` select value in the Blocks collection */
  type: string;
  /** Display name shown in the admin UI */
  label: string;
  /** lucide-react icon name (reserved for future block picker gallery) */
  icon?: string;
  /** Section-level fields — rendered once per block */
  content?: BlockField[];
  /** Repeatable sub-items stored as `_elements` array in the content JSON */
  elements?: {
    /** Singular label for one element row, e.g. "FAQ Item" */
    label: string;
    fields: BlockField[];
  };
}

/** Content schema portion of a block manifest (editor fields only) */
export interface BlockDefinition {
  /** Section-level fields rendered once per block */
  content?: BlockField[];
  /** Repeatable sub-items stored as `_elements` array in content JSON */
  elements?: {
    label: string;
    fields: BlockField[];
  };
}

export type BlockContent = Record<string, unknown>;
export type BlockComponent = ComponentType<{ content: BlockContent }>;

/**
 * A block manifest ties the canonical DB `type` key to both the admin editor
 * schema (definition) and the public-facing React component (component).
 * It is the single source of truth for a block type — adding a new block type
 * only requires creating a manifest and registering it.
 */
export interface BlockManifest {
  /** Canonical key stored as blocks.type in the database */
  type: string;
  /** Human-readable label shown in the admin UI */
  label: string;
  /** lucide-react icon name */
  icon?: string;
  /** Admin editor field schema */
  definition: BlockDefinition;
  /** React component used for public page rendering */
  component: BlockComponent;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

function coerceField(input: unknown): BlockField | null {
  if (!isRecord(input) || typeof input.name !== 'string' || typeof input.type !== 'string') {
    return null;
  }

  const allowedTypes: BlockFieldType[] = [
    'text',
    'textarea',
    'richtext',
    'number',
    'toggle',
    'radio',
    'select',
    'image',
    'icon',
  ];

  if (!allowedTypes.includes(input.type as BlockFieldType)) {
    return null;
  }

  const options = Array.isArray(input.options)
    ? input.options
        .filter((opt): opt is { label: string; value: string } =>
          isRecord(opt) && typeof opt.label === 'string' && typeof opt.value === 'string'
        )
    : undefined;

  return {
    name: input.name,
    type: input.type as BlockFieldType,
    label: typeof input.label === 'string' ? input.label : undefined,
    required: typeof input.required === 'boolean' ? input.required : undefined,
    options,
    size: typeof input.size === 'string' ? input.size : undefined,
  };
}

/**
 * Converts unknown JSON into a valid BlockTypeDefinition when possible.
 * Returns null if the payload does not match the expected definition shape.
 */
export function coerceBlockTypeDefinition(
  input: unknown,
  fallbackType?: string,
): BlockTypeDefinition | null {
  if (typeof input === 'string') {
    try {
      return coerceBlockTypeDefinition(JSON.parse(input), fallbackType);
    } catch {
      return null;
    }
  }

  if (!isRecord(input)) return null;

  const type = typeof input.type === 'string' ? input.type : (fallbackType ?? 'custom');

  const label = typeof input.label === 'string' ? input.label : 'Block';
  const icon = typeof input.icon === 'string' ? input.icon : undefined;

  const content = Array.isArray(input.content)
    ? input.content.map(coerceField).filter((f): f is BlockField => f !== null)
    : undefined;

  const elements = isRecord(input.elements) && typeof input.elements.label === 'string'
    ? {
        label: input.elements.label,
        fields: Array.isArray(input.elements.fields)
          ? input.elements.fields.map(coerceField).filter((f): f is BlockField => f !== null)
          : [],
      }
    : undefined;

  if (elements && elements.fields.length === 0) return null;

  return {
    type,
    label,
    icon,
    content,
    elements,
  };
}
