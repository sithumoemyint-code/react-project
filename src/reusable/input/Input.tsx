import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Input as UiInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name registered in the form schema. */
  name: FieldPath<T>
  /** Visible label above the input. */
  label: string
  /**
   * Native input type.
   * When `"password"`, a show/hide toggle is rendered automatically.
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
  /** Optional DOM id. Defaults to the field `name`. */
  id?: string
  placeholder?: string
  autoComplete?: string
  /** Extra classes for the outer field wrapper. */
  className?: string
  /** Extra classes for the native input element. */
  inputClassName?: string
  /** Max characters allowed. Also sets the native `maxLength`. */
  maxLength?: number
  /** Show live character count under the input. Defaults to true when `maxLength` is set. */
  showCount?: boolean
}

/**
 * Form field wired to `react-hook-form` with label and validation message.
 *
 * Renders a labeled input via `Controller`. Password fields include an eye
 * toggle to show or hide the value. Field-level errors from the form schema
 * appear under the input.
 *
 * @example
 * ```tsx
 * import { useForm } from 'react-hook-form'
 * import { Input } from '@/reusable'
 *
 * type LoginValues = { username: string; password: string }
 *
 * function LoginForm() {
 *   const { control, handleSubmit } = useForm<LoginValues>()
 *
 *   return (
 *     <form onSubmit={handleSubmit(console.log)}>
 *       <Input
 *         control={control}
 *         name="username"
 *         label="Username"
 *         placeholder="Enter username"
 *         autoComplete="username"
 *       />
 *       <Input
 *         control={control}
 *         name="password"
 *         label="Password"
 *         type="password"
 *         autoComplete="current-password"
 *       />
 *     </form>
 *   )
 * }
 * ```
 */
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
  maxLength,
  showCount,
}: InputProps<T>) {
  const inputId = id ?? String(name)
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const shouldShowCount = showCount ?? maxLength != null

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? '')
        const count = value.length

        return (
          <div className={cn('flex flex-col gap-1.5', className)}>
            <Label htmlFor={inputId}>{label}</Label>
            <div className="relative">
              <UiInput
                {...field}
                id={inputId}
                type={isPassword && showPassword ? 'text' : type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                maxLength={maxLength}
                aria-invalid={fieldState.invalid || undefined}
                className={cn('h-10', isPassword && 'pr-10', inputClassName)}
              />
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition-colors hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="size-4" />
                  ) : (
                    <HiOutlineEye className="size-4" />
                  )}
                </button>
              ) : null}
            </div>
            <div className="flex items-start justify-between gap-2">
              {fieldState.error?.message ? (
                <p className="m-0 text-xs text-destructive">{fieldState.error.message}</p>
              ) : (
                <span />
              )}
              {shouldShowCount ? (
                <p
                  className={cn(
                    'm-0 ml-auto text-xs text-muted-foreground',
                    maxLength != null && count >= maxLength && 'text-destructive',
                  )}
                >
                  {maxLength != null ? `${count}/${maxLength}` : count}
                </p>
              ) : null}
            </div>
          </div>
        )
      }}
    />
  )
}
