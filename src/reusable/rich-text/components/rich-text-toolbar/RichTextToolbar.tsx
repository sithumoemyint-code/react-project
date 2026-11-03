import { useState } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeXml,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Palette,
  Quote,
  Redo2,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
  Undo2,
  Unlink,
} from 'lucide-react'
import { useEditorState, type Editor } from '@tiptap/react'
import { toast } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { HIGHLIGHT_COLORS, TEXT_COLORS } from '../../types/constants'
import { ToolbarButton } from '../button/ToolbarButton'
import { ToolbarColorDropdown } from '../dropdown/ToolbarColorDropdown'
import { ToolbarDivider } from '../divider/ToolbarDivider'
import { ToolbarHeadingDropdown } from '../dropdown/ToolbarHeadingDropdown'
import { UrlDialog } from '../../dialogs/UrlDialog'

type RichTextToolbarProps = {
  editor: Editor
}

function hasTextSelection(editor: Editor) {
  const { empty, from, to } = editor.state.selection
  return !empty && from !== to
}

function requireTextSelection(editor: Editor) {
  if (hasTextSelection(editor)) return true
  toast.error('Select text in the editor first', {
    description: 'Highlight the text you want to link or unlink, then try again.',
  })
  return false
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)

  function handleInsertLinkClick() {
    if (!requireTextSelection(editor)) return
    setLinkOpen(true)
  }

  function handleRemoveLinkClick() {
    if (!requireTextSelection(editor)) return
    if (!editor.isActive('link')) {
      toast.error('No link on selected text', {
        description: 'Select text that already has a link to remove it.',
      })
      return
    }
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor.isActive('bold'),
      isItalic: currentEditor.isActive('italic'),
      isUnderline: currentEditor.isActive('underline'),
      isStrike: currentEditor.isActive('strike'),
      isCode: currentEditor.isActive('code'),
      headingLevel: [1, 2, 3, 4, 5].find((level) =>
        currentEditor.isActive('heading', { level }),
      ) ?? 0,
      isBulletList: currentEditor.isActive('bulletList'),
      isOrderedList: currentEditor.isActive('orderedList'),
      isTaskList: currentEditor.isActive('taskList'),
      isBlockquote: currentEditor.isActive('blockquote'),
      isCodeBlock: currentEditor.isActive('codeBlock'),
      isLink: currentEditor.isActive('link'),
      isAlignLeft: currentEditor.isActive({ textAlign: 'left' }),
      isAlignCenter: currentEditor.isActive({ textAlign: 'center' }),
      isAlignRight: currentEditor.isActive({ textAlign: 'right' }),
      isAlignJustify: currentEditor.isActive({ textAlign: 'justify' }),
      isSubscript: currentEditor.isActive('subscript'),
      isSuperscript: currentEditor.isActive('superscript'),
      canUndo: currentEditor.can().undo(),
      canRedo: currentEditor.can().redo(),
      linkHref: (currentEditor.getAttributes('link').href as string | undefined) ?? '',
      textColor: (currentEditor.getAttributes('textStyle').color as string | undefined) ?? '',
      hasHighlight: currentEditor.isActive('highlight'),
    }),
  })

  return (
    <>
      <TooltipProvider delay={300}>
        <div className="border-border bg-muted/40 flex flex-wrap items-center gap-0.5 border-b p-1">
          <ToolbarButton
            label="Undo"
            disabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Bold"
            pressed={state.isBold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            pressed={state.isItalic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            pressed={state.isUnderline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            pressed={state.isStrike}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough />
          </ToolbarButton>
          <ToolbarButton
            label="Inline code"
            pressed={state.isCode}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </ToolbarButton>
          <ToolbarButton
            label="Subscript"
            pressed={state.isSubscript}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <Subscript />
          </ToolbarButton>
          <ToolbarButton
            label="Superscript"
            pressed={state.isSuperscript}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <Superscript />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarColorDropdown
            editor={editor}
            label="Text color"
            colors={TEXT_COLORS}
            variant="text"
            active={Boolean(state.textColor)}
            icon={
              <Palette
                className="size-4"
                style={state.textColor ? { color: state.textColor } : undefined}
              />
            }
          />

          <ToolbarColorDropdown
            editor={editor}
            label="Highlight"
            colors={HIGHLIGHT_COLORS}
            variant="highlight"
            active={state.hasHighlight}
            icon={<Highlighter className="size-4" />}
          />

          <ToolbarDivider />

          <ToolbarHeadingDropdown editor={editor} activeLevel={state.headingLevel} />
          <ToolbarButton
            label="Bullet list"
            pressed={state.isBulletList}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            pressed={state.isOrderedList}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </ToolbarButton>
          <ToolbarButton
            label="Task list"
            pressed={state.isTaskList}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo />
          </ToolbarButton>
          <ToolbarButton
            label="Blockquote"
            pressed={state.isBlockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote />
          </ToolbarButton>
          <ToolbarButton
            label="Code block"
            pressed={state.isCodeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeXml />
          </ToolbarButton>
          <ToolbarButton
            label="Horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Align left"
            pressed={state.isAlignLeft}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft />
          </ToolbarButton>
          <ToolbarButton
            label="Align center"
            pressed={state.isAlignCenter}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            pressed={state.isAlignRight}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight />
          </ToolbarButton>
          <ToolbarButton
            label="Justify"
            pressed={state.isAlignJustify}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Insert link"
            pressed={state.isLink}
            onClick={handleInsertLinkClick}
          >
            <Link2 />
          </ToolbarButton>
          <ToolbarButton label="Remove link" onClick={handleRemoveLinkClick}>
            <Unlink />
          </ToolbarButton>
          <ToolbarButton label="Insert image" onClick={() => setImageOpen(true)}>
            <ImageIcon />
          </ToolbarButton>
          <ToolbarButton
            label="Insert table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <Table />
          </ToolbarButton>
        </div>
      </TooltipProvider>

      <UrlDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        title="Insert link"
        description="Add a URL for the selected text. Leave empty to remove the link."
        fieldLabel="URL"
        placeholder="https://example.com"
        initialValue={state.linkHref || 'https://'}
        confirmLabel="Apply link"
        onConfirm={(url) => {
          if (!hasTextSelection(editor)) {
            toast.error('Select text in the editor first')
            return
          }
          const trimmed = url.trim()
          if (!trimmed) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
        }}
      />

      <UrlDialog
        open={imageOpen}
        onOpenChange={setImageOpen}
        title="Insert image"
        description="Paste the image URL to embed it in the document."
        fieldLabel="Image URL"
        placeholder="https://example.com/image.png"
        initialValue="https://"
        confirmLabel="Insert image"
        onConfirm={(url) => {
          const trimmed = url.trim()
          if (!trimmed) return
          editor.chain().focus().setImage({ src: trimmed }).run()
        }}
      />
    </>
  )
}
