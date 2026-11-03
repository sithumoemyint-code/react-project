import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TiptapSubscript from '@tiptap/extension-subscript'
import TiptapSuperscript from '@tiptap/extension-superscript'
import { Table as TiptapTable } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import UnderlineExtension from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

export function buildExtensions(placeholderText: string) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: false,
    }),
    UnderlineExtension,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        class: 'text-primary underline underline-offset-2',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded-md max-w-full h-auto',
      },
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    TiptapSubscript,
    TiptapSuperscript,
    TiptapTable.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder: placeholderText,
    }),
    CharacterCount,
  ]
}
