'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JsonCodeEditorProps {
  id: string;
  value: unknown;
  onChange: (next: unknown) => void;
  rows?: number;
}

function serialize(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function JsonCodeEditor({ id, value, onChange, rows = 18 }: JsonCodeEditorProps) {
  const [text, setText] = useState(() => serialize(value));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(serialize(value));
    setError(null);
  }, [value]);

  const lineCount = useMemo(() => Math.max(1, text.split('\n').length), [text]);

  const handleChange = (next: string) => {
    setText(next);

    if (!next.trim()) {
      setError(null);
      onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(next);
      setError(null);
      onChange(parsed);
    } catch {
      // Keep the last valid value in formData — don't propagate an unparseable string
      setError('Invalid JSON');
    }
  };

  const handleFormat = () => {
    if (!text.trim()) {
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setText(formatted);
      setError(null);
      onChange(parsed);
    } catch {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn('text-xs', error ? 'text-red-600' : 'text-muted-foreground')}>
          {error ? error : 'JSON'}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={handleFormat}>
          Format
        </Button>
      </div>

      <div className="rounded-md border border-input overflow-hidden">
        <div className="flex bg-background">
          <div
            aria-hidden="true"
            className="select-none text-right text-xs text-muted-foreground border-r bg-muted/40 px-2 py-2"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-6 h-6">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            aria-label="JSON code editor"
            id={id}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            rows={rows}
            spellCheck={false}
            className="w-full bg-background px-3 py-2 text-sm font-mono leading-6 focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
