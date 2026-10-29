import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea as UiTextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Typography } from '../typography/Typography'

type TextareaProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name registered in the form schema. */
  name: FieldPath<T>
  /** Visible label above the textarea. */
  label: string
  /** Optional DOM id. Defaults to the field `name`. */
  id?: string
  placeholder?: string
  /** Visible rows. Defaults to 4. */
  rows?: number
  className?: string
}

/**
 * Multi-line text field wired to `react-hook-form`.
 *
 * Renders a labeled shadcn textarea with validation message support.
 *
 * @example
 * ```tsx
 * import { TextareaField } from '@/reusable'
 *
 * <TextareaField
 *   control={control}
 *   name="notes"
 *   label="Notes"
 *   placeholder="Short description for this record"
 *   rows={4}
 * />
 * ```
 */
export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  placeholder,
  rows = 4,
  className,
}: TextareaProps<T>) {
  const inputId = id ?? String(name)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <Label htmlFor={inputId}>{label}</Label>
          <UiTextarea
            {...field}
            id={inputId}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid || undefined}
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
