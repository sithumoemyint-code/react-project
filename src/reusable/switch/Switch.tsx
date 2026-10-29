import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Typography } from '../typography/Typography'

type SwitchFieldProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name; value should be `boolean`. */
  name: FieldPath<T>
  /** Label shown next to the switch. */
  label: string
  /** Optional helper text under the label. */
  description?: string
  className?: string
}

/**
 * Boolean switch field wired to `react-hook-form`.
 *
 * Renders a shadcn switch with label (and optional description). Use
 * `z.boolean()` in your schema.
 *
 * @example
 * ```tsx
 * import { SwitchField } from '@/reusable'
 *
 * <SwitchField
 *   control={control}
 *   name="active"
 *   label="Active status"
 *   description="Inactive records stay visible but marked as inactive."
 * />
 * ```
 */
export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <div className="flex items-center gap-3">
            <Switch
              id={String(name)}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
            />
            <div className="min-w-0">
              <Label htmlFor={String(name)}>{label}</Label>
              {description ? (
                <Typography className="text-xs text-muted-foreground">
                  {description}
                </Typography>
              ) : null}
            </div>
          </div>
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
