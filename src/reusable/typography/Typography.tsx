import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FontFamily = 'inter' | 'poppins'

type TypographyProps = {
  children: ReactNode
  /** Font family. Defaults to Inter. */
  fontFamily?: FontFamily
  /** Font weight. Defaults to 400 via class. Pass a value to override. */
  weight?: 400 | 500 | 600 | 700
  /** Font size in px. Defaults to 14 via class. Pass a value to override. */
  size?: number
  /** Text color. Defaults to `#000` via class. Pass a value to override. */
  color?: string
  /**
   * HTML tag to render. Defaults to `span` (no browser margin).
   * Display is `block` by default so stacked text stays on separate lines.
   * Pass `className="inline"` when you need inline text.
   */
  as?: ElementType
  className?: string
  style?: CSSProperties
}

const fontFamilyClass: Record<FontFamily, string> = {
  inter: 'font-inter',
  poppins: 'font-poppins',
}

/**
 * Reusable text component with switchable Inter / Poppins fonts.
 *
 * Defaults: Inter, weight 400, size 14px, color `#000`.
 * Tailwind classes in `className` (e.g. `text-xs text-destructive`) override those defaults.
 * Use `size` / `weight` / `color` props only when you want inline style overrides.
 *
 * @example
 * ```tsx
 * import { Typography } from '@/reusable'
 *
 * <Typography>Demo: admin / admin123</Typography>
 *
 * <Typography className="text-xs text-destructive">Error message</Typography>
 *
 * <Typography fontFamily="poppins" weight={600} size={16} color="#f06a37">
 *   Heading text
 * </Typography>
 * ```
 */
export function Typography({
  children,
  fontFamily = 'inter',
  weight,
  size,
  color,
  as: Component = 'span',
  className,
  style,
}: TypographyProps) {
  return (
    <Component
      className={cn(
        'block !m-0 text-[14px] font-normal text-[#000]',
        fontFamilyClass[fontFamily],
        className,
      )}
      style={{
        ...(weight != null ? { fontWeight: weight } : {}),
        ...(size != null ? { fontSize: `${size}px` } : {}),
        ...(color != null ? { color } : {}),
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
