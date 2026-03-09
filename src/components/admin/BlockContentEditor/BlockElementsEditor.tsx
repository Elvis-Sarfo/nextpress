'use client';

import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BlockField } from '@/core/blocks/types';
import { BlockFieldInput, getFieldLabel } from './BlockFieldInput';

interface BlockElementsEditorProps {
  elementLabel: string;
  fields: BlockField[];
  elements: Record<string, unknown>[];
  onChange: (elements: Record<string, unknown>[]) => void;
}

export function BlockElementsEditor({
  elementLabel,
  fields,
  elements,
  onChange,
}: BlockElementsEditorProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const addElement = () => {
    const newEl: Record<string, unknown> = {};
    for (const f of fields) {
      newEl[f.name] = f.type === 'toggle' ? false : '';
    }
    const next = [...elements, newEl];
    onChange(next);
    setExpanded((prev) => new Set([...prev, next.length - 1]));
  };

  const removeElement = (index: number) => {
    const next = elements.filter((_, i) => i !== index);
    onChange(next);
    setExpanded((prev) => {
      const s = new Set<number>();
      prev.forEach((i) => { if (i !== index) s.add(i > index ? i - 1 : i); });
      return s;
    });
  };

  const updateElement = (index: number, fieldName: string, value: unknown) => {
    const next = elements.map((el, i) =>
      i === index ? { ...el, [fieldName]: value } : el
    );
    onChange(next);
  };

  const toggleExpand = (index: number) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      s.has(index) ? s.delete(index) : s.add(index);
      return s;
    });
  };

  return (
    <div className="space-y-3">
      {elements.length === 0 && (
        <p className="text-sm text-muted-foreground py-2">
          No {elementLabel.toLowerCase()}s yet. Click &quot;Add&quot; to create one.
        </p>
      )}

      {elements.map((el, index) => {
        const isOpen = expanded.has(index);
        const previewField = fields[0];
        const previewVal = previewField ? String(el[previewField.name] || '') : '';

        return (
          <div key={index} className="rounded-md border bg-card overflow-hidden">
            {/* Item header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="flex items-center gap-2 text-sm font-medium flex-1 text-left"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span>{elementLabel} {index + 1}</span>
                {!isOpen && previewVal && (
                  <span className="text-muted-foreground font-normal truncate max-w-xs">
                    — {previewVal}
                  </span>
                )}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                onClick={() => removeElement(index)}
                title={`Remove ${elementLabel}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Item fields */}
            {isOpen && (
              <div className="px-4 py-4 space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium leading-none">
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
                      value={el[field.name]}
                      onChange={(val) => updateElement(index, field.name, val)}
                      id={`element-${index}-${field.name}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addElement}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {elementLabel}
      </Button>
    </div>
  );
}
