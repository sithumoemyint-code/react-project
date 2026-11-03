import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ColorOption = {
  label: string
  value: string
}

type ToolbarColorDropdownProps = {
  editor: Editor
  /** Tooltip and trigger aria-label. */
  label: string
  colors: readonly ColorOption[]
  variant: 'text' | 'highlight'
  icon: ReactNode
  /** Highlight the trigger when a non-default color is active. */
  active?: boolean
}

export function ToolbarColorDropdown({
  editor,
  label,
  colors,
  variant,
  icon,
  active,
}: ToolbarColorDropdownProps) {
  const [open, setOpen] = useState(false)

  function applyColor(value: string) {
    if (variant === 'text') {
      if (!value) {
        editor.chain().focus().unsetColor().run()
      } else {
        editor.chain().focus().setColor(value).run()
      }
    } else if (!value) {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().toggleHighlight({ color: value }).run()
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <span className="inline-flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={label}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    className={cn(
                      'h-7 gap-0.5 px-1.5',
                      (active || open) &&
                        'bg-neutral-300 text-foreground hover:bg-neutral-300 dark:bg-neutral-600 dark:text-foreground dark:hover:bg-neutral-600',
                    )}
                  >
                    {icon}
                    <ChevronDown className="size-3 opacity-70" />
                  </Button>
                </span>
              }
            />
          }
        />
        <TooltipContent
          side="bottom"
          sideOffset={6}
          className={cn(
            'border-border bg-popover text-popover-foreground max-w-none rounded-md border px-2.5 py-1.5 text-[12px] leading-normal shadow-sm',
            '!bg-popover !text-popover-foreground',
            '[&_.cn-tooltip-arrow]:hidden',
            open && 'hidden',
          )}
        >
          {label}
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-auto p-2 shadow-md">
        <div className="grid grid-cols-4 gap-1.5" role="menu">
          {colors.map((color) => (
            <button
              key={color.label}
              type="button"
              role="menuitem"
              aria-label={color.label}
              title={color.label}
              className="hover:ring-ring flex size-7 items-center justify-center rounded-md outline-none focus-visible:ring-2"
              onClick={() => applyColor(color.value)}
            >
              <span
                className={cn(
                  'size-5 rounded-full ring-1 ring-border',
                  !color.value && 'bg-background',
                )}
                style={
                  color.value ? { backgroundColor: color.value } : undefined
                }
              />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
