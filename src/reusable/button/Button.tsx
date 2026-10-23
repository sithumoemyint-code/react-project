import type { ComponentProps } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<typeof UiButton>

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
