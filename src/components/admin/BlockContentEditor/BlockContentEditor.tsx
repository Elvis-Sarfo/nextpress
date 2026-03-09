'use client';

import { coerceBlockTypeDefinition, type BlockTypeDefinition } from '@/core/blocks/types';
import { BlockFieldInput, getFieldLabel } from './BlockFieldInput';
import { BlockElementsEditor } from './BlockElementsEditor';

interface BlockContentEditorProps {
  /** The locale-specific content object: { heading: "...", _elements: [...] } */
  content: Record<string, unknown>;
  /** Optional runtime definition loaded from DB `blocks.contentDefinition` */
  definition?: unknown;
  onChange: (newContent: Record<string, unknown>) => void;
  locale: string;
}

export function BlockContentEditor({
  content,
  definition,
  onChange,
}: BlockContentEditorProps) {
  const def: BlockTypeDefinition | null = coerceBlockTypeDefinition(definition);

  if (!def) {
    // Graceful fallback to raw JSON for unregistered types
    return (
      //   <textarea
      //     value={
      //       typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content)
      //     }
      //     onChange={(e) => {
      //       try {
      //         onChange(JSON.parse(e.target.value) as Record<string, unknown>);
      //       } catch {
      //         // keep invalid JSON as-is while user types
      //       }
      //     }}
      //     rows={8}
      //     className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      //     aria-label="Block content (JSON)"
      //   />
      // );
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">No definition found for block type</h4>
        <p className="text-sm text-muted-foreground">{typeof definition === 'string' ? definition : JSON.stringify(definition)}</p>
      </div>
    );
  }

  const updateField = (fieldName: string, value: unknown) => {
    onChange({ ...content, [fieldName]: value });
  };

  const elements = (content['_elements'] as Record<string, unknown>[] | undefined) ?? [];

  const updateElements = (newElements: Record<string, unknown>[]) => {
    onChange({ ...content, _elements: newElements });
  };

  const hasContentFields = def.content && def.content.length > 0;
  const hasElements = !!def.elements;

  return (
    <div className="space-y-6">
      {/* Section-level content fields */}
      {hasContentFields && (
        <div className="space-y-4">
          {def.content!.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={`block-content-${field.name}`}
                className="text-sm font-medium leading-none"
              >
                {getFieldLabel(field)}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.size && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    ({field.size})
                  </span>
                )}
              </label>
              <BlockFieldInput
                field={field}
                value={content[field.name]}
                onChange={(val) => updateField(field.name, val)}
                id={`block-content-${field.name}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Repeatable elements */}
      {hasElements && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{def.elements!.label}s</h4>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {elements.length}
            </span>
          </div>
          <BlockElementsEditor
            elementLabel={def.elements!.label}
            fields={def.elements!.fields}
            elements={elements}
            onChange={updateElements}
          />
        </div>
      )}

      {!hasContentFields && !hasElements && (
        <p className="text-sm text-muted-foreground">
          This block type has no configurable fields.
        </p>
      )}
    </div>
  );
}
