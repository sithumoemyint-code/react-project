import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type ConfirmAlertDialogProps = {
  /** Element that opens the dialog when clicked. */
  trigger: ReactNode
  /** Dialog heading. */
  title: string
  /** Supporting copy explaining the action. */
  description: string
  /** Confirm button label. Defaults to `"Confirm"`. */
  confirmLabel?: string
  /** Cancel button label. Defaults to `"Cancel"`. */
  cancelLabel?: string
  /** Called when the user confirms. */
  onConfirm: () => void
}

/**
 * Confirmation dialog for destructive or irreversible actions.
 *
 * Wraps shadcn `AlertDialog`. Pass any trigger node (usually a button); on
 * confirm, `onConfirm` runs and the dialog closes.
 *
 * @example
 * ```tsx
 * import { Button, ConfirmAlertDialog } from '@/reusable'
 *
 * <ConfirmAlertDialog
 *   title="Delete record?"
 *   description="This will permanently remove Jane Doe from the table."
 *   confirmLabel="Delete"
 *   onConfirm={() => handleDelete(id)}
 *   trigger={<Button type="button" variant="destructive">Delete</Button>}
 * />
 * ```
 */
export function ConfirmAlertDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<span className="inline-flex" />}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
