import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type SelectFieldProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name; value is a single string. */
  name: FieldPath<T>
  /** Visible label above the select. */
  label: string
  /** Dropdown options. */
  options: Option[]
  /** Placeholder when nothing is selected. */
  placeholder?: string
  className?: string
}

/**
 * Single-select dropdown wired to `react-hook-form`.
 *
 * Uses shadcn `Select`. Pass `options` as `{ value, label }[]`.
 *
 * @example
 * ```tsx
 * import { SelectField } from '@/reusable'
 *
 * <SelectField
 *   control={control}
 *   name="department"
 *   label="Department"
 *   placeholder="Select department"
 *   options={[
 *     { value: 'engineering', label: 'Engineering' },
 *     { value: 'product', label: 'Product' },
 *   ]}
 * />
 * ```
 */
export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
  className,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <Label>{label}</Label>
          <Select
            value={field.value}
            onValueChange={(value) => {
              if (value != null) field.onChange(value)
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={fieldState.invalid || undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error?.message ? (
            <p className="m-0 text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
