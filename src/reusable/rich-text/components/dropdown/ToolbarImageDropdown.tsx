import { useRef, useState } from 'react'
import { ChevronDown, ImageIcon, Link2 } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ToolbarImageDropdownProps = {
  editor: Editor
  onInsertFromUrl: () => void
}

export function ToolbarImageDropdown({ editor, onInsertFromUrl }: ToolbarImageDropdownProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const label = 'Insert image'

  async function handleFileChange(file: File | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Uploading image...')
    const previewUrl = URL.createObjectURL(file)

    await new Promise((resolve) => setTimeout(resolve, 500))

    editor.chain().focus().setImage({ src: previewUrl, alt: file.name }).run()
    toast.success('Image inserted', { id: toastId })
    setUploading(false)
    setOpen(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleImageUrlClick() {
    setOpen(false)
    onInsertFromUrl()
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
      />
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
                      disabled={uploading}
                      className={cn(
                        'h-7 gap-0.5 px-1.5',
                        open &&
                          'bg-neutral-300 text-foreground hover:bg-neutral-300 dark:bg-neutral-600 dark:text-foreground dark:hover:bg-neutral-600',
                      )}
                    >
                      {uploading ? (
                        <Spinner className="size-4" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
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
        <PopoverContent align="start" className="w-44 p-1.5 shadow-md">
          <div className="flex flex-col gap-0.5" role="menu">
            <button
              type="button"
              role="menuitem"
              disabled={uploading}
              className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:bg-muted disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
            >
              <ImageIcon className="size-4 shrink-0" />
              <span>Image</span>
            </button>
            <button
              type="button"
              role="menuitem"
              className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:bg-muted"
              onClick={handleImageUrlClick}
            >
              <Link2 className="size-4 shrink-0" />
              <span>Image URL</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
