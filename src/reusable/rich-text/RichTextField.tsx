import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Typography } from '../typography/Typography'
import { RichTextEditor } from './components/rich-text-editor/RichTextEditor'

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
