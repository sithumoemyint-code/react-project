import { useEffect, useState } from 'react' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type UrlDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  fieldLabel: string
  placeholder: string
  initialValue: string
  confirmLabel: string
  onConfirm: (value: string) => void
}

export function UrlDialog({
  open,
  onOpenChange,
  title,
  description,
  fieldLabel: _fieldLabel,
  placeholder,
  initialValue,
  confirmLabel,
  onConfirm,
}: UrlDialogProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (open) setValue(initialValue)
  }, [open, initialValue])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-xl border border-border bg-background p-6 text-foreground shadow-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-bold">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5 py-2 mt-4"> 
          <Input
            id="rich-text-url"
            type="url"
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onConfirm(value)
                onOpenChange(false)
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm(value)
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
