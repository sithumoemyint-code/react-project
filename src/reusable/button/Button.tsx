import type { ComponentProps } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<typeof UiButton>

/**
 * Full-width action button built on the shared UI `Button`.
 *
 * Defaults to `type="submit"` and `size="lg"` so it works as a primary form
 * action out of the box. Pass `type="button"` for non-submit actions, and use
 * `variant` / `size` from the underlying UI button when needed.
 *
 * @example
 * ```tsx
 * import { Button } from '@/reusable'
 *
 * // Primary form submit
 * <Button>Sign in</Button>
 *
 * // Secondary / cancel action
 * <Button type="button" variant="outline" onClick={onCancel}>
 *   Cancel
 * </Button>
 *
 * // Destructive action
 * <Button type="button" variant="destructive">
 *   Delete
 * </Button>
 * ```
 */
export function Button({
  type = 'submit',
  size = 'lg',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <UiButton type={type} size={size} className={cn('h-10 w-full', className)} {...props}>
      {children}
    </UiButton>
  )
}
