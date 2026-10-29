import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Typography } from '../typography/Typography'

type Option = { value: string; label: string }

type RadioGroupFieldProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name; value is a single string. */
  name: FieldPath<T>
  /** Visible label above the radios. */
  label: string
  /** Radio options to choose from. */
  options: Option[]
  className?: string
}

/**
 * Single-choice radio group wired to `react-hook-form`.
 *
 * Renders shadcn radio items. Pair with Zod `z.enum([...])` for validation.
 *
 * @example
 * ```tsx
 * import { RadioGroupField } from '@/reusable'
 *
 * <RadioGroupField
 *   control={control}
 *   name="role"
 *   label="Role"
 *   options={[
 *     { value: 'admin', label: 'Admin' },
 *     { value: 'editor', label: 'Editor' },
 *     { value: 'viewer', label: 'Viewer' },
 *   ]}
 * />
 * ```
 */
export function RadioGroupField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  className,
}: RadioGroupFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-2', className)}>
          <Label>{label}</Label>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-col gap-2"
          >
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
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
