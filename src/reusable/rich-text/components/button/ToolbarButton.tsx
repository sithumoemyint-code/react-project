import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export type ToolbarButtonProps = {
  label: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

export function ToolbarButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              aria-pressed={pressed}
              disabled={disabled}
              onClick={onClick}
              className={cn(
                pressed &&
                  'bg-neutral-300 text-foreground hover:bg-neutral-300 dark:bg-neutral-600 dark:text-foreground dark:hover:bg-neutral-600',
              )}
            >
              {children}
            </Button>
          </span>
        }
      />
      <TooltipContent
        side="bottom"
        sideOffset={6}
        className={cn(
          'border-border bg-popover text-popover-foreground max-w-none rounded-md border px-2.5 py-1.5 text-[12px] leading-normal shadow-sm',
          '!bg-popover !text-popover-foreground',
          '[&_.cn-tooltip-arrow]:hidden',
        )}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
