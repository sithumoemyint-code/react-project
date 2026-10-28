import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type MultiSelectProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name; value should be `string[]`. */
  name: FieldPath<T>
  /** Visible label above the options. */
  label: string
  /** Checkbox options to choose from. */
  options: Option[]
  className?: string
}

/**
 * Multi-select checkbox group wired to `react-hook-form`.
 *
 * Stores selected values as a string array. Use Zod `.array().min(1)` (or
 * similar) for required selections.
 *
 * @example
 * ```tsx
 * import { MultiSelect } from '@/reusable'
 *
 * <MultiSelect
 *   control={control}
 *   name="skills"
 *   label="Skills"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'typescript', label: 'TypeScript' },
 *   ]}
 * />
 * ```
 */
export function MultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  className,
}: MultiSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : []

        function toggle(value: string, checked: boolean) {
          field.onChange(
            checked
              ? [...selected, value]
              : selected.filter((item) => item !== value),
          )
        }

        return (
          <div className={cn('flex flex-col gap-2', className)}>
            <Label>{label}</Label>
            <div className="flex flex-col gap-2">
              {options.map((option) => {
                const isChecked = selected.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggle(option.value, checked === true)
                      }
                    />
                    {option.label}
                  </label>
                )
              })}
            </div>
            {fieldState.error?.message ? (
              <p className="m-0 text-xs text-destructive">{fieldState.error.message}</p>
            ) : null}
          </div>
        )
      }}
    />
  )
}
