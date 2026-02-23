import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: (args: { editor: Editor; range: { from: number; to: number } }) => void;
}

export const SlashCommandExtension = Extension.create<{
  suggestion: Partial<SuggestionOptions>;
}>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          (props as SlashCommandItem).command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
