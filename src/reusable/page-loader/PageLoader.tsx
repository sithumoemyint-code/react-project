import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

/** Centered spinner shown while a lazy-loaded page chunk downloads. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('grid place-items-center', className)}>
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}
