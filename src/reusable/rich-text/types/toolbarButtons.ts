/** Toolbar control ids for {@link RichTextField} `buttonShow`. */
export const RICH_TEXT_TOOLBAR_BUTTON_IDS = [
  'Undo',
  'Redo',
  'Bold',
  'Italic',
  'Underline',
  'Strikethrough',
  'Inline code',
  'Subscript',
  'Superscript',
  'Text color',
  'Highlight',
  'Heading',
  'Bullet list',
  'Numbered list',
  'Task list',
  'Blockquote',
  'Code block',
  'Horizontal rule',
  'Align left',
  'Align center',
  'Align right',
  'Justify',
  'Insert link',
  'Remove link',
  'Insert image',
  'Insert table',
] as const

export type RichTextToolbarButtonId = (typeof RICH_TEXT_TOOLBAR_BUTTON_IDS)[number]

/** Shorthand accepted in `buttonShow` (maps to a {@link RichTextToolbarButtonId}). */
export type RichTextToolbarButtonAlias = 'Code'

/** Item allowed in {@link RichTextField} `buttonShow`. */
export type RichTextToolbarButtonShowItem = RichTextToolbarButtonId | RichTextToolbarButtonAlias

/** Shown when `buttonShow` is omitted. */
export const DEFAULT_RICH_TEXT_BUTTON_SHOW: RichTextToolbarButtonId[] = [
  'Undo',
  'Redo',
  'Bold',
  'Italic',
  'Underline',
]

const BUTTON_ALIASES: Record<string, RichTextToolbarButtonId> = {
  Code: 'Inline code',
  'Inline code': 'Inline code',
  Strikethrough: 'Strikethrough',
  Subscript: 'Subscript',
}

export function normalizeToolbarButtonId(id: string): RichTextToolbarButtonId | null {
  const alias = BUTTON_ALIASES[id]
  if (alias) return alias
  if ((RICH_TEXT_TOOLBAR_BUTTON_IDS as readonly string[]).includes(id)) {
    return id as RichTextToolbarButtonId
  }
  return null
}

/** Default buttons plus any extras from `buttonShow` (deduped, toolbar order preserved). */
export function resolveVisibleToolbarButtons(
  buttonShow?: readonly RichTextToolbarButtonShowItem[],
): Set<RichTextToolbarButtonId> {
  const resolved = new Set<RichTextToolbarButtonId>()

  for (const id of DEFAULT_RICH_TEXT_BUTTON_SHOW) {
    resolved.add(id)
  }

  if (buttonShow) {
    for (const raw of buttonShow) {
      const id = normalizeToolbarButtonId(raw)
      if (id) resolved.add(id)
    }
  }

  return resolved
}

/** Toolbar groups separated by dividers (order matters). */
export const RICH_TEXT_TOOLBAR_GROUPS: RichTextToolbarButtonId[][] = [
  ['Undo', 'Redo'],
  [
    'Bold',
    'Italic',
    'Underline',
    'Strikethrough',
    'Inline code',
    'Subscript',
    'Superscript',
  ],
  ['Text color', 'Highlight'],
  [
    'Heading',
    'Bullet list',
    'Numbered list',
    'Task list',
    'Blockquote',
    'Code block',
    'Horizontal rule',
  ],
  ['Align left', 'Align center', 'Align right', 'Justify'],
  ['Insert link', 'Remove link', 'Insert image', 'Insert table'],
]

export function isToolbarButtonVisible(
  visible: Set<RichTextToolbarButtonId>,
  id: RichTextToolbarButtonId,
) {
  return visible.has(id)
}
