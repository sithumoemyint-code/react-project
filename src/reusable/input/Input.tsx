import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Input as UiInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
  id?: string
  placeholder?: string
  autoComplete?: string
  className?: string
  inputClassName?: string
}

export function Input<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  id,
  placeholder,
  autoComplete,
  className,
  inputClassName,
}: InputProps<T>) {
  const inputId = id ?? String(name)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          <Label htmlFor={inputId}>{label}</Label>
          <UiInput
            {...field}
            id={inputId}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid || undefined}
            className={cn('h-10', inputClassName)}
          />
          {fieldState.error?.message ? (
            <p className="m-0 text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
