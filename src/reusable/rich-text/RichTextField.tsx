import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Typography } from '../typography/Typography'
import { RichTextEditor } from './components/rich-text-editor/RichTextEditor'
import type { RichTextToolbarButtonShowItem } from './types/toolbarButtons'

type RichTextFieldProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name registered in the form schema. */
  name: FieldPath<T>
  /** Visible label above the editor. */
  label: string
  /** Optional DOM id. Defaults to the field `name`. */
  id?: string
  placeholder?: string
  className?: string
  /** Minimum editor height. Defaults to `8rem`. */
  minHeight?: string
  /**
   * Extra toolbar buttons in addition to the default set:
   * `Undo`, `Redo`, `Bold`, `Italic`, `Underline`.
   *
   * **All values you can pass**
   *
   * | Value | Notes |
   * | --- | --- |
   * | `Strikethrough` | Strike text |
   * | `Code` | Inline code (alias; same as `Inline code`) |
   * | `Subscript` | Subscript |
   * | `Superscript` | Superscript |
   * | `Inline code` | Inline code |
   * | `Text color` | Text color dropdown |
   * | `Highlight` | Highlight dropdown |
   * | `Heading` | Heading H1–H5 dropdown |
   * | `Bullet list` | Bullet list |
   * | `Numbered list` | Ordered list |
   * | `Task list` | Task checkboxes |
   * | `Blockquote` | Blockquote |
   * | `Code block` | Fenced code block |
   * | `Horizontal rule` | Horizontal line |
   * | `Align left` | Align left |
   * | `Align center` | Align center |
   * | `Align right` | Align right |
   * | `Justify` | Justify text |
   * | `Insert link` | Link dialog |
   * | `Remove link` | Remove link |
   * | `Insert image` | Image file / URL dropdown |
   * | `Insert table` | Insert 3×3 table |
   *
   * Defaults (`Undo`, `Redo`, …) are always on; you cannot hide them with this prop yet.
   *
   * @example Testing-style extras
   * ```tsx
   * buttonShow={['Strikethrough', 'Code', 'Subscript']}
   * ```
   *
   * @example Lists and media
   * ```tsx
   * buttonShow={[
   *   'Heading',
   *   'Bullet list',
   *   'Numbered list',
   *   'Insert link',
   *   'Insert image',
   * ]}
   * ```
   *
   * @example Full optional set (defaults still included)
   * ```tsx
   * buttonShow={[
   *   'Strikethrough',
   *   'Code',
   *   'Subscript',
   *   'Superscript',
   *   'Text color',
   *   'Highlight',
   *   'Heading',
   *   'Task list',
   *   'Blockquote',
   *   'Code block',
   *   'Horizontal rule',
   *   'Align left',
   *   'Align center',
   *   'Insert link',
   *   'Remove link',
   *   'Insert image',
   *   'Insert table',
   * ]}
   * ```
   */
  buttonShow?: readonly RichTextToolbarButtonShowItem[]
}

/**
 * Rich text field wired to `react-hook-form` via Tiptap.
 *
 * Stores HTML string values. Use Zod refinements on plain text if you need length rules.
 *
 * @example
 * ```tsx
 * import { RichTextField } from '@/reusable'
 *
 * <RichTextField
 *   control={control}
 *   name="richDescription"
 *   label="Description"
 *   placeholder="Write a detailed description…"
 *   buttonShow={['Strikethrough', 'Code', 'Subscript']}
 * />
 * ```
 */
export function RichTextField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  placeholder,
  className,
  minHeight,
  buttonShow,
}: RichTextFieldProps<T>) {
  const inputId = id ?? String(name)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <Label htmlFor={inputId}>{label}</Label>
          <RichTextEditor
            id={inputId}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            invalid={fieldState.invalid}
            minHeight={minHeight}
            buttonShow={buttonShow}
          />
          {fieldState.error?.message ? (
            <Typography className="text-xs text-destructive">
              {fieldState.error.message}
            </Typography>
          ) : null}
        </div>
      )}
    />
  )
}
