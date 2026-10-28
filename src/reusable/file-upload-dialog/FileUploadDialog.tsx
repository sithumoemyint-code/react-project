import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type FileUploadDialogProps = {
  /** Called with the chosen file and a local object URL for preview. */
  onUploaded?: (file: File, previewUrl: string) => void
  /** Native `accept` filter. Defaults to `"image/*"`. */
  accept?: string
  /** Button label. Defaults to `"Upload avatar"`. */
  triggerLabel?: string
}

/**
 * File upload button that opens the native file picker (no dialog popup).
 *
 * Shows a loading toast while “uploading”, then calls `onUploaded` with the
 * file and a `blob:` preview URL. Render any preview UI yourself outside this
 * component.
 *
 * @example
 * ```tsx
 * import { FileUploadDialog } from '@/reusable'
 *
 * <FileUploadDialog
 *   triggerLabel="Upload avatar"
 *   accept="image/*"
 *   onUploaded={(file, previewUrl) => {
 *     setAvatarUrl(previewUrl)
 *   }}
 * />
 *
 * {avatarUrl ? (
 *   <img src={avatarUrl} alt="Preview" className="size-16 rounded-md object-cover" />
 * ) : null}
 * ```
 */
export function FileUploadDialog({
  onUploaded,
  accept = 'image/*',
  triggerLabel = 'Upload avatar',
}: FileUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(file: File | null) {
    if (!file) return

    setUploading(true)
    const toastId = toast.loading('Uploading file...')
    const previewUrl = URL.createObjectURL(file)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onUploaded?.(file, previewUrl)
    toast.success('Avatar uploaded', { id: toastId })
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        className="h-10 w-auto min-w-[9rem]"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Spinner className="size-4" /> : <Upload className="size-4" />}
        {triggerLabel}
      </Button>
    </>
  )
}
