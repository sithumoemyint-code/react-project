import { useEffect, useMemo } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { buildExtensions } from '../../types/buildExtensions'
import { RichTextToolbar } from '../rich-text-toolbar/RichTextToolbar'

export type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  id: string
  placeholder?: string
  invalid?: boolean
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  id,
  placeholder,
  invalid,
  minHeight = '8rem',
}: RichTextEditorProps) {
  const placeholderText = placeholder ?? 'Write something…'
  const extensions = useMemo(() => buildExtensions(placeholderText), [placeholderText])

  const editor = useEditor(
    {
      extensions,
      content: value || '',
      editorProps: {
        attributes: {
          id,
          class: cn(
            'tiptap prose prose-sm dark:prose-invert max-w-none min-h-[inherit] px-2.5 py-2 outline-none',
            'prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1',
            'prose-code:before:content-none prose-code:after:content-none',
            'prose-pre:rounded-md prose-pre:border prose-pre:border-[#3c3c3c] prose-pre:!bg-[#1e1e1e] prose-pre:p-3 prose-pre:!text-[#d4d4d4]',
            'prose-pre:prose-code:bg-transparent prose-pre:prose-code:!text-[#d4d4d4]',
            '[&_.tiptap_pre]:font-mono [&_.tiptap_pre_code]:text-[#d4d4d4]',
            '[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0',
          ),
          'aria-invalid': invalid ? 'true' : 'false',
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(currentEditor.isEmpty ? '' : currentEditor.getHTML())
      },
      onBlur: () => onBlur?.(),
    },
    [extensions, id, invalid],
  )

  useEffect(() => {
    if (!editor) return
    const current = editor.isEmpty ? '' : editor.getHTML()
    const next = value || ''
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [editor, value])

  const characterCount = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) =>
      currentEditor?.storage.characterCount?.characters?.() ?? 0,
  })

  if (!editor) {
    return (
      <div
        className="border-input bg-muted/30 flex min-h-32 items-center justify-center rounded-lg border text-sm text-muted-foreground"
        style={{ minHeight }}
      >
        Loading editor…
      </div>
    )
  }

  return (
    <div
      className={cn(
        'border-input bg-transparent flex flex-col overflow-hidden rounded-lg border transition-colors shadow-none',
        'focus-within:border-ring has-[:focus-visible]:border-ring',
        invalid &&
          'border-destructive ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
      )}
      style={{ minHeight }}
    >
      <RichTextToolbar editor={editor} />
      <div
        className="min-h-[inherit] flex-1 [&_.tiptap]:min-h-[inherit] [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none"
        style={{ minHeight: `calc(${minHeight} - 2.5rem)` }}
      >
        <EditorContent editor={editor} className="min-h-[inherit]" />
      </div>
      <div className="border-border text-muted-foreground border-t px-2.5 py-1 text-xs">
        {characterCount} characters
      </div>
    </div>
  )
}
