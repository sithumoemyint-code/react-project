import { useState } from 'react'
import { ChevronDown, Heading } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const HEADING_LEVELS = [1, 2, 3, 4, 5] as const

type ToolbarHeadingDropdownProps = {
  editor: Editor
  /** Active heading level (1–5), or 0 for paragraph. */
  activeLevel: number
}

const HEADING_PREVIEW_CLASS: Record<(typeof HEADING_LEVELS)[number], string> = {
  1: 'text-lg font-bold',
  2: 'text-base font-bold',
  3: 'text-sm font-semibold',
  4: 'text-sm font-medium',
  5: 'text-xs font-medium',
}

export function ToolbarHeadingDropdown({
  editor,
  activeLevel,
}: ToolbarHeadingDropdownProps) {
  const [open, setOpen] = useState(false)
  const label = 'Heading'

  function applyHeading(level: (typeof HEADING_LEVELS)[number] | 0) {
    if (level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level }).run()
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
                      (activeLevel > 0 || open) &&
                        'bg-neutral-300 text-foreground hover:bg-neutral-300 dark:bg-neutral-600 dark:text-foreground dark:hover:bg-neutral-600',
                    )}
                  >
                    <Heading className="size-4" />
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
      <PopoverContent align="start" className="w-36 p-1.5 shadow-md">
        <div className="flex flex-col gap-0.5" role="menu">
          <button
            type="button"
            role="menuitem"
            className={cn(
              'hover:bg-muted rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:bg-muted',
              activeLevel === 0 && 'bg-muted font-medium',
            )}
            onClick={() => applyHeading(0)}
          >
            Paragraph
          </button>
          {HEADING_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              role="menuitem"
              aria-label={`Heading ${level}`}
              className={cn(
                'hover:bg-muted rounded-md px-2 py-1.5 text-left outline-none focus-visible:bg-muted',
                HEADING_PREVIEW_CLASS[level],
                activeLevel === level && 'bg-muted',
              )}
              onClick={() => applyHeading(level)}
            >
              H{level}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
