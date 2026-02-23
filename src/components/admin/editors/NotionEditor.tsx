'use client';

import {
  useEffect,
  useCallback,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { SlashCommandExtension, type SlashCommandItem } from './SlashCommandExtension';
import type { Editor, Range } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code2,
  Minus,
  ImageIcon,
  Type,
} from 'lucide-react';

// ── Slash command items ─────────────────────────────────────────────────────

const SLASH_ITEMS: SlashCommandItem[] = [
  {
    title: 'Text',
    description: 'Plain paragraph',
    icon: 'T',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Unordered list',
    icon: '•',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered list',
    icon: '1.',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Task List',
    description: 'Checklist of to-do items',
    icon: '☑',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Blockquote',
    description: 'Capture a quote',
    icon: '"',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code Block',
    description: 'Code with syntax highlighting',
    icon: '<>',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Visual horizontal rule',
    icon: '—',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Image',
    description: 'Insert an image by URL',
    icon: '🖼',
    command: ({ editor, range }) => {
      const url = window.prompt('Image URL');
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      }
    },
  },
];

// ── Slash command menu component ────────────────────────────────────────────

interface SlashMenuProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        const item = items[selectedIndex];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  useEffect(() => setSelectedIndex(0), [items]);

  if (items.length === 0) return null;

  return (
    <div className="z-50 w-72 rounded-lg border bg-background shadow-lg overflow-hidden">
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
        BLOCKS
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              command(item);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              index === selectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded bg-muted text-xs font-bold shrink-0 font-mono">
              {item.icon}
            </span>
            <div>
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
SlashMenu.displayName = 'SlashMenu';

// ── Suggestion renderer ──────────────────────────────────────────────────────

function createSuggestionRenderer() {
  let component: ReactRenderer<SlashMenuRef> | null = null;
  let popup: TippyInstance[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect?: (() => DOMRect | null) | null; command: (item: SlashCommandItem) => void; items: SlashCommandItem[] }) => {
      component = new ReactRenderer(SlashMenu, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate(props: { clientRect?: (() => DOMRect | null) | null; items: SlashCommandItem[] }) {
      component?.updateProps(props);
      if (!props.clientRect || !popup?.[0]) return;
      popup[0].setProps({ getReferenceClientRect: props.clientRect as () => DOMRect });
    },
    onKeyDown(props: { event: KeyboardEvent }) {
      if (props.event.key === 'Escape') {
        popup?.[0]?.hide();
        return true;
      }
      return component?.ref?.onKeyDown(props) ?? false;
    },
    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
      component = null;
      popup = null;
    },
  };
}

// ── Bubble menu toolbar button ───────────────────────────────────────────────

function BubbleButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function BubbleDivider() {
  return <div className="w-px h-4 bg-border mx-0.5" />;
}

// ── NotionEditor ─────────────────────────────────────────────────────────────

interface NotionEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function NotionEditor({
  value,
  onChange,
  placeholder = "Type '/' for commands…",
}: NotionEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const rendererRef = useRef(createSuggestionRenderer());

  // Recreate renderer ref so it's stable across renders
  useEffect(() => {
    rendererRef.current = createSuggestionRenderer();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-md my-2' } }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…';
          return placeholder;
        },
        includeChildren: true,
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      SlashCommandExtension.configure({
        suggestion: {
          items: ({ query }: { query: string }) => {
            const q = query.toLowerCase();
            return SLASH_ITEMS.filter(
              (item) =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q)
            );
          },
          render: () => rendererRef.current,
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (linkUrl === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-input bg-background">
      {/* Bubble menu — appears on text selection */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100, placement: 'top' }}
        shouldShow={({ editor: e, view, state, from, to }) => {
          // Don't show for images
          if (e.isActive('image')) return false;
          return from !== to;
        }}
      >
        <div className="flex items-center gap-0.5 bg-background border rounded-lg shadow-xl px-1.5 py-1">
          {/* Block type quick-select */}
          <BubbleButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
            title="Text"
          >
            <Type className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          {/* Inline marks */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          {/* Alignment */}
          <BubbleButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          {/* Lists */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive('taskList')}
            title="Task List"
          >
            <ListTodo className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          {/* Blocks */}
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code2 className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          {/* Link */}
          <div className="relative">
            <BubbleButton
              onClick={() => {
                const existing = editor.getAttributes('link').href as string | undefined;
                setLinkUrl(existing ?? '');
                setShowLinkInput((v) => !v);
              }}
              active={editor.isActive('link')}
              title="Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </BubbleButton>
            {showLinkInput && (
              <div className="absolute bottom-full mb-1 left-0 z-[9999] bg-background border rounded-md shadow-lg p-2 flex gap-2">
                <input
                  type="url"
                  placeholder="Enter URL…"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setLink()}
                  className="flex h-8 w-52 rounded border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLink();
                  }}
                  className="px-2 h-8 bg-primary text-primary-foreground rounded text-sm"
                >
                  Save
                </button>
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().unsetLink().run();
                      setShowLinkInput(false);
                    }}
                    className="px-2 h-8 bg-destructive text-destructive-foreground rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image */}
          <BubbleButton
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </BubbleButton>

          <BubbleDivider />

          <BubbleButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="w-3.5 h-3.5" />
          </BubbleButton>
        </div>
      </BubbleMenu>

      {/* Editable area */}
      <EditorContent
        editor={editor}
        className={`
          prose prose-sm max-w-none px-6 py-5 min-h-[400px]
          focus-within:outline-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:min-h-[380px]
          [&_.ProseMirror]:text-foreground
          [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-2
          [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-1
          [&_.ProseMirror_p]:my-1 [&_.ProseMirror_p]:leading-relaxed
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary/40 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground
          [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-sm [&_.ProseMirror_pre]:font-mono
          [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono
          [&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-4
          [&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:pl-0
          [&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2
          [&_.ProseMirror_ul[data-type=taskList]_li_label]:mt-0.5
          [&_.ProseMirror_.is-empty::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-empty::before]:text-muted-foreground/50 [&_.ProseMirror_.is-empty::before]:pointer-events-none [&_.ProseMirror_.is-empty::before]:float-left [&_.ProseMirror_.is-empty::before]:h-0
        `}
      />

      {/* Hint */}
      <div className="px-6 py-2 border-t border-dashed border-muted text-xs text-muted-foreground/60 select-none">
        Type <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">/</kbd> to insert a block
      </div>
    </div>
  );
}
