import { useMemo, useState, type ReactNode } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeXml,
  Highlighter,
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
import {
  isToolbarButtonVisible,
  RICH_TEXT_TOOLBAR_GROUPS,
  resolveVisibleToolbarButtons,
  type RichTextToolbarButtonId,
  type RichTextToolbarButtonShowItem,
} from '../../types/toolbarButtons'
import { ToolbarButton } from '../button/ToolbarButton'
import { ToolbarColorDropdown } from '../dropdown/ToolbarColorDropdown'
import { ToolbarDivider } from '../divider/ToolbarDivider'
import { ToolbarHeadingDropdown } from '../dropdown/ToolbarHeadingDropdown'
import { ToolbarImageDropdown } from '../dropdown/ToolbarImageDropdown'
import { UrlDialog } from '../../dialogs/UrlDialog'

type RichTextToolbarProps = {
  editor: Editor
  /** Extra toolbar buttons beyond {@link DEFAULT_RICH_TEXT_BUTTON_SHOW}. */
  buttonShow?: readonly RichTextToolbarButtonShowItem[]
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

export function RichTextToolbar({ editor, buttonShow }: RichTextToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)
  const visible = useMemo(() => resolveVisibleToolbarButtons(buttonShow), [buttonShow])
  const show = (id: RichTextToolbarButtonId) => isToolbarButtonVisible(visible, id)

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

  function renderButton(id: RichTextToolbarButtonId): ReactNode {
    switch (id) {
      case 'Undo':
        return (
          <ToolbarButton
            key={id}
            label="Undo"
            disabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 />
          </ToolbarButton>
        )
      case 'Redo':
        return (
          <ToolbarButton
            key={id}
            label="Redo"
            disabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 />
          </ToolbarButton>
        )
      case 'Bold':
        return (
          <ToolbarButton
            key={id}
            label="Bold"
            pressed={state.isBold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </ToolbarButton>
        )
      case 'Italic':
        return (
          <ToolbarButton
            key={id}
            label="Italic"
            pressed={state.isItalic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </ToolbarButton>
        )
      case 'Underline':
        return (
          <ToolbarButton
            key={id}
            label="Underline"
            pressed={state.isUnderline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline />
          </ToolbarButton>
        )
      case 'Strikethrough':
        return (
          <ToolbarButton
            key={id}
            label="Strikethrough"
            pressed={state.isStrike}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough />
          </ToolbarButton>
        )
      case 'Inline code':
        return (
          <ToolbarButton
            key={id}
            label="Inline code"
            pressed={state.isCode}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </ToolbarButton>
        )
      case 'Subscript':
        return (
          <ToolbarButton
            key={id}
            label="Subscript"
            pressed={state.isSubscript}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <Subscript />
          </ToolbarButton>
        )
      case 'Superscript':
        return (
          <ToolbarButton
            key={id}
            label="Superscript"
            pressed={state.isSuperscript}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <Superscript />
          </ToolbarButton>
        )
      case 'Text color':
        return (
          <ToolbarColorDropdown
            key={id}
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
        )
      case 'Highlight':
        return (
          <ToolbarColorDropdown
            key={id}
            editor={editor}
            label="Highlight"
            colors={HIGHLIGHT_COLORS}
            variant="highlight"
            active={state.hasHighlight}
            icon={<Highlighter className="size-4" />}
          />
        )
      case 'Heading':
        return (
          <ToolbarHeadingDropdown key={id} editor={editor} activeLevel={state.headingLevel} />
        )
      case 'Bullet list':
        return (
          <ToolbarButton
            key={id}
            label="Bullet list"
            pressed={state.isBulletList}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </ToolbarButton>
        )
      case 'Numbered list':
        return (
          <ToolbarButton
            key={id}
            label="Numbered list"
            pressed={state.isOrderedList}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </ToolbarButton>
        )
      case 'Task list':
        return (
          <ToolbarButton
            key={id}
            label="Task list"
            pressed={state.isTaskList}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo />
          </ToolbarButton>
        )
      case 'Blockquote':
        return (
          <ToolbarButton
            key={id}
            label="Blockquote"
            pressed={state.isBlockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote />
          </ToolbarButton>
        )
      case 'Code block':
        return (
          <ToolbarButton
            key={id}
            label="Code block"
            pressed={state.isCodeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeXml />
          </ToolbarButton>
        )
      case 'Horizontal rule':
        return (
          <ToolbarButton
            key={id}
            label="Horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </ToolbarButton>
        )
      case 'Align left':
        return (
          <ToolbarButton
            key={id}
            label="Align left"
            pressed={state.isAlignLeft}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft />
          </ToolbarButton>
        )
      case 'Align center':
        return (
          <ToolbarButton
            key={id}
            label="Align center"
            pressed={state.isAlignCenter}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter />
          </ToolbarButton>
        )
      case 'Align right':
        return (
          <ToolbarButton
            key={id}
            label="Align right"
            pressed={state.isAlignRight}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight />
          </ToolbarButton>
        )
      case 'Justify':
        return (
          <ToolbarButton
            key={id}
            label="Justify"
            pressed={state.isAlignJustify}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify />
          </ToolbarButton>
        )
      case 'Insert link':
        return (
          <ToolbarButton
            key={id}
            label="Insert link"
            pressed={state.isLink}
            onClick={handleInsertLinkClick}
          >
            <Link2 />
          </ToolbarButton>
        )
      case 'Remove link':
        return (
          <ToolbarButton key={id} label="Remove link" onClick={handleRemoveLinkClick}>
            <Unlink />
          </ToolbarButton>
        )
      case 'Insert image':
        return (
          <ToolbarImageDropdown
            key={id}
            editor={editor}
            onInsertFromUrl={() => setImageOpen(true)}
          />
        )
      case 'Insert table':
        return (
          <ToolbarButton
            key={id}
            label="Insert table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <Table />
          </ToolbarButton>
        )
      default:
        return null
    }
  }

  const toolbarItems: ReactNode[] = []
  let hasPreviousGroup = false
  for (const group of RICH_TEXT_TOOLBAR_GROUPS) {
    const buttons = group.filter((id) => show(id)).map((id) => renderButton(id))
    if (buttons.length === 0) continue
    if (hasPreviousGroup) {
      toolbarItems.push(<ToolbarDivider key={`divider-${toolbarItems.length}`} />)
    }
    toolbarItems.push(...buttons)
    hasPreviousGroup = true
  }

  const needsLinkDialog = show('Insert link')
  const needsImageDialog = show('Insert image')

  return (
    <>
      <TooltipProvider delay={300}>
        <div className="border-border bg-muted/40 flex flex-wrap items-center gap-0.5 border-b p-1">
          {toolbarItems}
        </div>
      </TooltipProvider>

      {needsLinkDialog ? (
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
      ) : null}

      {needsImageDialog ? (
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
      ) : null}
    </>
  )
}
