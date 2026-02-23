'use client';

import { useState, useEffect } from 'react';
import { NotionEditor } from './editors/NotionEditor';
import { SimpleEditor } from './editors/SimpleEditor';

export interface RichtextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const STORAGE_KEY = 'nextpress-editor-mode';
type EditorMode = 'notion' | 'simple';

export function RichtextEditor({ value, onChange, placeholder }: RichtextEditorProps) {
  const [mode, setMode] = useState<EditorMode>('simple');

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as EditorMode | null;
    if (saved === 'simple' || saved === 'notion') setMode(saved);
  }, []);

  const switchMode = (next: EditorMode) => {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-md bg-muted w-fit">
        <button
          type="button"
          onClick={() => switchMode('simple')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === 'simple'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Simple Editor
        </button>
        <button
          type="button"
          onClick={() => switchMode('notion')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === 'notion'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Notion Style
        </button>
      </div>

      {/* Editor */}
      {mode === 'notion' ? (
        <NotionEditor value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <SimpleEditor value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </div>
  );
}
